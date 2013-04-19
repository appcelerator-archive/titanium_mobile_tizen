// Wraps Tizen interface "NFCPeer" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/NFC/NDEFMessage'], function(declare, Evented, NDEFMessage) {

	var listening,
		peer = declare(Evented, {

			constructor: function(args) {
				if (args.toString() === '[object NFCPeer]') {
					// args is a native Tizen object; simply wrap it (take ownership of it)
					this._obj = args;
				}
			},

			constants: {
				isConnected: {
					get: function() {
						return this._obj.isConnected;
					}
				}
			},

			addEventListener: function () {
				var self = this;

				Evented.addEventListener.apply(this, arguments);

				if (! listening) {
					listening = true;
					this._obj.setReceiveNDEFListener(function (ndefMessage) {
						self.fireEvent('ndefmessagereceived', {
							message: new NDEFMessage(ndefMessage)
						});
					});
				}
			},

			sendNDEF: function(ndefMessage, callback) {
				return this._obj.sendNDEF(ndefMessage._obj, callback && function() {
					callback({
						success: true,
						code: 0
					});
				}, function(e) {
					callback({
						success: false,
						error: e.type + ': ' + e.message,
						code: e.code
					});
				});
			}

		});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	peer.prototype.declaredClass = 'Tizen.NFC.NFCPeer';
	return peer;
});
