// Wraps Tizen interface "BluetoothServiceHandler" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bluetooth/BluetoothSocket'], function(declare, Evented, BluetoothSocket) {

	function onError (e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

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

		unregister: function(callback) {
			return this._obj.unregister(callback && function() {
					callback({
						code: 0,
						success: true
					});
				},
				callback && function(e) {
					onError(e, callback);
				}
			);
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
