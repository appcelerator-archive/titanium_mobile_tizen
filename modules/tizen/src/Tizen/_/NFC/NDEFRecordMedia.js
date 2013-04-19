// Wraps Tizen interface "NDEFRecordMedia" that resides in Tizen module "Messaging".

define(['Ti/_/declare', 'Tizen/_/NFC/NDEFRecord'], function(declare, NDEFRecord) {

	var record = declare(NDEFRecord, {

		constructor: function(args) {
			if (args instanceof tizen.NDEFRecordMedia) {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				this._obj = new tizen.NDEFRecordMedia(args.mimeType, args.data);
			}
		},

		constants: {
			mimeType: {
				get: function() {
					return this._obj.mimeType;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	record.prototype.declaredClass = 'Tizen.NFC.NDEFRecordMedia';
	return record;
});
