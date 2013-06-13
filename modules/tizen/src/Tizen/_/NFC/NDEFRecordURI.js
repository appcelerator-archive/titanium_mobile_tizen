// Wraps Tizen interface "NDEFRecordURI" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Tizen/_/NFC/NDEFRecord'], function(declare, NDEFRecord) {

	var record = declare(NDEFRecord, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				if('uri' in args) {
					this._obj = new tizen.NDEFRecordURI(args.uri);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
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
