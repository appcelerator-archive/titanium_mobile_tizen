exports.TitaniumInterface = (function(){
	var fs = require('fs');

	var namespace = '';
	
	var classesWithWrap = [],
		wrappedTypes = [];

	var moduleConstants = '';

	var primitives = ['DOMString', 'unsigned long', 'unsigned long long', 'long', 'boolean', 'short', 'unsigned short', 'float', 'double', 'enum'];

	var options = {
		jsStubsFolder: 'output/jsStubs/',
		titaniumFolder: 'Ti/Tizen/',
		dependenciesPaths: 'Ti/Tizen/'
		
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
					res = '\'\'';
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

	function viewForInterface(interfaceO, lastComma, main, primitives, inheritanceTree){
		var result = '';
		var constants = '';
		var operations = '';
		var readOnlyAttr = '';
		var attr = '';
		var list = interfaceO.members;

		function paramFormat(param){
			var res;
			if(param.name == 'onsuccess') {
				res = 'function(object){ on' + param.type.idlType + '(object, onsuccess); }';
			} else if(param.name == 'onerror'){
				res = 'function(e) { onerror.call(null, new WebAPIError(e)); }';
			} else {
				res = param.name;
			}
			return res;
		}


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

							if ((primitives.indexOf(arg[h].type.idlType) > -1) || (arg[h].type.idlType.indexOf('Callback') > -1)) {
								argsTizen += paramFormat(arg[h]);

								argsTizen += arg[h+1] ? ', ' : '';
							} else {
								argsTizen += arg[h].optional ? arg[h].name + ' ? ' + arg[h].name + '._obj : ' + arg[h].name : arg[h].name + '._obj';
								argsTizen += arg[h+1] ? ', ' : '';
							}
						}

						operations+=argsProto;
						operations+=') {\n';

						if(main) {//For main classes
							var returnType = 0, isArray = 0;
								try {
									returnType = list[k].idlType.idlType,
									isArray = list[k].idlType.array;
								} catch (e) {}
							if ((primitives.indexOf(returnType) === -1) && (returnType) && (returnType.indexOf('Callback') === -1) && (returnType !== 'void')) {
								if (wrappedTypes.indexOf(returnType) === -1) {
									wrappedTypes.push(returnType);
								}
								if (classesWithWrap.indexOf(namespace.toLowerCase() + '=' + returnType) === -1) {
									classesWithWrap.push(namespace.toLowerCase() + '=' + returnType);
								}
								if (isArray == false) {
									operations += '			return this._wrap(tizen.' + namespace.toLowerCase() + '.' + list[k].name + '('+argsTizen+'));\n';
								} else {
									operations += '			var objects = tizen.' + namespace.toLowerCase() + '.' + list[k].name + '(' + argsTizen + '),\n';
									operations += '				i = 0,\n				objectsCount = objects.length,\n				result = [];\n';
									operations += '			for(; i < objectsCount; i++) {\n';
									operations += '				result.push(this._wrap(objects[i]));\n';
									operations += '			}\n';
									operations += '			return result;\n';
								}
							} else {
								operations+= '			return tizen.' + namespace.toLowerCase() + '.' + list[k].name + '('+argsTizen+');\n';
							}

						} else {//For sub classes
							operations+= '			return this._obj.' + list[k].name + '('+argsTizen+');\n';
						}
						operations+=(!list[k+1] && lastComma)?'		}\n':'		},\n\n';
						break;
					case 'attribute':
						if(list[k].readonly) {
							readOnlyAttr +='			' + list[k].name + ': {\n';//+ checkValue(list[k].idlType);
							readOnlyAttr +='				get: function() {\n';
							readOnlyAttr +='					return this._obj.' + list[k].name+ ';\n';
							readOnlyAttr +='				}\n';
							readOnlyAttr +='			},\n';
						} else {
							attr +='			' + list[k].name + ': {\n';//+ checkValue(list[k].idlType);
							attr +='				get: function() {\n';
							attr +='					return this._obj.' + list[k].name+ ';\n';
							attr +='				},\n';
							attr +='				set: function(value) {\n';
							attr +='					this._obj.' + list[k].name+ ' = value;\n';
							attr +='				}\n';
							attr +='			},\n';
						}
						break;
					case 'const':
						constants+='			' + list[k].name + ': '+ list[k].value;
						constants+=(!list[k+1] && lastComma)? ' //' + list[k].idlType.idlType + '\n':',' + ' //' + list[k].idlType.idlType + '\n';
						break;
				}

			}
		}


		constants += moduleConstants;
		moduleConstants = '';

		if(constants) {
			result += '		constants: {\n'
			result += constants;
			result += '		},\n\n';
		};
		if(readOnlyAttr) {
			result += '		constants: {\n'
			result += readOnlyAttr;
			result += '		},\n\n';
		};
		if(attr) {
			result += '		properties: {\n'
			result += attr;
			result += '		},\n\n';
		}
		if(operations) {
			result += operations;
		}

		return result;
	}
	
	var result = {
		folderName: '',
		jsonObjects: [],
		primitives: ['DOMString', 'unsigned long', 'unsigned long long', 'long', 'boolean', 'short', 'unsigned short', 'float', 'double', 'enum'],
		dA : null,
		inheritanceTree: {},
		getPrimitives: function(jsonObject) {
			var definitions = jsonObject[0].definitions,
				defCount = definitions.length,
				i = 0,
				idlType,
				defType;
			for (; i < defCount; i++) {
				defType = definitions[i].type;
				if ((defType !== 'typedef') && (defType !== 'enum') && (defType !== 'dictionary')) {
					continue;
				}
				if (defType === 'enum') {
					this.primitives.push(definitions[i].name);
				} else if (defType === 'dictionary') {
					this.primitives.push(definitions[i].name);
				} else if (definitions[i].idlType.idlType === 'DOMString') {
					this.primitives.push(definitions[i].name);
				}
			}
		},
		getInheritanceTree: function(jsonObject) {
			var definitions = jsonObject[0].definitions,
				defCount = definitions.length,
				i = 0,
				defType, inheritance, name;
			for (; i < defCount; i++) {
				defType = definitions[i].type;
				inheritance = definitions[i].inheritance;
				name = definitions[i].name;
				if (defType === 'interface') {
					if (inheritance && (Object.prototype.toString.call(inheritance) === '[object Array]') && (inheritance.length > 0)) {
						if (Object.keys(this.inheritanceTree).length === 0) {
							this.inheritanceTree[inheritance[0]] = [name];
						} else {
							if (this.inheritanceTree[inheritance[0]]) {
								this.inheritanceTree[inheritance[0]].push(name);
							} else {
								this.inheritanceTree[inheritance[0]] = [name];
							}
						}
					}
				}
			}
		},
		genStub: function(jsonObject){
			this.folderName = namespace = jsonObject[0].name;
			fs.mkdir(options.jsStubsFolder+jsonObject[0].name);
			this.dA = jsonObject[0].definitions;
			var view = '';
			view += 'define([\'Ti/_/lang\'], function(lang) {\n';
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
			imp += '	return lang.setObject(\'Ti.Tizen.' + this.folderName + '\', {\n\n';
			imp+= this.getMainInterface(modName[0]);
			imp+= this.getCreators();
			imp += '	});\n';
			imp += this.callBacksFunctionOnly;
			this.callBacksFunctionOnly = '';
			return imp;
		},

		getVaribles: function(){
			var view = '';
			var vars = [];
			var list = this.dA;
			
			loop(function(i){


				function genString(name, value){
					return generateFormat(name).replace(/-/g, '_').replace(/[^a-zA-Z0-9_]+/g, '') +'_'+ value.toUpperCase().replace(/-/g, '_').replace(/[^a-zA-Z0-9_]+/g, '') + ': \'' + value+'\'';
				}

				function generateFormat(stringV){
					var str = stringV;
					var arr = str.split('');

					for(var i = 0, len = arr.length; i<len; i++) {
						if(arr[i] == arr[i].toUpperCase()) {
							(i !== 0) && (arr[i] = '_' + arr[i]);
						}
					}
					str = arr.join('').toUpperCase();
					return str;
				}

				if(list[i] && list[i].type == 'typedef'){
					//vars.push(list[i].name);
				} else if(list[i] && list[i].type == 'enum') {
					for(var k = 0, l = list[i].values.length; k < l; k++) {
						moduleConstants+='			'+genString(list[i].name, list[i].values[k])+',\n';
					}
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


		getMainInterface: function(name){
			var view = '',
				j = 0,
				parentClassName = (name.indexOf('Manager') >= 0) ? name.substring(0, name.indexOf('Manager')) : name,
				parentClasses, parentClassesCount;

			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'interface' && this.dA[i].name == name) {
					view = viewForInterface(this.dA[i], false, true, this.primitives);
					if (this.inheritanceTree[parentClassName]) {
						parentClasses = this.inheritanceTree[parentClassName];
						parentClassesCount = parentClasses.length;
						view += '		_wrap: function(object) {\n';
						view += '			var result;\n';
						for (; j < parentClassesCount; j++) {
							view += '			if (object.toString() === \'[object ' + parentClasses[j] + ']\') {\n';
							view += '				result = this.create' + parentClasses[j] + '(object);\n';
							view += '			}\n';
						}
						view += '			return result;\n';
						view += '		},\n';
						for (j = 0; j < wrappedTypes.length; j++) {
							if (classesWithWrap.indexOf(parentClassName.toLowerCase() + '=' + wrappedTypes[j]) > -1) {
								console.log('Wrapped type = ' + wrappedTypes[j]);
								classesWithWrap.splice(classesWithWrap.indexOf(parentClassName.toLowerCase() + '=' + wrappedTypes[j]), 1);
							}
						}
					} else {
						var s = '';
						for (j = 0; j < wrappedTypes.length; j++) {
							if (classesWithWrap.indexOf(parentClassName.toLowerCase() + '=' + wrappedTypes[j]) > -1) {
								//view += '		_wrap: function(object) {\n';
								s += '			if (object.toString() === \'[object ' + wrappedTypes[j] + ']\') {\n';
								s += '				return this.create' + wrappedTypes[j] + '(object);\n';
								s += '			}\n';
								//view += '		},\n';
							}
						}
						if (s.length > 0) {
							view += '		_wrap: function(object) {\n';
							view += s;
							view += '		},\n';
						}
					}
					this.dA.splice(i, 1);
				}
			}
			//console.log(classesWithWrap);
			return view;
		},

		constructors: [],
		callBacksFunctionOnly: '',
		getCreators: function(){
			var view = '';
			var SuperBasicInterfaces = []; //Interfaces what used for inheritances

			//We should do this loop because we need to know
			//which interfaces used for inheritances and push them
			//to SuperBasicInterfaces array
			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'interface') {
					if(this.dA[i].inheritance.length > 0) {
						for(var u = 0; u < this.dA[i].inheritance.length; u++) {
							SuperBasicInterfaces.push(this.dA[i].inheritance[u]);
						}
					}
				}
			}

			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'interface') {
					var count = 0;
					var maxCountOfArgs = 0;
					var cP = '';
					var q;
					var lenExtAttrs = this.dA[i].extAttrs.length;
					for(q=0; q<lenExtAttrs; q++) {
						if(this.dA[i].extAttrs[q].name == 'Constructor') {
							count++;
							(maxCountOfArgs < this.dA[i].extAttrs[q].arguments.length) && (maxCountOfArgs = this.dA[i].extAttrs[q].arguments.length);
						}
					}
					this.constructors = [];
					var res = [];
					//This loop for check if interface has a constructor
					//and create a modules
					for(q=0; q<lenExtAttrs; q++) {
						if(this.dA[i].extAttrs[q].name == 'Constructor') {
								if(count > 1) {//more than one constructor
									res = [];
									for(var a = 0, b = this.dA[i].extAttrs[q].arguments.length; a<b; a++) {
										res.push('args.' + this.dA[i].extAttrs[q].arguments[a].name);
									}

								} else {
									res = [];
									for(var z = 0, x = this.dA[i].extAttrs[q].arguments.length; z < x; z++) {
										res.push('args.'+this.dA[i].extAttrs[q].arguments[z].name);
										cP += 'args.'+this.dA[i].extAttrs[q].arguments[z].name +'/*'+this.dA[i].extAttrs[q].arguments[z].type.idlType+'*/';
										cP += (q == lenExtAttrs-1 && z == x-1) ? '' : ', ';
									}
								}

								this.constructors.push(res);

								if(q == lenExtAttrs-1) { // this check because interface can has many Constructors, but js need only one
									view+= '\n		create'+this.dA[i].name+': function(args) {\n';
									view+= '			return new (require(\''+options.titaniumFolder+this.folderName+'/'+this.dA[i].name+'\'))(args);\n'
									view+= '		},\n';
									this.createBaseInterface(this.dA[i].name.replace(/\s/g,''), this.dA[i].inheritance, this.dA[i], false, false);
								}
						} else if(this.dA[i].extAttrs[q].name == 'NoInterfaceObject') {
								if(this.dA[i].extAttrs[0].name !== 'Callback') {

									//var indexInheritance = false;
									//If this interface used for inheritance we should create empty module,
									//without constructors, methods, properties and constants.
									/*if(SuperBasicInterfaces.indexOf(this.dA[i].name) > -1) {
										indexInheritance = true;
									}*/

									this.createBaseInterface(this.dA[i].name.replace(/\s/g,''), this.dA[i].inheritance, this.dA[i], false, true);
								} else if(this.dA[i].extAttrs[0].name == 'Callback' && this.dA[i].extAttrs[0].value == 'FunctionOnly' && (this.dA[i].members[0].arguments[0] && this.primitives.indexOf(this.dA[i].members[0].arguments[0].type.idlType) == -1)) {
									this.callBacksFunctionOnly += '	function on'+this.dA[i].name+'(object, onsuccess) { \n';
									this.callBacksFunctionOnly += '		onsuccess.call(null, new ';
									if(this.dA[i].members.length == 1) {
										this.callBacksFunctionOnly += this.dA[i].members[0].arguments[0].type.idlType +'(object));\n'
									}
									this.callBacksFunctionOnly += '	};\n\n';
								}
						}
					}
				}
			}
			return view;
		},


		createBaseInterface: function(name, inheritance, interfaceO, noInterfaceObject, withoutConstructor){
			//create view
			var folderName = this.folderName+'/';
			var view = 'define([\'Ti/_/declare\''
			//inheritance.length == 0 && (view+=', \'Ti/_/Evented\'');
			loop(function(i){view+=', \''+options.titaniumFolder+ folderName +inheritance[i] +'\'';}, inheritance);
			view+= '], function(declare'
			//inheritance.length == 0 && (view+=', Evented');
			loop(function(i){view+=', '+inheritance[i];}, inheritance);
			view+= ') {\n'
			view+= '	return declare(\'Ti.Tizen.'+this.folderName+'.'+ name+'\', ';
			//inheritance.length == 0 && (view+='Evented, ');
			if(inheritance.length > 0) {
				loop(function(i){view+= ''+inheritance[i] + ', ';}, inheritance);
			} else if(!noInterfaceObject) {
				view += 'null, '
			}
			view+= '{\n';
			//Non-singleton constructor
			if(!noInterfaceObject && !withoutConstructor) {
				view += '		constructor: function(args) {\n';
				view += '			if(args.toString() === \'[object ' + name + ']\') {\n';
				view += '				this._obj = args;\n';
				view += '			} else {\n';
				if(this.constructors.length > 1) {
					for(var i= this.constructors.length-1; i >= 0; i--) {
						if(i == this.constructors.length-1) {
							view += '				if (';
						} else {
							view += ' else if (';
						}
						for(var k = 0, len = this.constructors[i].length; k<len; k++) {
							view += '\''+this.constructors[i][k].replace('args.', '')+'\' in args';
							k !==len-1 && (view+= ' && ');
						}
						view += ') {\n';
						view += '					this._obj = new tizen.' + name + '('+this.constructors[i].join(', ')+');\n';
						view += '				}';
					}
					view += ' else {\n';
					view += '					Ti.API.error(\'Constructor with given parameters doesn\\\'t exists\');\n'
					view += '				}\n';
				} else if(this.constructors.length > 0) {
					view += '				this._obj = new tizen.'+ name + '('+ this.constructors[0].join(', ')+');\n';
					this.constructors = [];
				}
				view += '			}\n';
				view += '		},\n\n';
			}
			//Non-singleton constructor END
			!noInterfaceObject && (view+=viewForInterface(interfaceO, true, false, this.primitives));
			view+= '	});\n';
			view+= '});';
			//create file
			fs.writeFileSync(options.jsStubsFolder + folderName + name + '.js', view);
			this.pathes.add('"'+options.dependenciesPaths + folderName + name+'": []');
		},


		pathes: {
			pathes: '',
			add: function(path) {
				this.pathes+= path+',\n';
			},
			get: function(){
				return this.pathes;
			}
		}
	}
	return result;
})()





