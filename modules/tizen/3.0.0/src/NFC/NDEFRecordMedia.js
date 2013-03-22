define(['Ti/_/declare', 'NFC/NDEFRecord'], function(declare, NDEFRecord) {
	var record = declare(NDEFRecord, {
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
			}
		}

	});
    
    record.prototype.declaredClass = 'Tizen.NFC.NDEFRecordMedia';
    
    return record;
});