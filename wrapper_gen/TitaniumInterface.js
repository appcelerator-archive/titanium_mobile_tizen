exports.TitaniumInterface = (function(){
	var fs = require('fs');
	var options = {
		jsStubsFolder: 'output/jsStubs/',
		titaniumFolder: 'Ti/Tizen/',
		pytonPath: 'Ti/'

	};

	var result = {
		creatorsMethods: '',
		folderName: '',
		dA : null,
		genStub: function(jsonObject, last){
			this.dA = jsonObject[0].definitions;
			var view = '';
			view += 'define(["Ti/_/lang"], function(lang) {\n';
			view += '   return lang.setObject("Ti.Tizen.'+jsonObject[0].name+'", tizen.'+jsonObject[0].name.toLowerCase()+');\n';
			view +=this.implementation(jsonObject[0].definitions);
			view +='});';
			fs.writeFileSync(options.jsStubsFolder + jsonObject[0].name.replace(/\s/g,'') + '.js', view);
			last && this.createTizenFile();
		},
		createTizenFile: function(){
			var view = '';
			view += 'define(["Ti/_/lang"], function(lang) {\n';
			view += '   return lang.setObject("Ti.Tizen", {\n';
			view += '	   '+this.creatorsMethods;
			view +='	});\n';
			view +='});';
			fs.writeFileSync(options.jsStubsFolder + 'Tizen.js', view);
			this.pathes.add(options.pytonPath + 'Tizen');
		},
		implementation: function(){
			var name = '';
			var index = null;

			//main loop for saparate differents parts
			for(var i=0, len = this.dA.length; i<len; i++) {
				if(this.dA[i] && this.dA[i].type == 'implements') {
					name = this.dA[i]['implements'];
					this.dA.splice(i, 1);
				}
			}
			var modName = this.findImpObject(name);
			var imp = '';
			this.creatorsMethods += this.getCreators();
			return imp;
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
						if(this.dA[i].extAttrs[q].name == 'Constructor') {

							if(count > 1) {//more than one constructor
								var cP = '';
								for(var n = 0, m = countOfArgs; n<m; n++) {
									cP += 'args.param'+n;
									cP += (q == lenExtAttrs-1 && n == m-1) ? '' : ', ';
								}
							} else {
								for(var z = 0, x = this.dA[i].extAttrs[q].arguments.length; z < x; z++) {
									cP += 'args.'+this.dA[i].extAttrs[q].arguments[z].name +'/*'+this.dA[i].extAttrs[q].arguments[z].type.idlType+'*/';
									cP += (q == lenExtAttrs-1 && z == x-1) ? '' : ', ';
								}
							}
							if(q == lenExtAttrs-1) { // this check because interface can has many Constructors, but js need only one
								view+= '		create'+this.dA[i].name+': function(args){\n';

								view+= '			return new tizen.'+this.dA[i].name+'('+ cP +');\n'
								view+= '	   },\n';
							}
						}
					}
				}
			}
			return view;
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





