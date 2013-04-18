// Wraps Tizen interface "NFCPeer" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/NFC/NDEFMessage'], function(declare, Evented, NDEFMessage) {

	var peer = declare(Evented, {

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

		setReceiveNDEFListener: function(callback) {
			return this._obj.setReceiveNDEFListener(callback && function(ndefMessage) {
				callback({
					success: true,
					code: 0,
					ndefMessage: new NDEFMessage(ndefMessage)
				});
			});
		},

		unsetReceiveNDEFListener: function() {
			return this._obj.unsetReceiveNDEFListener();
		},

		sendNDEF: function(ndefMessage, callback) {
			return this._obj.sendNDEF(ndefMessage._obj, callback && function() {
				callback({
					success: true,
					code: 0
				});
			}, errorCallback && function(e) {
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
