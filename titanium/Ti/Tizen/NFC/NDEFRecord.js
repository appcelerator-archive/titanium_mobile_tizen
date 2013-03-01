define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.NFC.NDEFRecord', null, {
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
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			payload: {
				get: function() {
					return this._obj.payload;
				}
			},
		},

	});
});