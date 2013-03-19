define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.Messaging.MessageConversation', null, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			timestamp: {
				get: function() {
					return this._obj.timestamp;
				}
			},
			messageCount: {
				get: function() {
					return this._obj.messageCount;
				}
			},
			unreadMessages: {
				get: function() {
					return this._obj.unreadMessages;
				}
			},
			preview: {
				get: function() {
					return this._obj.preview;
				}
			},
			subject: {
				get: function() {
					return this._obj.subject;
				}
			},
			isRead: {
				get: function() {
					return this._obj.isRead;
				}
			},
			from: {
				get: function() {
					return this._obj.from;
				}
			},
			to: {
				get: function() {
					return this._obj.to;
				}
			},
			cc: {
				get: function() {
					return this._obj.cc;
				}
			},
			bcc: {
				get: function() {
					return this._obj.bcc;
				}
			},
			lastMessageId: {
				get: function() {
					return this._obj.lastMessageId;
				}
			},
		},

	});
});