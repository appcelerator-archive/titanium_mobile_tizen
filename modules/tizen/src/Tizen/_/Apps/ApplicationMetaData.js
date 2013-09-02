// Wraps Tizen interface "ApplicationMetaData" that resides in Tizen module "Application".
// Module "Application" is renamed as Apps in this wrapper.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var applicationMetaData = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			key: {
				get: function() {
					return this._obj.key;
				}
			},
			value: {
				get: function() {
					return this._obj.value;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	applicationMetaData.prototype.declaredClass = 'Tizen.Apps.ApplicationMetaData';

	return applicationMetaData;
});