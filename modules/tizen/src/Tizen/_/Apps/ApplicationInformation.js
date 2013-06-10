// Wraps Tizen interface "ApplicationInformation" that resides in Tizen module "Application".
// Module "Application" is renamed as "Apps" in this wrapper.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var applicationInformation = declare(Evented, {

		constructor: function(nativeObj) {
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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	applicationInformation.prototype.declaredClass = 'Tizen.Apps.ApplicationInformation';
	return applicationInformation;
});
