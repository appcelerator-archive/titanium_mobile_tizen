define(['Ti/_/lang', 'Ti/Tizen/NFC/NDEFMessage','Ti/Tizen/NFC/NDEFRecord','Ti/Tizen/NFC/NDEFRecordText','Ti/Tizen/NFC/NDEFRecordURI','Ti/Tizen/NFC/NDEFRecordMedia', 'Ti/Tizen/NFC/NFCAdapter'], 
function(lang,NDEFMessage,NDEFRecord,NDEFRecordText,NDEFRecordURI,NDEFRecordMedia,NFCAdapter) {
	return lang.setObject('Ti.Tizen.NFC', {

		constants: {
			NFC_RECORD_TNF_EMPTY: 0, //short
			NFC_RECORD_TNF_WELL_KNOWN: 1, //short
			NFC_RECORD_TNF_MIME_MEDIA: 2, //short
			NFC_RECORD_TNF_URI: 3, //short
			NFC_RECORD_TNF_EXTERNAL_RTD: 4, //short
			NFC_RECORD_TNF_UNKNOWN: 5, //short
			NFC_RECORD_TNF_UNCHANGED: 6, //short
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
			NFC_TAG_TYPE_UNKNOWN_TARGET: 'UNKNOWN_TARGET',
		},

		getDefaultAdapter: function() {
			return this._wrap(tizen.nfc.getDefaultAdapter());
		},

		_wrap: function(object) {
			if (object.toString() === '[object NFCAdapter]') {
				return this.createNFCAdapter(object);
			}
		},

		createNFCAdapter: function(args) {
			return new NFCAdapter(args); //Need to add this module NFCAdapter in define, with path Ti/Tizen/NFC/NFCAdapter
		},

		createNDEFMessage: function(args) {
			return new NDEFMessage(args); //Need to add this module NDEFMessage in define, with path Ti/Tizen/NFC/NDEFMessage
		},

		createNDEFRecord: function(args) {
			return new NDEFRecord(args); //Need to add this module NDEFRecord in define, with path Ti/Tizen/NFC/NDEFRecord
		},

		createNDEFRecordText: function(args) {
			return new NDEFRecordText(args); //Need to add this module NDEFRecordText in define, with path Ti/Tizen/NFC/NDEFRecordText
		},

		createNDEFRecordURI: function(args) {
			return new NDEFRecordURI(args); //Need to add this module NDEFRecordURI in define, with path Ti/Tizen/NFC/NDEFRecordURI
		},

		createNDEFRecordMedia: function(args) {
			return new NDEFRecordMedia(args); //Need to add this module NDEFRecordMedia in define, with path Ti/Tizen/NFC/NDEFRecordMedia
		},
	});
	function onNDEFMessageReadCallback(object, onsuccess) { 
		onsuccess(new NDEFMessage(object));
	};

	function onByteArraySuccessCallback(object, onsuccess) { 
		onsuccess(new byte(object));
	};

});