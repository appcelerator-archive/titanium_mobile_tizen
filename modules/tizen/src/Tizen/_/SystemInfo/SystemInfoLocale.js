// Wraps Tizen interface "SystemInfoLocale" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var SystemInfoLocale = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			language: {
				get: function() {
					return this._obj.language;
				}
			},
			country: {
				get: function() {
					return this._obj.country;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	SystemInfoLocale.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoLocale';
	return SystemInfoLocale;
});
