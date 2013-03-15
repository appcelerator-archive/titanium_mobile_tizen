define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Tizen.Bluetooth.BluetoothClass', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothClass]') {
				this._obj = args;
			}
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
			},
		},

		hasService: function(service /*octet*/) {
			return this._obj.hasService(service._obj);
		}
	});
});