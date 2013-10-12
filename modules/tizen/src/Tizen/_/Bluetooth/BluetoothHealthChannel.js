// Wraps Tizen interface "BluetoothHealthChannel" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bluetooth/BluetoothDevice', 'Tizen/_/Bluetooth/BluetoothHealthApplication'], function(declare, Evented, BluetoothDevice, BluetoothHealthApplication) {

	var listening,
		healthChannel = declare(Evented, {
			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			close: function() {
				this._obj.close();
			},

			sendData: function(data) {
				return this._obj.sendData(data);
			},

			addEventListener: function() {
				var self = this;

				Evented.addEventListener.apply(this, arguments);

				if (!listening) {
					listening = true;

					this._obj.setListener({
						onmessage: function(data) {
							self.fireEvent('ondatareceived', {
								data: data
							});
						},
						onclose: function() {
							self.fireEvent('onchannelclosed');

							listening = false;
						}
					});
				}
			},

			constants: {
				peer: {
					get: function() {
						return new BluetoothDevice(this._obj.peer);
					}
				},
				channelType: {
					get: function() {
						return this._obj.channelType;
					}
				},
				application: {
					get: function() {
						return new BluetoothHealthApplication(this._obj.application);
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
	healthChannel.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothHealthChannel';

	return healthChannel;
});
