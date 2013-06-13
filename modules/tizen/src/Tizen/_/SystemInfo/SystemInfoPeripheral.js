// Wraps Tizen interface "SystemInfoPeripheral" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var SystemInfoPeripheral = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			isVideoOutputOn: {
				get: function() {
					return this._obj.isVideoOutputOn;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	SystemInfoPeripheral.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoPeripheral';
	return SystemInfoPeripheral;
});
