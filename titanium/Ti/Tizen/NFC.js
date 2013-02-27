define(['Ti/_/lang'], function(lang) {
	return lang.setObject('Ti.Tizen.NFC', {

		constants: {
			NFC_RECORD_TNF_EMPTY: 0, //short
			NFC_RECORD_TNF_WELL_KNOWN: 1, //short
			NFC_RECORD_TNF_MIME_MEDIA: 2, //short
			NFC_RECORD_TNF_URI: 3, //short
			NFC_RECORD_TNF_EXTERNAL_RTD: 4, //short
			NFC_RECORD_TNF_UNKNOWN: 5, //short
			NFC_RECORD_TNF_UNCHANGED: 6, //short
			N_D_E_F_RECORD_TEXT_ENCODING_UTF8: 'UTF8',
			N_D_E_F_RECORD_TEXT_ENCODING_UTF16: 'UTF16',
			N_F_C_TAG_TYPE_GENERIC_TARGET: 'GENERIC_TARGET',
			N_F_C_TAG_TYPE_ISO14443_A: 'ISO14443_A',
			N_F_C_TAG_TYPE_ISO14443_4A: 'ISO14443_4A',
			N_F_C_TAG_TYPE_ISO14443_3A: 'ISO14443_3A',
			N_F_C_TAG_TYPE_MIFARE_MINI: 'MIFARE_MINI',
			N_F_C_TAG_TYPE_MIFARE_1K: 'MIFARE_1K',
			N_F_C_TAG_TYPE_MIFARE_4K: 'MIFARE_4K',
			N_F_C_TAG_TYPE_MIFARE_ULTRA: 'MIFARE_ULTRA',
			N_F_C_TAG_TYPE_MIFARE_DESFIRE: 'MIFARE_DESFIRE',
			N_F_C_TAG_TYPE_ISO14443_B: 'ISO14443_B',
			N_F_C_TAG_TYPE_ISO14443_4B: 'ISO14443_4B',
			N_F_C_TAG_TYPE_ISO14443_BPRIME: 'ISO14443_BPRIME',
			N_F_C_TAG_TYPE_FELICA: 'FELICA',
			N_F_C_TAG_TYPE_JEWEL: 'JEWEL',
			N_F_C_TAG_TYPE_ISO15693: 'ISO15693',
			N_F_C_TAG_TYPE_UNKNOWN_TARGET: 'UNKNOWN_TARGET',
		},

		getDefaultAdapter: function() {
			return this._wrap(tizen.nfc.getDefaultAdapter());
		},

		_wrap: function(object) {
			if (object.toString() === '[object NFCAdapter]') {
				return this.createNFCAdapter(object);
			}
		},

		createNDEFMessage: function(args) {
			return new (require('Ti/Tizen/NFC/NDEFMessage'))(args);
		},

		createNDEFRecord: function(args) {
			return new (require('Ti/Tizen/NFC/NDEFRecord'))(args);
		},

		createNDEFRecordText: function(args) {
			return new (require('Ti/Tizen/NFC/NDEFRecordText'))(args);
		},

		createNDEFRecordURI: function(args) {
			return new (require('Ti/Tizen/NFC/NDEFRecordURI'))(args);
		},

		createNDEFRecordMedia: function(args) {
			return new (require('Ti/Tizen/NFC/NDEFRecordMedia'))(args);
		},
	});
	function onNDEFMessageReadCallback(object, onsuccess) { 
		onsuccess.call(null, new NDEFMessage(object));
	};

	function onByteArraySuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new byte(object));
	};

});