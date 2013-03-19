define(['Ti/_/declare', 'Ti/Tizen/NFC/NDEFRecord'], function(declare, NDEFRecord) {
	return declare('Ti.Tizen.NFC.NDEFRecordText', NDEFRecord, {
		constructor: function(args) {
			if(args.toString() === '[object NDEFRecordText]') {
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
			},
		},

	});
});