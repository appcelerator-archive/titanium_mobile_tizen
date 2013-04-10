// Wraps Tizen interface "NFCPeer" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/NFC/NDEFMessage', 'Tizen/_/WebAPIError'], function(declare, Evented, NDEFMessage, WebAPIError) {

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

		setReceiveNDEFListener: function(readCallback) {
			return this._obj.setReceiveNDEFListener(function(ndefMessage) {
				readCallback(new NDEFMessage(ndefMessage));
			});
		},

		unsetReceiveNDEFListener: function() {
			return this._obj.unsetReceiveNDEFListener();
		},

		sendNDEF: function(ndefMessage, successCallback, errorCallback) {
			return this._obj.sendNDEF(ndefMessage._obj, successCallback && function() {
				successCallback();
			}, errorCallback && function(e) {
				errorCallback(new WebAPIError(e));
			});
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	peer.prototype.declaredClass = 'Tizen.NFC.NFCPeer';
	return peer;
});
