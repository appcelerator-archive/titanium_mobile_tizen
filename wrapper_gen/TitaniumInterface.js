exports.TitaniumInterface = (function(){
	var fs = require('fs');

	var namespace = '';

	var options = {
		jsStubsFolder: 'output/jsStubs/',
		titaniumFolder: 'Ti/Tizen/',
		pytonPath: 'Ti/Tizen/'
		
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

	function viewForInterface(interfaceO, lastComma, main, primitives, inheritanceTree){
		var result = '';
		var constants = '';
		var operations = '';
		var readOnlyAttr = '';
		var attr = '';
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

							if ((primitives.indexOf(arg[h].type.idlType) > -1) || (arg[h].type.idlType.indexOf('Callback') > -1)) {
								argsTizen += arg[h].name;
								argsTizen += arg[h+1] ? ', ' : '';
							} else {
								argsTizen += arg[h].name + '._obj';
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
							//console.log('Name = ' + list[k].name + 'Return type = ' + returnType);
							if ((primitives.indexOf(returnType) === -1) && (returnType) && (returnType.indexOf('Callback') === -1) && (returnType !== 'void')) {
							//	console.log('Is array = ' + isArray);
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
						console.log('Inheritance for ' + name + ': ');
						console.log('Name = ' + inheritance[0]);
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
			view += 'define(["Ti/_/lang"], function(lang) {\n';
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
			//imp +=this.getVaribles();
			imp += '	return lang.setObject("Ti.Tizen.' + this.folderName + '", {\n\n';
			imp+= this.getMainInterface(modName[0]);
			imp+= this.getCreators();
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
						view += '		}\n';
						console.log(view);
					}
					this.dA.splice(i, 1);
				}
			}
			return view;
		},


		getCreators: function(){
			var view = '';
			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'interface') {
					var count = 0;
					var countOfArgs = 0;
					var cP = '';
					var q;
					var lenExtAttrs = this.dA[i].extAttrs.length;

					for(q=0; q<lenExtAttrs; q++) {
						if(this.dA[i].extAttrs[q].name == 'Constructor') {
							count++;
							(countOfArgs < this.dA[i].extAttrs[q].arguments.length) && (countOfArgs = this.dA[i].extAttrs[q].arguments.length);
						}
					}

					for(q=0; q<lenExtAttrs; q++) {
						//if(this.dA[i].extAttrs[q].name == 'Constructor') {
						switch(this.dA[i].extAttrs[q].name) {
							case 'Constructor':
//								if(count > 1) {//more than one constructor
//									var cP = '';
//									for(var n = 0, m = countOfArgs; n<m; n++) {
//										cP += 'args.param'+n;
//										cP += (q == lenExtAttrs-1 && n == m-1) ? '' : ', ';
//									}
//								} else {
//									for(var z = 0, x = this.dA[i].extAttrs[q].arguments.length; z < x; z++) {
//										cP += 'args.'+this.dA[i].extAttrs[q].arguments[z].name +'/*'+this.dA[i].extAttrs[q].arguments[z].type.idlType+'*/';
//										cP += (q == lenExtAttrs-1 && z == x-1) ? '' : ', ';
//									}
//								}
								if(q == lenExtAttrs-1) { // this check because interface can has many Constructors, but js need only one
									view+= '		create'+this.dA[i].name+': function(args){\n';
									view+= '			return new (require("'+options.titaniumFolder+this.folderName+'/'+this.dA[i].name+'"))(args);\n'
									view+= '		},\n';
									this.createBaseInterface(this.dA[i].name.replace(/\s/g,''), this.dA[i].inheritance, this.dA[i]);
								}
								break;
							case 'NoInterfaceObject':
//								if(this.dA[i].extAttrs[0].name !== 'Callback') {
//									this.createBaseInterface(this.dA[i].name.replace(/\s/g,''), this.dA[i].inheritance, this.dA[i]);
//								}
								//We have do nothing for this version
								//It mean we do not create modules for basic classes
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
			//inheritance.length == 0 && (view+=', "Ti/_/Evented"');
			//loop(function(i){view+=', "'+options.titaniumFolder+ folderName +inheritance[i] +'"';}, inheritance);
			view+= '], function(declare'
			//inheritance.length == 0 && (view+=', Evented');
			//loop(function(i){view+=', '+inheritance[i];}, inheritance);
			view+= '){\n'
			view+= '	return declare("Ti.Tizen.'+this.folderName+'.'+ name+'", null, ';
			//inheritance.length == 0 && (view+='Evented, ');
			//loop(function(i){view+= ''+inheritance[i] + ', ';}, inheritance);
			view+= '{\n';
			view+=viewForInterface(interfaceO, true, false, this.primitives);
			view+= '	});\n';
			view+= '});';
			//create file
			fs.writeFileSync(options.jsStubsFolder + folderName + name + '.js', view);
			this.pathes.add(options.pytonPath + folderName + name);
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





