// Wraps Tizen interface "NFCPeer" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/NFC/NDEFMessage'], function(declare, Evented, NDEFMessage) {

	var listening,
		peer = declare(Evented, {

			constructor: function(nativeObj) {
					// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
					this._obj = nativeObj;
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
							message: new NDEFMessage(void 0, ndefMessage)
						});
					});
				}
			},

			sendNDEF: function(ndefMessage, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [ ndefMessage._obj ];
				(typeof callback !== 'undefined') && args.push(function() {
						callback({
							success: true,
							code: 0
						});
					}, 
					function(e) {
						callback({
							success: false,
							error: e.type + ': ' + e.message,
							code: e.code
						});
					}
				);
				this._obj.sendNDEF.call(this._obj);
			}

		});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	peer.prototype.declaredClass = 'Tizen.NFC.NFCPeer';
	return peer;
});
