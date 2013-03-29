define(['Ti/_/declare', 'Ti/_/Evented', '_/NFC/NDEFMessage', '_/WebAPIError'], function(declare, Evented, NDEFMessage, WebAPIError) {

	var peer = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object NFCPeer]') {
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

	peer.prototype.declaredClass = 'Tizen.NFC.NFCPeer';
	return peer;
});