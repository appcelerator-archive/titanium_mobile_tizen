define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Tizen.Apps.ApplicationInformation', Evented, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			name: {
				get: function() {
					return this._obj.name;
				}
			},
			iconPath: {
				get: function() {
					return this._obj.iconPath;
				}
			},
			version: {
				get: function() {
					return this._obj.version;
				}
			},
			show: {
				get: function() {
					return this._obj.show;
				}
			},
			categories: {
				get: function() {
					return this._obj.categories;
				}
			},
			installDate: {
				get: function() {
					return this._obj.installDate;
				}
			},
			size: {
				get: function() {
					return this._obj.size;
				}
			}
		}
	});
});