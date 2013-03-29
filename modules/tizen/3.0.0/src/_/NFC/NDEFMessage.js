define(['Ti/_/declare', 'Ti/_/Evented', '_/NFC/NDEFRecord', '_/NFC/NDEFRecordURI', '_/NFC/NDEFRecordText', '_/NFC/NDEFRecordMedia'],
	function(declare, Evented, NDEFRecord, NDEFRecordURI, NDEFRecordText, NDEFRecordMedia) {

		var msg = declare(Evented, {
			constructor: function(args) {
				if (args.toString() === '[object NDEFMessage]') {
					this._obj = args;
				} else {
					if ('rawData' in args) {
						this._obj = new tizen.NDEFMessage(args.rawData);
					} else if ('ndefRecords' in args) {
						this._obj = new tizen.NDEFMessage(args.ndefRecords);
					} else {
						this._obj = new tizen.NDEFMessage();
					}
				}
			},

			toByte: function() {
				return this._obj.toByte();
			},

			constants: {
				recordCount: {
					get: function() {
						return this._obj.recordCount;
					}
				}
			},

			properties: {
				records: {
					get: function() {
						var i = 0,
							len = this._obj.records.length,
							wrappedRecords = new Array(len),
							r;

						for (; i < len; i++) {
							r = this._obj.records[i];

							switch (r.toString()) {
								case '[object NDEFRecordURI]':
									wrappedRecords[i] = new NDEFRecordURI(r);
									break;
								case '[object NDEFRecordText]':
									wrappedRecords[i] = new NDEFRecordText(r);
									break;
								case '[object NDEFRecordMedia]':
									wrappedRecords[i] = new NDEFRecordMedia(r);
									break;
								default:
									wrappedRecords[i] = new NDEFRecord(r);
							}
						}

						return wrappedRecords;
					},
					set: function(value) {
						var i = 0,
							len = value.length,
							record;

						//set new length
						this._obj.records.length = len;

						//get and push original values to tizen`s records
						for (; i < len; i++) {
							this._obj.records[i] = value[i]._obj;
						}
					}
				}
			}

		});

		msg.prototype.declaredClass = 'Tizen.NFC.NDEFMessage';
		return msg;
	});