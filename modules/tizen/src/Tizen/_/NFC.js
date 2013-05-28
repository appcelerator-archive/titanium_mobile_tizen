// Wraps Tizen module "NFC".

define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/NFC/NDEFMessage', 'Tizen/_/NFC/NDEFRecord', 'Tizen/_/NFC/NDEFRecordText',
	'Tizen/_/NFC/NDEFRecordURI', 'Tizen/_/NFC/NDEFRecordMedia', 'Tizen/_/NFC/NFCAdapter'],
	function(lang, Evented, NDEFMessage, NDEFRecord, NDEFRecordText, NDEFRecordURI, NDEFRecordMedia, NFCAdapter) {

		return lang.mixProps(require.mix({}, Evented), {

			getDefaultAdapter: function() {
				try {
					return this._wrap(tizen.nfc.getDefaultAdapter());
				} catch (e) {
					console.error(e.message);
				}
			},

			_wrap: function(object) {
				// Wrap the object (create a Titanium wrapped object out of a native Tizen object).
				if (object.toString() === '[object NFCAdapter]') {
					return new NFCAdapter(object);
				} else {
					throw new Error('Incorrect object type');
				}
			},

			createNDEFMessage: function(args) {
				return new NDEFMessage(args);
			},

			createNDEFRecord: function(args) {
				return new NDEFRecord(args);
			},

			createNDEFRecordText: function(args) {
				return new NDEFRecordText(args);
			},

			createNDEFRecordURI: function(args) {
				return new NDEFRecordURI(args);
			},

			createNDEFRecordMedia: function(args) {
				return new NDEFRecordMedia(args);
			},

			constants: {
				NFC_RECORD_TNF_EMPTY: 0,
				NFC_RECORD_TNF_WELL_KNOWN: 1,
				NFC_RECORD_TNF_MIME_MEDIA: 2,
				NFC_RECORD_TNF_URI: 3,
				NFC_RECORD_TNF_EXTERNAL_RTD: 4,
				NFC_RECORD_TNF_UNKNOWN: 5,
				NFC_RECORD_TNF_UNCHANGED: 6,
				NDEF_RECORD_TEXT_ENCODING_UTF8: 'UTF8',
				NDEF_RECORD_TEXT_ENCODING_UTF16: 'UTF16',
				NFC_TAG_TYPE_GENERIC_TARGET: 'GENERIC_TARGET',
				NFC_TAG_TYPE_ISO14443_A: 'ISO14443_A',
				NFC_TAG_TYPE_ISO14443_4A: 'ISO14443_4A',
				NFC_TAG_TYPE_ISO14443_3A: 'ISO14443_3A',
				NFC_TAG_TYPE_MIFARE_MINI: 'MIFARE_MINI',
				NFC_TAG_TYPE_MIFARE_1K: 'MIFARE_1K',
				NFC_TAG_TYPE_MIFARE_4K: 'MIFARE_4K',
				NFC_TAG_TYPE_MIFARE_ULTRA: 'MIFARE_ULTRA',
				NFC_TAG_TYPE_MIFARE_DESFIRE: 'MIFARE_DESFIRE',
				NFC_TAG_TYPE_ISO14443_B: 'ISO14443_B',
				NFC_TAG_TYPE_ISO14443_4B: 'ISO14443_4B',
				NFC_TAG_TYPE_ISO14443_BPRIME: 'ISO14443_BPRIME',
				NFC_TAG_TYPE_FELICA: 'FELICA',
				NFC_TAG_TYPE_JEWEL: 'JEWEL',
				NFC_TAG_TYPE_ISO15693: 'ISO15693',
				NFC_TAG_TYPE_UNKNOWN_TARGET: 'UNKNOWN_TARGET'
			}

		}, true);
	});
