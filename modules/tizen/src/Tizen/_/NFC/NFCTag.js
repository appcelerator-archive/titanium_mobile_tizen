// Wraps Tizen interface "NFCTag" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/NFC/NDEFMessage'], function(declare, Evented, NDEFMessage) {

	function onError (e, callback) {
		callback({
			success: false,
			error: e.type + ': ' + e.message,
			code: e.code
		});
	}

	var tag = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object NFCTag]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			}
		},

		readNDEF: function(callback) {
			this._obj.readNDEF(callback && function(ndefMessage) {
				callback({
					success: true,
					code: 0,
					ndefMessage: new NDEFMessage(ndefMessage)
				});
			}, callback && function(e) {
				onError(e, callback);
			});
		},

		writeNDEF: function(ndefMessage, callback) {
			this._obj.writeNDEF(ndefMessage._obj, callback && function() {
				callback({
					success: true,
					code: 0
				});
			}, callback && function(e) {
				onError(e, callback);
			});
		},

		transceive: function(data, callback) {
			this._obj.transceive(data._obj, callback && function(arr) {
				callback({
					success: true,
					code: 0,
					data: arr
				});
			}, callback && function(e) {
				onError(e, callback);
			});
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
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	tag.prototype.declaredClass = 'Tizen.NFC.NFCTag';
	return tag;
});
