// Wraps Tizen interface "MessageConverstation" that resides in Tizen module "Messaging".

define(['Ti/_/declare'], function(declare) {

	var messageConversation = declare(null, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
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
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	messageConversation.prototype.declaredClass = 'Tizen.Messaging.MessageConversation';
	return messageConversation;
});
