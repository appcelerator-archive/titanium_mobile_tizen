define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.NFC.NFCPeer', null, {
		constructor: function(args) {
			if(args.toString() === '[object NFCPeer]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			isConnected: {
				get: function() {
					return this._obj.isConnected;
				}
			},
		},

		setReceiveNDEFListener: function(successCallback /*NDEFMessageReadCallback*/) {
			return this._obj.setReceiveNDEFListener(successCallback);
		},

		unsetReceiveNDEFListener: function() {
			return this._obj.unsetReceiveNDEFListener();
		},

		sendNDEF: function(ndefMessage /*NDEFMessage*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.sendNDEF(ndefMessage._obj, successCallback, errorCallback);
		}
	});
});