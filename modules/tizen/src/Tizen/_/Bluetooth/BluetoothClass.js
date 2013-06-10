// Wraps Tizen interface "BluetoothClass" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var btClass = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		hasService: function(service /*octet*/) {
			return this._obj.hasService(service._obj);
		},

		constants: {
			major: {
				get: function() {
					return this._obj.major;
				}
			},
			minor: {
				get: function() {
					return this._obj.minor;
				}
			},
			services: {
				get: function() {
					return this._obj.services;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	btClass.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothClass';
	return btClass;
});
