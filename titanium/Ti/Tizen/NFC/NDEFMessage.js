define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.NFC.NDEFMessage', null, {
		constructor: function(args) {
			if(args.toString() === '[object NDEFMessage]') {
				this._obj = args;
			} else {
				if ('rawData' in args) {
					this._obj = new tizen.NDEFMessage(args.rawData);
				} else if ('ndefRecords' in args) {
					this._obj = new tizen.NDEFMessage(args.ndefRecords);
				} else if () {
					this._obj = new tizen.NDEFMessage();
				} else {
					Ti.API.error('Constructor NDEFMessage with given parameters doesn\'t exists');
				}
			}
		},

		constants: {
			recordCount: {
				get: function() {
					return this._obj.recordCount;
				}
			},
		},

		properties: {
			records: {
				get: function() {
					return this._obj.records;
				},
				set: function(value) {
					this._obj.records = value;
				}
			},
		},

		toByte: function() {
			return this._obj.toByte();
		}
	});
});