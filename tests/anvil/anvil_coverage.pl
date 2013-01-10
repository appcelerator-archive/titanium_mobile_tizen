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

# All Titanium types in the format Ti.XXXX.YYYY.
my %jscaTypes = ();

# All Titanium entities (functions, properties, namespaces, etc) in the format Ti.XXXX.YYYY.
my %jscaAll = ();

# Hash: Titanium namespace -> Number of properties and functions in the namespace.
# For all Titanium namespaces.
# Purpose: generation of Anvil coverage stats.
my %jscaTypesMembers = ();

# Hash: Titanium namespace -> Number of properties and functions of that namespace, referenced in Anvil.
# For all Titanium namespaces. 
# Purpose: generation of Anvil coverage stats.
my %anvilTypesMembers = ();


# ============================================================================== #

#1 Main logic

#2 Parse Anvil source code and generate a list of calls

my $dir = getcwd();

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

# Generate dictionary: Functions --> Return types

print "\nAnalyzing JSCA...\n";
genJscaFuncDictionary();
print "     Found $countFunctionsAndProperties functions and properties\n";


#2 Parse Anvil source code and generate a list of calls

open DEBUG, ">debug.txt";

my $dir = getcwd();

print "\nParsing Anvil source code...\n";
find(\&process, $dir);
print "     Parsed $files files\n";
print "     Found references to " . scalar(keys %calls) . " entities \n";

open ALLANVIL, ">anvil_all_references.txt";
foreach $call(sort keys %calls)
{
    print ALLANVIL "$call\n";
}


#2 Count Anvil references

print "\nGenerating stats...\n";

# To know Anvil coverage statistics, for each namespace, we compare the number of methods and properties
# referenced in Anvil to the total number of methods and properties in Titanium.

foreach $type(keys %jscaTypesMembers)
{
    $anvilTypesMembers{$type} = 0;
}

# Count how many methods and properties were referenced for each type. (O(n*n))

foreach $call(keys %calls)
{
    foreach $type(keys %jscaTypesMembers)
    {
        if($call =~ m/$type\.[a-zA-Z0-9_]+$/)
        {
            $anvilTypesMembers{$type}++;
        }
    }
}

# Sort by frequency

my %frequencies = ();

foreach $type(sort keys %anvilTypesMembers)
{
    if($jscaTypesMembers{$type}==0)
    {
        next;
    }
    $frequencies{$anvilTypesMembers{$type}/$jscaTypesMembers{$type}} = $frequencies{$anvilTypesMembers{$type}/$jscaTypesMembers{$type}} . " $type";
}

# Write out

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

# Write out all Titanium references

open ALLJSCAF, ">titanium_all_symbols.txt";
foreach $jscaprop(sort keys %jscaAll)
{
    print ALLJSCAF "$jscaprop\n";
}

# end of script



# =========================================================================================== #

#1 Process JSCA

# Generate %jscaFunctionsAndProperties from $jsca

sub genJscaFuncDictionary()
{
    my @types = @{$jsca->{types}};
    print "     Found " . scalar (@types) . " types\n";
    foreach $type(@types)
    {
        parseType($type);
    }
}


# genJscaFuncDictionary() worker

sub parseType()
{
    my %type = %{shift};
    my $typename = $type->{name};
    if(!($typename =~ s/Titanium\./Ti./))
    {
        return;
    }
    $jscaTypes{$typename} = ' ';
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
        my $return_types = scalar(@functypes);

        # Functions can return several different types. Find a Titanium type among them.
        foreach $functype(@functypes)
        {
            my $functypename = $functype->{type};
            if (index($functypename,"Titanium.") != -1)
            {
                # This is a function that returns a Titanium object.
                my $funcname = $type->{name} . "." . $function->{name};
                $funcname =~ s/Titanium\./Ti./;
                $functypename =~ s/Titanium\./Ti./;
                $jscaFunctionsAndProperties{$funcname} = $functypename;
                last;
            }
        }
        my $funcname = $type->{name} . "." . $function->{name};
        $funcname =~ s/Titanium\./Ti./;
        $jscaAll{$funcname} = " ";
        $jscaTypesMembers{$typename}++;
    }
}


#1 Process Anvil source code


# Process an ANvil source file.

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


# Process an ANvil source file (process() worker)

sub processjs()
{
    # Process a JavaScript source file.
    # Find all references to Titanium namespaces, properties and methods,
    # and add them to the %calls list.
    # Processing is sophisticated: for example, the following code will be processed
    # as expected:
    #
    # var x = Ti.UI.createButton();
    # x.label = "hello";
    #
    # In this case, the script will report that Ti.UI.Button.label is referenced 
    # (covered by tests).

    my $path = shift;
    #print DEBUG "\n\n$path\n\n";
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
            # Add it to the list of references.
            if(defined($jscaAll{$1}) || defined ($jscaTypes{$1}))
            {
                $calls{"$1"} = " ";
            }
            else
            {
                #print DEBUG "Garbage: $1\n";
            }
        }
        
        if($line =~ m/([a-zA-Z0-9_]*)\s?=\s?(Ti\.[^( ;]*)/ && $1 ne '')
        {
            # This is an *assignment operation*, where on the right there is a reference
            # to a Titanium namespace, function or property, and on the left, the variable name.
            # The goal of this block is to remember the type of the variable, so that if it's references
            # later, we know its type and can resolve the statement properly.
            
            if(defined($jscaFunctionsAndProperties{$2}))
            {
                my $type = $jscaFunctionsAndProperties{$2};
                $variables{$1} = $type;
                $calls{$type} = " ";
            }
        }

        foreach $var(sort keys %variables)
        {
            if($line =~ m/$var\.([a-zA-Z0-9_]*)/)
            {
                # This is a reference to a function or a property of a previously declared variable.
                # Remember the reference.
                my $type = "$variables{$var}.$1";
                if(defined($jscaAll{$type}) || defined ($jscaTypes{$type}))
                {
                    $calls{$type} = " ";
                }
                else
                {
                }
            }

            if($line =~ m/([a-zA-Z0-9_]*)\s?=\s?$var\.([a-zA-Z0-9_]*)/ && $1 ne '')
            {
                #print DEBUG "recursive var in: $line\n";
                # This is an *assignment operation*, where on the right there is a reference
                # to a previously declared variable, plus a call.
                # For example, variable "db" may have been declared previously like this:
                # var db   = Ti.Database.open('Test');
                # and now we're processing the following line:
                # resultSet = db.execute('SELECT * FROM stuff');
                # In this block, we know that db's type is Ti.Database.DB, and the return type
                # of execute is Ti.Database.ResultSet, so we remember that resultSet's type is
                # Ti.Database.ResultSet. 

                my $tmp = "$variables{$var}.$2";
                my $type = $jscaFunctionsAndProperties{$tmp};
                if(defined ($jscaTypes{$type}))
                {
                    #print DEBUG "    var $1 = $type;\n";
                    $variables{$1} = $type;
                }
                else
                {
                    #print DEBUG "     Garbage: var $1 = $type;\n";
                    #print DEBUG "    (type of $var is " . $variables{$var} . ")\n";
                }
            }
        }
    }
}


