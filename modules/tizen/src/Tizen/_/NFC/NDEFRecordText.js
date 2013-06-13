// Wraps Tizen interface "NDEFRecordText" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Tizen/_/NFC/NDEFRecord'], function(declare, NDEFRecord) {

	var record = declare(NDEFRecord, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				if('text' in args && 'languageCode' in args) {
					this._obj = ('encoding' in args) ? 
						new tizen.NDEFRecordText(args.text, args.languageCode, args.encoding):
						new tizen.NDEFRecordText(args.text, args.languageCode);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
			}
		},

		constants: {
			text: {
				get: function() {
					return this._obj.text;
				}
			},
			languageCode: {
				get: function() {
					return this._obj.languageCode;
				}
			},
			encoding: {
				get: function() {
					return this._obj.encoding;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	record.prototype.declaredClass = 'Tizen.NFC.NDEFRecordText';
	return record;
});
