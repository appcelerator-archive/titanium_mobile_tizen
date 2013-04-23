// Wraps Tizen interface "BluetoothSocket" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var listening,
		socket = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		addEventListener: function () {
			var self = this;
			Evented.addEventListener.apply(this, arguments);

			if (! listening) {
				listening = true;

				this._obj.onmessage = function() {
					self.fireEvent('socketmessagereceived');
				};

				this._obj.onclose = function() {
					self.fireEvent('socketclosed');
				};

				self._obj.onerror = function(e) {
					self.fireEvent('socketerror', {
						code: e.code,
						error: e.type + ': ' + e.message
					});
				};
			}
		},

		writeData: function(data) {
			return this._obj.writeData(data);
		},

		readData: function() {
			return this._obj.readData();
		},

		close: function() {
			this._obj.close();
		},

		constants: {
			uuid: {
				get: function() {
					return this._obj.uuid;
				}
			},
			protocol: {
				get: function() {
					return this._obj.protocol;
				}
			},
			state: {
				get: function() {
					return this._obj.state;
				}
			},
			peer: {
				get: function() {
					return this._obj.peer;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	socket.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothSocket';
	return socket;
});
