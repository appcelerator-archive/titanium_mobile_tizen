define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Messaging.MessageBody', null, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			messageId: {
				get: function() {
					return this._obj.messageId;
				}
			},
			loaded: {
				get: function() {
					return this._obj.loaded;
				}
			},
		},

		properties: {
			plainBody: {
				get: function() {
					return this._obj.plainBody;
				},
				set: function(value) {
					this._obj.plainBody = value;
				}
			},
			htmlBody: {
				get: function() {
					return this._obj.htmlBody;
				},
				set: function(value) {
					this._obj.htmlBody = value;
				}
			},
			inlineAttachments: {
				get: function() {
					return this._obj.inlineAttachments;
				},
				set: function(value) {
					this._obj.inlineAttachments = value;
				}
			},
		},
	});
});