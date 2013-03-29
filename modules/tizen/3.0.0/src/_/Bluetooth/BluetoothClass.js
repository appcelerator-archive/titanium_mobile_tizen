define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var btClass = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object BluetoothClass]') {
				this._obj = args;
			}
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

	btClass.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothClass';
	return btClass;
});