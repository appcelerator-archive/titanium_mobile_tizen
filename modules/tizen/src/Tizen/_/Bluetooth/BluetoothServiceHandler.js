// Wraps Tizen interface "BluetoothServiceHandler" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bluetooth/BluetoothSocket', 'Tizen/_/WebAPIError'], function(declare, Evented, BluetoothSocket, WebAPIError) {

	var handler = declare(Evented, {

		constructor: function(args) {
			var self = this;
			if (args.toString() === '[object BluetoothServiceHandler]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				self._obj = args;
			}

			self._obj.onconnect = function(socket) {
				self.fireEvent('remotedeviceconnected', new BluetoothSocket(socket));
			};
		},

		unregister: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.unregister(successCallback, errorCallback && function(e) {
				errorCallback(new WebAPIError(e));
			});
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
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	handler.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothServiceHandler';
	return handler;
});
