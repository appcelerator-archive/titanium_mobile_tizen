// Wraps Tizen interface "NDEFMessage" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/NFC/NDEFRecord', 'Tizen/_/NFC/NDEFRecordURI', 'Tizen/_/NFC/NDEFRecordText', 'Tizen/_/NFC/NDEFRecordMedia'],
	function(declare, Evented, NDEFRecord, NDEFRecordURI, NDEFRecordText, NDEFRecordMedia) {

		var msg = declare(Evented, {
			constructor: function(args, nativeObj) {
				if (nativeObj) {
					// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
					this._obj = nativeObj;
				} else {
					// args is a dictionary that the user of the wrapper module passed to the creator function.
					// There are several Tizen constructors for this object.
					// Deduce the correct parameters to the corresponding Tizen constructor, based on the types of
					// the members of args, and invoke the constructor.
					//
					// Note that Tizen calls distinguish between passing an undefined parameter and not passing 
					// any parameter at all, so the count of the parameters must also be correct.

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
									wrappedRecords[i] = new NDEFRecordURI(void 0, r);
									break;
								case '[object NDEFRecordText]':
									wrappedRecords[i] = new NDEFRecordText(void 0, r);
									break;
								case '[object NDEFRecordMedia]':
									wrappedRecords[i] = new NDEFRecordMedia(void 0, r);
									break;
								default:
									wrappedRecords[i] = new NDEFRecord(void 0, r);
							}
						}

						return wrappedRecords;
					},
					set: function(value) {
						var i = 0,
							len = value.length;

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

		// Initialize declaredClass, so that toString() works properly on such objects.
		// Correct operation of toString() is required for proper wrapping and automated testing.
		msg.prototype.declaredClass = 'Tizen.NFC.NDEFMessage';
		return msg;
	});
