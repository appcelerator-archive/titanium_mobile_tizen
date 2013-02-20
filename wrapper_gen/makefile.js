function ParseFiles(){
     //node js modules
    var fs = require('fs'),
        PEG = require('pegjs'),
		wrench = require('wrench');
    //_________________________________________________
    
    //parcer for idl files
    var parser = PEG.buildParser(fs.readFileSync('./lib/grammar.peg', 'utf8'));
    
    
    var idlparser;
    
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
			var failSilently = function() {
				console.log('Some problems');
			}
			wrench.rmdirSyncRecursive('output', failSilently);
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
	
	this.getAllPrimitives = function(folder) {
		var files = fs.readdirSync(folder),
			i = 0,
			filesCount = files.length;

		if (filesCount > 0) {
			for (; i < filesCount; i++) {
				
			}
		}
	}
    
    this.createAllStubs = function(folder){
        var idlFiles = fs.readdirSync(folder);

        if(idlFiles.length > 0) {
            for(var i = 0, len = idlFiles.length; i<len; i++ ) {
                var name = idlFiles[i].replace(this.options.idlExtension, '');
                
                try {
                    this.createStub(name, true); // if second parameter = true then we'll save json obhects to array
                } catch(err) {
                    console.log('Something wrong with ' +idlFiles[i] + '-->' + err);
                } 
            }

            //Generate auxiliary files
            fs.writeFileSync(this.options.jsStubsFolder + 'path.txt', ti.TitaniumInterface.pathes.get());
        } else {
            console.log('Folder with .idl files is empty');
        }
        
        if(idlFiles.length > 0) {
            for(var i = 0, len = idlFiles.length; i<len; i++ ) {
                var name = idlFiles[i].replace(this.options.idlExtension, '');
                
                try {
                    this.createStub(name);
                } catch(err) {
                    console.log('Something wrong with ' +idlFiles[i] + '-->' + err);
                } 
            }

			console.log('Primitives:');
			console.log(ti.TitaniumInterface.primitives.join('    '));
			
            //Generate auxiliary files
           // fs.writeFileSync(this.options.jsStubsFolder + 'path.txt', ti.TitaniumInterface.pathes.get());
        } else {
            console.log('Folder with .idl files is empty');
        }
    };
	
    //create one file
    this.createStub = function(name, saveFlag /*if true - save json objects*/){
        var idltext = fs.readFileSync(this.options.idlFolder + name + this.options.idlExtension, 'utf8');
        var realObject = idlparser.Parser.parse(idltext);

		if (saveFlag) {
			ti.TitaniumInterface.jsonObjects.push(realObject);
			ti.TitaniumInterface.getPrimitives(realObject);
		} else {
			// Write out the resulting stub
			ti.TitaniumInterface.genStub(realObject);

			// Auxiliary information for dependencies
			ti.TitaniumInterface.pathes.add(this.options.pytonPath + name.replace(/\s/g,''));
		}
    };
}

var parseFiles = new ParseFiles();
parseFiles.init();