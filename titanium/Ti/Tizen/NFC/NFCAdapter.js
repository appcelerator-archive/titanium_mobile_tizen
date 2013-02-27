define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.NFC.NFCAdapter', null, {
		constructor: function(args) {
			if(args.toString() === '[object NFCAdapter]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			powered: {
				get: function() {
					return this._obj.powered;
				}
			},
			polling: {
				get: function() {
					return this._obj.polling;
				}
			},
		},

		setPowered: function(state /*boolean*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setPowered(state, successCallback, errorCallback);
		},

		setPolling: function(state /*boolean*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setPolling(state, successCallback, errorCallback);
		},

		setTagListener: function(detectCallback /*NFCTagDetectCallback*/, errorCallback /*ErrorCallback*/, tagFilter /*NFCTagType*/) {
			return this._obj.setTagListener(detectCallback, errorCallback, tagFilter);
		},

		setPeerListener: function(detectCallback /*NFCPeerDetectCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setPeerListener(detectCallback, errorCallback);
		},

		unsetTagListener: function() {
			return this._obj.unsetTagListener();
		},

		unsetPeerListener: function() {
			return this._obj.unsetPeerListener();
		},

		getCachedMessage: function() {
			return this._obj.getCachedMessage();
		}
	});
});