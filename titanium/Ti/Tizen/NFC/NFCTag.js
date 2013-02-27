define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.NFC.NFCTag', null, {
		constructor: function(args) {
			if(args.toString() === '[object NFCTag]') {
				this._obj = args;
			} else {
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
			},
		},

		readNDEF: function(readCallback /*NDEFMessageReadCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.readNDEF(readCallback, errorCallback);
		},

		writeNDEF: function(ndefMessage /*NDEFMessage*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.writeNDEF(ndefMessage._obj, successCallback, errorCallback);
		},

		transceive: function(data /*byte*/, dataCallback /*ByteArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.transceive(data._obj, dataCallback, errorCallback);
		},

		formatNDEF: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, key /*byte*/) {
			return this._obj.formatNDEF(successCallback, errorCallback, key ? key._obj : key);
		}
	});
});