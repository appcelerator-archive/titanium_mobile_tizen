define(['Ti/_/declare', 'Ti/_/Evented', 'NFC/NDEFMessage', 'WebAPIError'], function(declare, Evented, NDEFMessage, WebAPIError) {
	var tag = declare(Evented, {
		constructor: function(args) {
			if(args.toString() === '[object NFCTag]') {
				this._obj = args;
			}
		},

		constants: {
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			isSupportedNDEF: {
				get: function() {
					return this._obj.isSupportedNDEF;
				}
			},
			ndefSize: {
				get: function() {
					return this._obj.ndefSize;
				}
			},
			properties: {
				get: function() {
					return this._obj.properties;
				}
			},
			isConnected: {
				get: function() {
					return this._obj.isConnected;
				}
			}
		},

		readNDEF: function(readCallback, errorCallback) {
			return this._obj.readNDEF(
                function(ndefMessage) {
					readCallback( new NDEFMessage(ndefMessage) );
                },
                errorCallback && function(e) { 
                    errorCallback(new WebAPIError(e));
                }
            );
        },

		writeNDEF: function(ndefMessage, successCallback, errorCallback) {
			return this._obj.writeNDEF(ndefMessage._obj,
                successCallback && function() { 
                    successCallback();
                },
                errorCallback && function(e) { 
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		transceive: function(data, byteArrayCallback, errorCallback) {
            return this._obj.transceive(data._obj, 
                function(arr) {
                    byteArrayCallback(arr);
                },
                errorCallback && function(e) { 
                    errorCallback(new WebAPIError(e));
                }
            )
		}
	});
    
    tag.prototype.declaredClass = 'Tizen.NFC.NFCTag';
    
    return tag;
});