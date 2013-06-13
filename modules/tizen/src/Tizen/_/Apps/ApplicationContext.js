// Wraps Tizen interface "ApplicationContext" that resides in Tizen module "Application".
// Module "Application" is renamed as Apps in this wrapper.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var applicationContext = declare(Evented, {

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
			appId: {
				get: function() {
					return this._obj.appId;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	applicationContext.prototype.declaredClass = 'Tizen.Apps.ApplicationContext';
	return applicationContext;
});
