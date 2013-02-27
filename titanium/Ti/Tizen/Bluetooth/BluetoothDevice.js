define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Bluetooth.BluetoothDevice', null, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothDevice]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			name: {
				get: function() {
					return this._obj.name;
				}
			},
			address: {
				get: function() {
					return this._obj.address;
				}
			},
			deviceClass: {
				get: function() {
					return this._obj.deviceClass;
				}
			},
			isBonded: {
				get: function() {
					return this._obj.isBonded;
				}
			},
			isTrusted: {
				get: function() {
					return this._obj.isTrusted;
				}
			},
			isConnected: {
				get: function() {
					return this._obj.isConnected;
				}
			},
			uuids: {
				get: function() {
					return this._obj.uuids;
				}
			},
		},

		connectToServiceByUUID: function(uuid /*BluetoothUUID*/, successCallback /*BluetoothSocketSuccessCallback*/, errorCallback /*ErrorCallback*/, protocol /*BluetoothSocketType*/) {
			return this._obj.connectToServiceByUUID(uuid, successCallback, errorCallback, protocol);
		}
	});
});