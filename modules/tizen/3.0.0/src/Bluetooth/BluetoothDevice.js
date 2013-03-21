define(['Ti/_/declare', 'Ti/_/Evented', 'Ti/Tizen/Bluetooth/BluetoothSocket', 'Ti/Tizen/WebAPIError'], function(declare, Evented, BluetoothSocket, WebApiError) {
	return declare('Tizen.Bluetooth.BluetoothDevice', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothDevice]') {
				this._obj = args;
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
			}
		},

		connectToServiceByUUID: function(uuid /*BluetoothUUID*/, successCallback /*BluetoothSocketSuccessCallback*/, errorCallback /*ErrorCallback*/) {
            return this._obj.connectToServiceByUUID(uuid, 
                function(socket) {
                    successCallback(new BluetoothSocket(socket));
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		}
	});
});