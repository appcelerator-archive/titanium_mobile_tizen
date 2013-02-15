function ParseFiles(){
     //node js modules
    var fs = require('fs'),
        PEG = require('pegjs');
    //_________________________________________________
    
    //parcer for idl files
    var parser = PEG.buildParser(fs.readFileSync('./lib/grammar.peg', 'utf8'));
    
    
    var idlparser;
    var lastStub = false;

    this.options = {
        idlExtension: '.idl',
        jsExtension: '.js',
        jsParcerFolder: './node_modules/',
        idlFolder: 'idlFolder/',
        jsStubsFolder: 'output/jsStubs/',
        pytonPath: 'Ti/Tizen/'
        
    };
    
    this.init = function(){
        var self = this;
        var code = parser.toSource();
        
        //create js parser
        fs.writeFile(this.options.jsParcerFolder + 'WebIDLParser.js', 'exports.Parser = ' + code, 
        
        //callback when js parser is ready
        function(){
            fs.mkdirSync('output', 0755);
			fs.mkdirSync('output/jsStubs', 0755);
            //when js parser created we can use this module
            idlparser = require(self.options.jsParcerFolder + 'WebIDLParser');  
            
            //create all js stubs
            self.createAllStubs(self.options.idlFolder);
        });
    };

    //create all stubs from folder
    var ti = require('./TitaniumInterface');
    
    this.createAllStubs = function(folder){
        var idlFiles = fs.readdirSync(folder);
        
        if(idlFiles.length > 0) {
            for(var i = 0, len = idlFiles.length; i<len; i++ ) {
                var name = idlFiles[i].replace(this.options.idlExtension, '');
                if(i == len-1) {
                    lastStub = true;
                }
                try {
                    console.log('Create stub');
                    this.createStub(name);
                } catch(err) {
                    console.log('Something wrong with ' +idlFiles[i] + '-->' + err);
                } 
            }

            //Generate auxiliary files
            fs.writeFileSync('output/' + 'path.txt', ti.TitaniumInterface.pathes.get());
        } else {
            console.log('Folder with .idl files is empty');
        }
    };

    //create one file
    this.createStub = function(name){
        var idlText = fs.readFileSync(this.options.idlFolder + name + this.options.idlExtension, 'utf8');
        var realObject = idlparser.Parser.parse(idlText);
        // Write out the resulting stub
        ti.TitaniumInterface.genStub(realObject, lastStub);

        // Auxiliary information for dependencies
        ti.TitaniumInterface.pathes.add(this.options.pytonPath + name.replace(/\s/g,''));
    };
}

var parseFiles = new ParseFiles();
parseFiles.init();