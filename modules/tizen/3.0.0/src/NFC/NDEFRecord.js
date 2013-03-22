define(['Ti/_/declare', 'Ti/_/Evented', 'Ti/Blob'], function(declare, Evented, Blob) {
    
    function byteArrayToString(byteArray) {
		var i = byteArray.length,
            binaryString = new Array(i);
        while (i--) {    
		    binaryString[i] = String.fromCharCode(byteArray[i]);
        }
        return binaryString.join('');
	};
    
	var record = declare(Evented, {
		constructor: function(args) {
			if(args.toString() === '[object NDEFRecord]') {
				this._obj = args;
			} else {
				if ('raw_data' in args) {
					this._obj = new tizen.NDEFRecord(args.raw_data);
				} else if ('tnf' in args && 'type' in args && 'payload' in args && 'id' in args) {
					this._obj = new tizen.NDEFRecord(args.tnf, args.type, args.payload, args.id);
				} else {
					Ti.API.error('Constructor NDEFRecord with given parameters doesn\'t exists');
				}
			}
		},

		constants: {
			tnf: {
				get: function() {
					return this._obj.tnf;
				}
			},
            // transform array of bytes to string
			type: {
				get: function() {
					return byteArrayToString(this._obj.type);
				}
			},
            // transform array of bytes to string
			id: {
				get: function() {
					return byteArrayToString(this._obj.id);
				}
			},
            
            // transform array of bytes to Blob
			payload: {
				get: function() {
                    var blobData = byteArrayToString(this._obj.payload);
                    return new Blob({
                        data: blobData,
                        length: blobData.length,
                        mimeType: this._obj.mimeType || 'text/plain'
                    });
				}
			}
		}

	});
    
    record.prototype.declaredClass = 'Tizen.NFC.NDEFRecord';
    
    return record;
});