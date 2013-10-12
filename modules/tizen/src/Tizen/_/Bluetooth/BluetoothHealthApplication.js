// Wraps Tizen interface "BluetoothHealthApplication" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	function onError (e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

	var listening,
		healthApplication = declare(Evented, {

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			addEventListener: function() {
				var self = this;

				Evented.addEventListener.apply(this, arguments);

				if (!listening) {
					listening = true;

					this._obj.onconnect = function(channel) {
						self.fireEvent('onconnect');
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
				dataType: {
					get: function() {
						return this._obj.dataType;
					}
				},
				name: {
					get: function() {
						return this._obj.name;
					}
				}
			},
		});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	healthApplication.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothHealthApplication';

	return healthApplication;
});
