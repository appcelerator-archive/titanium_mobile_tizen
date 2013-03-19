define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.Filesystem.FileSystemStorage', null, {
		constructor: function(args) {
			this._obj = args;
		},
		constants: {
			label: {
				get: function() {
					return this._obj.label;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			state: {
				get: function() {
					return this._obj.state;
				}
			}
		}

	});
});