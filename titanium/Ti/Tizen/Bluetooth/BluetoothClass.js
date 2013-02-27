define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Bluetooth.BluetoothClass', null, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothClass]') {
				this._obj = args;
			} else {
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