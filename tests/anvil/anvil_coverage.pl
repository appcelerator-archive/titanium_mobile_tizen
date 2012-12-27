# USAGE: Place in base directory of Anvil and execute. api.jsca must be in the same directory.
#
# PURPOSE:
#
# Read all Anvil source files and compile a list of all Titanium calls made in the Anvil
# source files, in order to determine the statistics of Titamium functionality coverage in Anvil.
#
# INPUT:
#
# - Anvil source files
# - api.jsca file
#
# OUTPUT: 
#
# - "anvil_all_references.txt" - list of references to all Titanium methods and properties that are called
#   inside the source files.
# - "titanium_all_symbols.txt" - list of all Titanium methods and properties, in the "Ti.XXXX.YYYY" format.
# - "anvil_coverage_stats.txt" - list of all Titanium namespaces, with Anvil coverage statistics (sorted
#   from least coverage to best coverage.
#
# NOTE:
# - Anvil source code parsing is only so accurate. The parser tries to resolve types of variables to infer
#   calls, but it is not 100% accurate. The data is for general guidance, not exact calculations.
# - When calculating coverage, the scipt is not aware that some properties and methods were inherited 
#   from base namespaces.


use File::Find;
use File::Basename;
use Cwd;
use Data::Dumper;
use JSON;


#1 Global data

# Intermediate list of all Titanium calls in Anvil. May contain items like Ti.Filesystem.getfile.size instead
# of Ti.Filesystem.File.size; correct types are resolved later.
my %calls = ();         

my $files = 0;                          # counter of processed files
my $countFunctionsAndProperties = 0;    # counter of processed properties

my $jsca;                               # Titanium JSCA file as a perl object

# All Titanium functions and properties.
# Hash: "Ti.XXXX.YYYY" --> "Ti.AAAA.BBBB", where Ti.XXXX.YYYY is a function/property,
# and Ti.AAAA.BBBB is its return type. Only for functions/properties that have
# Titanium return types (i.e. String/Number returning functions/properties are ignored).
# Parsed out of the JSCA file.
my %jscaFunctionsAndProperties = ();

# All Titanium entities (functions, properties, namespaces, etc) in the format Ti.XXXX.YYYY.
my %jscaAll = ();

# Hash: Titanium namespace -> Number of properties and functions in the namespace.
# For all Titanium namespaces.
my %jscaTypesMembers = ();

# Hash: Titanium namespace -> Number of properties and functions of that namespace, referenced in Anvil.
# For all Titanium namespaces. 
my %anvilTypesMembers = ();


#1 Main logic

#2 Parse Anvil source code and generate a list of calls

open DEBUG, ">debug.txt";

my $dir = getcwd();

print "Parsing Anvil source code...\n";
find(\&process, $dir);
print "     Parsed $files files\n";

# %calls is now initialized.

# Now, for each reference like Ti.createXXXXXX, we also add a reference like
# Ti.XXXXXX, where XXXXXX is a type.
foreach $call(sort keys %calls)
{
    $call =~ s/create([\w\d]*)/\1/;
    $calls{$call} = " ";
}

#2 Read and parse JSCA

print "\nReading JSCA...\n";

my $jsca_content = do {
    local $/ = undef;
    open JSCA, "api.jsca" or die "could not open $file: $!";
    <JSCA>;
};
print "     Read " . length($jsca_content) . " bytes\n";
print "\nParsing JSCA (20 seconds)...\n";
$jsca = decode_json($jsca_content);


#2 Substitute functions to respective returned types

# Substitute items like Ti.UI.function.property (where function returns some type Ti.XXXXX)
# into Ti.UI.XXXXX.property. For that, a hash is created which maps function names to their
# return types (same for properties).

#3 Generate dictionary: Functions --> Return types

print "\nAnalyzing JSCA...\n";
genJscaFuncDictionary();
print "     Found $countFunctionsAndProperties functions and properties\n";


#3 Substitute function calls with types

# Find references to functions, and substitute them with returned types.

my %calls3 = ();        # final list of all Titanium calls in Anvil

foreach $call(keys %calls)
{
    foreach $functionOrProperty(keys %jscaFunctionsAndProperties)
    {
        if(index($call, "$functionOrProperty.")!=-1)
        {
            my $was = $call;
            my $subst = $jscaFunctionsAndProperties{$functionOrProperty};
            $call =~ s/$functionOrProperty/$subst/;
            last;
        }
    }
    $calls3{$call} = '';
}

# Write out the references.

open ALLANVIL, ">anvil_all_references.txt";
foreach $call(sort keys %calls3)
{
    print ALLANVIL "$call\n";
}


#2 Count Anvil references

# To know Anvil coverage statistics, for each namespace, we compare the number of methods and properties
# referenced in Anvil to the total number of methods and properties in Titanium.

foreach $type(keys %jscaTypesMembers)
{
    $anvilTypesMembers{$type} = 0;
}

foreach $call(keys %calls3)
{
    foreach $type(keys %jscaTypesMembers)
    {
        if(index($call, $type) != -1)
        {
            $anvilTypesMembers{$type}++;
        }
    }
}

my %frequencies = ();

foreach $type(sort keys %anvilTypesMembers)
{
    #print OUTPUT "Type $type: coverage " . $anvilTypesMembers{$type} . " out of " . $jscaTypesMembers{$type} . "\n";
    if($jscaTypesMembers{$type}==0)
    {
        next;
    }
    $frequencies{$anvilTypesMembers{$type}/$jscaTypesMembers{$type}} = $frequencies{$anvilTypesMembers{$type}/$jscaTypesMembers{$type}} . " $type";
}

open(OUTPUT, ">anvil_coverage_stats.txt");
foreach $frequency(sort keys %frequencies)
{
    print OUTPUT $frequency . ": \n";
    my @tmptypes = split(/ /, $frequencies{$frequency});
    foreach $tmptype(@tmptypes)
    {
        print OUTPUT "       " . $tmptype . "\n" unless $tmptype eq '';
    }
    print OUTPUT "\n";
}

open ALLJSCAF, ">titanium_all_symbols.txt";
foreach $jscaprop(sort keys %jscaAll)
{
    print ALLJSCAF "$jscaprop\n";
}

# end of script


##################################################################################

#1 Process Anvil source code

sub process
{
    my $file = $_;
    if($file eq '.' || $file eq '..')
    {
        return;
    }
    if($file =~ m/\.js$/)
    {
        processjs($File::Find::name);
    }
}

sub processjs()
{
    # Process a JavaScript source file.
    # Find all references to Titanium namespaces, properties and methods,
    # and add them to the %calls list.

    my $path = shift;
    my %variables = ();
    $files++;

    open(JS, $path) or return;

    foreach $line (<JS>)  
    {   
        chomp($line);
        $line =~ s/Titanium\./Ti./g;
        
        if($line =~ m/(Ti\.[a-zA-Z0-9_.]*)/)
        {
            # This is a simple reference to a Titanium namespace, function or property.
            # Add it to the list.
            $calls{"$1"} = " ";
        }
        
        if($line =~ m/([a-zA-Z0-9_.]*)\s?[^=]=[^=]\s?(Ti\.[^( ;]*)/ && $1 ne '')
        {
            # This is an *assignment operation*, where on the right there is a reference
            # to a Titanium namespace, function or property. Record it to the %variables list.
            # (Example: var x = Ti.UI.createLabel(); )
            $variables{$1} = $2;
            $calls{"$variables{$1}"} = " "; $calls3
        }

        foreach $var(sort keys %variables)
        {
            if($line =~ m/$var\.([a-zA-Z0-9_]*)/)
            {
                # This is a reference to a function or a property of a previously declared variable.
                # Construct the proper reference.
                # Example: x.title = "hello";
                # Since we know that "x = Ti.UI.createLabel()", we record this reference as
                # Ti.UI.createLabel.title.
                $calls{"$variables{$var}.$1"} = " ";
            }
            if($line =~ m/$var\.([a-zA-Z0-9_.]*)/)
            {
                # This is a reference to a function or a property of a previously declared variable.
                # The only difference from the above dot is that if the reference has a dot at the end, 
                # the dot will be excluded.
                $calls{"$variables{$var}.$1"} = " ";
            }
        }
    }
}


#1 Process JSCA

sub genJscaFuncDictionary()
{
    my @types = @{$jsca->{types}};
    print "     Found " . scalar (@types) . " types\n";
    foreach $type(@types)
    {
        parseType($type);
    }
}

sub parseType()
{
    my %type = %{shift};
    my $typename = $type->{name};
    $typename =~ s/Titanium\./Ti./;
    $jscaTypesMembers{$typename} = 0;

    my @properties = @{$type->{properties}};

    foreach $property(@properties)
    {
        $countFunctionsAndProperties++;
        my $proptype = $property->{type};
        if (index($proptype,"Titanium.") != -1)
        {
            # This is a property that returns a Titanium object.
            my $propname = $type->{name} . "." . $property->{name};
            $propname =~ s/Titanium\./Ti./;
            $proptype =~ s/Titanium\./Ti./;
            $jscaFunctionsAndProperties{$propname} = $proptype;
        }

        my $propname = $type->{name} . "." . $property->{name};
        $propname =~ s/Titanium\./Ti./;
        $jscaAll{$propname} = " ";
        $jscaTypesMembers{$typename}++;
    }

    my @functions = @{$type->{functions}};

    foreach $function(@functions)
    {
        $countFunctionsAndProperties++;
        my @functypes = @{$function->{returnTypes}};
        if( scalar(@functypes)>0 )
        {
            my $functype = $functypes[0];
            my $functypename = $functype->{type};
            if (index($functypename,"Titanium.") != -1)
            {
                # This is a function that returns a Titanium object.
                my $funcname = $type->{name} . "." . $function->{name};
                $funcname =~ s/Titanium\./Ti./;
                $functypename =~ s/Titanium\./Ti./;
                $jscaFunctionsAndProperties{$funcname} = $functypename;
            }
        }
        my $funcname = $type->{name} . "." . $function->{name};
        $funcname =~ s/Titanium\./Ti./;
        $jscaAll{$funcname} = " ";
        $jscaTypesMembers{$typename}++;
    }
}
