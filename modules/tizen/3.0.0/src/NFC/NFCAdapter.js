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
		},

		setPowered: function(state /*boolean*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setPowered(state, successCallback, errorCallback);
		},

		setTagListener: function(detectCallback /*NFCTagDetectCallback*/, tagFilter /*NFCTagType*/) {
			return this._obj.setTagListener(detectCallback, tagFilter);
		},

		setPeerListener: function(detectCallback /*NFCPeerDetectCallback*/) {
			return this._obj.setPeerListener(detectCallback);
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