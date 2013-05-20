define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var obj = declare(Evented, {

		constructor: function(args, nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
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
			totalSize: {
				get: function() {
					return this._obj.totalSize;
				}
			},
			dataSize: {
				get: function() {
					return this._obj.dataSize;
				}
			},
			lastModified: {
				get: function() {
					return this._obj.lastModified;
				}
			},
			author: {
				get: function() {
					return this._obj.author;
				}
			},
			description: {
				get: function() {
					return this._obj.description;
				}
			},
			appIds: {
				get: function() {
					return this._obj.appIds;
				}
			},
		},

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.Package.PackageInformation';
	return obj;
});