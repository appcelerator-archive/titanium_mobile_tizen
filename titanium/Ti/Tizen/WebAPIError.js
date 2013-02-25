define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.WebAPIError', null, {
		constants: {
			INDEX_SIZE_ERR: 1, //unsigned short
			DOMSTRING_SIZE_ERR: 2, //unsigned short
			HIERARCHY_REQUEST_ERR: 3, //unsigned short
			WRONG_DOCUMENT_ERR: 4, //unsigned short
			INVALID_CHARACTER_ERR: 5, //unsigned short
			NO_DATA_ALLOWED_ERR: 6, //unsigned short
			NO_MODIFICATION_ALLOWED_ERR: 7, //unsigned short
			NOT_FOUND_ERR: 8, //unsigned short
			NOT_SUPPORTED_ERR: 9, //unsigned short
			INUSE_ATTRIBUTE_ERR: 10, //unsigned short
			INVALID_STATE_ERR: 11, //unsigned short
			SYNTAX_ERR: 12, //unsigned short
			INVALID_MODIFICATION_ERR: 13, //unsigned short
			NAMESPACE_ERR: 14, //unsigned short
			INVALID_ACCESS_ERR: 15, //unsigned short
			VALIDATION_ERR: 16, //unsigned short
			TYPE_MISMATCH_ERR: 17, //unsigned short
			SECURITY_ERR: 18, //unsigned short
			NETWORK_ERR: 19, //unsigned short
			ABORT_ERR: 20, //unsigned short
			URL_MISMATCH_ERR: 21, //unsigned short
			QUOTA_EXCEEDED_ERR: 22, //unsigned short
			TIMEOUT_ERR: 23, //unsigned short
			INVALID_NODE_TYPE_ERR: 24, //unsigned short
			DATA_CLONE_ERR: 25 //unsigned short
		},

		constants: {
			code: {
				get: function() {
					return this._obj.code;
				}
			},
			name: {
				get: function() {
					return this._obj.name;
				}
			},
			message: {
				get: function() {
					return this._obj.message;
				}
			},
		},

	});
});