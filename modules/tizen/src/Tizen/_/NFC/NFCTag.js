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

		constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
		},

		readNDEF: function(callback) {
			this._obj.readNDEF(callback && function(ndefMessage) {
				callback({
					success: true,
					code: 0,
					ndefMessage: new NDEFMessage(void 0, ndefMessage)
				});
			}, callback && function(e) {
				onError(e, callback);
			});
		},

		writeNDEF: function(ndefMessage, callback) {
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			var args = [ ndefMessage._obj ];
			(typeof callback !== 'undefined') && args.push(function() {
					callback({
						success: true,
						code: 0
					});
				},
				function(e) {
					onError(e, callback);
				}
			);
			this._obj.writeNDEF.apply(this._obj, args);
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
