exports.TitaniumInterface = (function(){
	var fs = require('fs');
	var options = {
		jsStubsFolder: 'output/jsStubs/',
		titaniumFolder: 'Ti/Tizen/',
		pytonPath: 'Ti/Tizen/Ti.Tizen/'
		
	};
	function loop(func, list) {
		if(list && list.length > 0) {
			for(var i=0, len = list.length; i<len; i++) {
				func(i);
			}
		 }	
	}
	function checkValue(type) {
		var res;
		switch(type.idlType){
			case 'DOMString':
				if(type.array){
					res = '[]';
				} else if(type.nullable) {
					res = null; 
				} else {
					res = '""'; 
				}
				break; 
			case 'object':
				res = null;
				break;
			case 'boolean':
				res = false;
				break;
			case 'long':
				res = 0;
				break;	
			case 'unsigned long':
				res = 0;
				break;
			case 'unsigned long long':
				res = 0;
				break;
			case 'short':
				res = 0;
				break;	
			case 'unsigned short':
				res = 0;
				break;
			case 'float':
				res = 0.0;
				break;
			case 'double':
				res = 0.0;
				break;	
			default:
				res = null;	
		}
		return res;
	}
	var methods = {
		methods: '',
		type: 'sync ',
		add: function(methods){
			this.methods+= methods;
		},
		get: function(){
			return this.methods;
		}
	}
	function viewForInterface(interfaceO, lastComma){
		var result = '';
		var constants = '';
		var operations = '';
		var attributes = '';
		var list = interfaceO.members; 
		if(list.length>0) {
			for(var k = 0, l = list.length; k<l; k++) {
				switch(list[k].type) {
					case 'operation':
						operations+='		';
						operations+= list[k].name + ': function(';
						//putting arguments for methods 
						var arg = list[k].arguments;
						var argsProto = '';
						var argsTizen = '';

						for(var h=0; h<arg.length; h++) {
							//with comments for attributes
							argsProto += arg[h].name + ' /*'+arg[h].type.idlType+'*/';
							argsProto += (arg[h+1])?', ':'';

							//without comments for attributes
							argsTizen+=arg[h].name;
							argsTizen+=(arg[h+1])?', ':'';
						}

						operations+=argsProto;
						operations+=') {\n';
						operations+= '			return tizen.' + list[k].name + '('+argsTizen+')\n';
						operations+=(!list[k+1] && lastComma)?'		}\n':'		},\n\n';
						break;
					case 'attribute':
						attributes+='		' + list[k].name + ': '+ checkValue(list[k].idlType);
						attributes+=(!list[k+1] && lastComma)? ' //' + list[k].idlType.idlType + '\n':',' + ' //' + list[k].idlType.idlType + '\n';
						break;
					case 'const':
						constants+='			' + list[k].name + ': '+ list[k].value;
						constants+=(!list[k+1] && lastComma)? ' //' + list[k].idlType.idlType + '\n':',' + ' //' + list[k].idlType.idlType + '\n';
						break;
				}

			}
		}
		if(constants) {
			result += '		constants: {\n'
			result += constants;
			result += '		},\n\n';
		}
		if(attributes) {
			result += attributes;
		}
		if(operations) {
			result += operations;
		}
		return result;
	}
	
	var result = {
		folderName: '',
		dA : null,
		genStub: function(jsonObject){
			this.folderName = jsonObject[0].name;
			fs.mkdir(options.jsStubsFolder+jsonObject[0].name);
			this.dA = jsonObject[0].definitions;
			var view = '';
			view += 'define(["Ti/_/Evented", "Ti/_/lang"], function(Evented, lang) {\n';
			view +=this.implementation(jsonObject[0].definitions);
			view +='});';
			fs.writeFileSync(options.jsStubsFolder + jsonObject[0].name.replace(/\s/g,'') + '.js', view);
		},


		implementation: function(){
			var name = '';
			var index = null;

			//main loop for saparete differents parts 
			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'implements') {
					name = this.dA[i]['implements'];
					this.dA.splice(i, 1);
				}
			}
			var modName = this.findImpObject(name);
			var imp = '';
			imp +=this.getVaribles();
			imp += '	return lang.setObject("Ti.Tizen.'+modName[1]+'", Evented, {\n\n';
			imp+= this.getMainInterfase(modName[0]);
			imp+= this.getCreaters();
			imp += '	});\n';
			return imp;
		},


		getVaribles: function(){
			var view = '';
			var vars = [];
			var list = this.dA;
			
			loop(function(i){
				if(list[i] && list[i].type == 'typedef'){
					vars.push(list[i].name);	
				}
			}, list);
			(function(){
				if(vars.length > 0) {
					view+= '	var ';
					for(var i=0, len=vars.length; i<len; i++) {
						view+= vars[i];
						view+=(i==len-1)?';\n':', ';
					}
				}
			})();	
			return view;
		},

		findImpObject: function(name){
			var names = [];
			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'interface' && this.dA[i].name == name) {
					names[0] = this.dA[i].members[0].idlType.idlType;
					names[1] = this.dA[i].members[0].name;
					this.dA.splice(i, 1);
				}
			}
			return names;
		},


		getMainInterfase: function(name){
			var view = '';
			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'interface' && this.dA[i].name == name) {
					view = viewForInterface(this.dA[i], false);
					this.dA.splice(i, 1);
				}
			}
			return view;
		},


		getCreaters: function(){
			var view = '';
			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'interface') {
					var argsProto = '';
					var argsTizen = '';
					for(var q=0, s = this.dA[i].extAttrs.length; q<s; q++) {
						switch(this.dA[i].extAttrs[q].name) {
							case 'Constructor':
								for(var z = 0, x = this.dA[i].extAttrs[q].arguments.length; z < x; z++) {
									argsProto += this.dA[i].extAttrs[q].arguments[z].name +' /*'+this.dA[i].extAttrs[q].arguments[z].type.idlType+'*/';
									argsProto += (q == s-1 && z == x-1) ? '' : ', ';

									argsTizen += this.dA[i].extAttrs[q].arguments[z].name;
									argsTizen += (q == s-1 && z == x-1) ? '' : ', ';
								}
								if(q == s-1) { // this check because interfase can has many Constructors, but js need only one
									view+= '		create'+this.dA[i].name+': function('+ argsProto +') {\n';
									
									view+= '			return new (require("'+options.titaniumFolder+this.folderName+'/'+this.dA[i].name+'"))('+ argsTizen +');\n'
									view+= (!this.dA[i+1])?'		}\n':'		},\n\n';

									//here we create file from which we can use "require" and can create examplare of class
									this.createBaseInterface(this.dA[i].name.replace(/\s/g,''), this.dA[i].inheritance, this.dA[i]);
								}
								break;
							case 'NoInterfaceObject':
								if(this.dA[i].extAttrs[0].name !== 'Callback') {
									this.createBaseInterface(this.dA[i].name.replace(/\s/g,''), this.dA[i].inheritance, this.dA[i]);
								} 
								break;
						}
					}
				}
			}
			return view;
		},


		createBaseInterface: function(name, inheritance, interfaceO){
			//create view
			var folderName = this.folderName+'/';
			var view = 'define(["Ti/_/declare"'
			inheritance.length == 0 && (view+=', "Ti/_/Evented"');
			loop(function(i){view+=', "'+options.titaniumFolder+ folderName +inheritance[i] +'"';}, inheritance);
			view+= '], function(declare'
			inheritance.length == 0 && (view+=', Evented');
			loop(function(i){view+=', '+inheritance[i];}, inheritance);
			view+= '){\n'
			view+= '	return declare("Ti.Tizen.'+ name+'", ';
			inheritance.length == 0 && (view+='Evented, ');
			loop(function(i){view+= ''+inheritance[i] + ', ';}, inheritance);
			view+= '{\n';
			view+=viewForInterface(interfaceO, true);
			view+= '	});\n';
			view+= '});';
			//create file
			fs.writeFileSync(options.jsStubsFolder + folderName + name + '.js', view);
			this.pathes.add(options.pytonPath + folderName + name);
			this.methods += methods.get();
			methods.methods = '';
		},


		pathes: {
			pathes: '',
			add: function(path) {
				this.pathes+= path+',\n';
			},
			get: function(){
				return this.pathes;
			}
		},


		methods:''
	}
	return result;
})()





