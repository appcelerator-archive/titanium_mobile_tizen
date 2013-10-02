// Wraps Tizen interface "BluetoothHealthProfileHandler" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Tizen/_/Bluetooth/BluetoothProfileHandler', 'Tizen/_/Bluetooth/BluetoothHealthApplication', 'Tizen/_/Bluetooth/BluetoothHealthChannel'], function(declare, BluetoothProfileHandler, BluetoothHealthApplication, BluetoothHealthChannel) {

	function onError(e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

	var healthProfileHandler = declare(BluetoothProfileHandler, {
			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			registerSinkApplication: function(dataType, /*DOMString*/ name, callback) {
				this._obj.registerSinkApplication(dataType, name, callback && function(app) {
					callback({
						code: 0,
						success: true,
						app: new BluetoothHealthApplication(app)
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			connectToSource: function(peer, healthApplication, callback) {
				this._obj.connectToSource(peer, healthApplication, callback && function(channel) {
					callback({
						code: 0,
						success: true,
						channel: new BluetoothHealthChannel(channel)
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			}
		});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	healthProfileHandler.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothHealthProfileHandler';

	return healthProfileHandler;
});
