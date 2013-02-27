define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Bluetooth.BluetoothServiceHandler', null, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothServiceHandler]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			uuid: {
				get: function() {
					return this._obj.uuid;
				}
			},
			name: {
				get: function() {
					return this._obj.name;
				}
			},
			isConnected: {
				get: function() {
					return this._obj.isConnected;
				}
			},
		},

		properties: {
			onconnect: {
				get: function() {
					return this._obj.onconnect;
				},
				set: function(value) {
					this._obj.onconnect = value;
				}
			},
		},

		unregister: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.unregister(successCallback, errorCallback);
		}
	});
});