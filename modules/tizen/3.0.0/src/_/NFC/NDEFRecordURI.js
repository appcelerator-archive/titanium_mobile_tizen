define(['Ti/_/declare', '_/NFC/NDEFRecord'], function(declare, NDEFRecord) {

	var record = declare(NDEFRecord, {

		constructor: function(args) {
			if (args.toString() === '[object NDEFRecordURI]') {
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

	record.prototype.declaredClass = 'Tizen.NFC.NDEFRecordURI';
	return record;
});