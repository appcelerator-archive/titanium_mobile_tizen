define(['Ti/_/declare', 'Ti/Tizen/NFC/NDEFRecord'], function(declare, NDEFRecord) {
	return declare('Ti.Tizen.NFC.NDEFRecordMedia', NDEFRecord, {
		constructor: function(args) {
			if(args.toString() === '[object NDEFRecordMedia]') {
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
			},
		},

	});
});