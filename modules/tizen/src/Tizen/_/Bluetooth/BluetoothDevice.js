// Wraps Tizen interface "BluetoothDevice" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bluetooth/BluetoothSocket', 'Tizen/_/Bluetooth/BluetoothClass'],
	function(declare, Evented, BluetoothSocket, BluetoothClass) {

		function onError (e, callback) {
			callback({
				code: e.code,
				success: false,
				error: e.type + ': ' + e.message
			});
		}

		var device = declare(Evented, {

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			connectToServiceByUUID: function(uuid /*BluetoothUUID*/, callback) {
				this._obj.connectToServiceByUUID(uuid, callback && function(socket) {
					callback({
						code: 0,
						success: true,
						socket: new BluetoothSocket(socket)
					});
				}, callback && function(e) {
					onError(e, callback);
				});
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
						return new BluetoothClass(this._obj.deviceClass);
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
			}

		});

		// Initialize declaredClass, so that toString() works properly on such objects.
		// Correct operation of toString() is required for proper wrapping and automated testing.
		device.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothDevice';
		return device;
	});
