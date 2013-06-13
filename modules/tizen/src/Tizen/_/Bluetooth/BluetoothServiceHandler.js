// Wraps Tizen interface "BluetoothServiceHandler" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bluetooth/BluetoothSocket'], function(declare, Evented, BluetoothSocket) {

	function onError (e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

	var listening,
		handler = declare(Evented, {

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			addEventListener: function () {
				var self = this;
				Evented.addEventListener.apply(this, arguments);

				if (! listening) {
					listening = true;
						this._obj.onconnect = function(socket) {
						self.fireEvent('remotedeviceconnected', {
							socket: new BluetoothSocket(socket)
						});
					};
				}
			},

			unregister: function(callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [];
				(typeof callback !== 'undefined') && args.push(function() {
						callback({
							code: 0,
							success: true
						});
					},
					function(e) {
						onError(e, callback);
					}
				);
				this._obj.unregister.call(this._obj, args);
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
