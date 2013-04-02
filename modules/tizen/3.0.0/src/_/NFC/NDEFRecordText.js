define(['Ti/_/declare', '_/NFC/NDEFRecord'], function(declare, NDEFRecord) {

	var record = declare(NDEFRecord, {

		constructor: function(args) {
			if (args.toString() === '[object NDEFRecordText]') {
				this._obj = args;
			} else {
				this._obj = new tizen.NDEFRecordText(args.text, args.languageCode, args.encoding);
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

	record.prototype.declaredClass = 'Tizen.NFC.NDEFRecordText';
	return record;
});