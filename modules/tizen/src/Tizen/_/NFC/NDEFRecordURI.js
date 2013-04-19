// Wraps Tizen interface "NDEFRecordURI" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Tizen/_/NFC/NDEFRecord'], function(declare, NDEFRecord) {

	var record = declare(NDEFRecord, {

		constructor: function(args) {
			if (args instanceof tizen.NDEFRecordURI) {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				this._obj = new tizen.NDEFRecordURI(args.uri);
			}
		},

		constants: {
			uri: {
				get: function() {
					return this._obj.uri;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	record.prototype.declaredClass = 'Tizen.NFC.NDEFRecordURI';
	return record;
});
