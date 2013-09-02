// Wraps Tizen interface "BluetoothProfileHandler" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var profileHandler = declare(Evented, {

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			constants: {
				profileType: {
					get: function() {
						return this._obj.profileType;
					}
				}
			}
		});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	profileHandler.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothProfileHandler';

	return profileHandler;
});
