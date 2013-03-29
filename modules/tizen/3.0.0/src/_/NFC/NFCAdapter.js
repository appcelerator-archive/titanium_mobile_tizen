define(['Ti/_/declare', 'Ti/_/Evented', '_/NFC/NFCTag', '_/NFC/NFCPeer', '_/WebAPIError'], function(declare, Evented, NFCTag, NFCPeer, WebAPIError) {
	var adapter = declare(Evented, {
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
			}
		},

		setPowered: function(state, successCallback, errorCallback) {
			return this._obj.setPowered(state,
                successCallback && function() { 
                    successCallback();
                },
                errorCallback && function(e) { 
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		setTagListener: function(detectCallback, tagFilter) {
            
            return this._obj.setTagListener({
                onattach: function(nfcTag) {
                    detectCallback.onattach(new NFCTag(nfcTag));
                },
                ondetach: function() {
                    detectCallback.ondetach();
                }
            }, tagFilter);
		},

		setPeerListener: function(detectCallback) {
			return this._obj.setPeerListener({
                onattach: function(nfcPeer) {
                    detectCallback.onattach(new NFCPeer(nfcPeer));
                },
                ondetach: function() {
                    detectCallback.ondetach();
                }
            });
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
    
    adapter.prototype.declaredClass = 'Tizen.NFC.NFCAdapter';
    
    return adapter;
});