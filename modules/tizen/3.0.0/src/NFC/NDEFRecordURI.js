define(['Ti/_/declare', 'Ti/Tizen/NFC/NDEFRecord'], function(declare, NDEFRecord) {
	return declare('Ti.Tizen.NFC.NDEFRecordURI', NDEFRecord, {
		constructor: function(args) {
			if(args.toString() === '[object NDEFRecordURI]') {
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
			},
		},

	});
});