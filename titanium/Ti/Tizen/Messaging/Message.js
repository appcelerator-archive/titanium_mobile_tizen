define(['Ti/_/declare', 'Ti/Tizen/Messaging/MessageBody'], function(declare, MessageBody) {
	return declare('Ti.Tizen.Messaging.Message', null, {
		constructor: function(args) {
			if (args.toString && args.toString() === '[object Message]') {
				this._obj = args;
			} else {
				this._obj = new tizen.Message(args.type, args.messageInitDict);
			}

			this.body = new MessageBody(this._obj.body);
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			serviceId: {
				get: function() {
					return this._obj.serviceId;
				}
			},
			conversationId: {
				get: function() {
					return this._obj.conversationId;
				}
			},
			folderId: {
				get: function() {
					return this._obj.folderId;
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
			from: {
				get: function() {
					return this._obj.from;
				}
			},
			hasAttachment: {
				get: function() {
					return this._obj.hasAttachment;
				}
			},
			messageStatus: {
				get: function() {
					return this._obj.messageStatus;
				}
			},
		},

		properties: {
			to: {
				get: function() {
					return this._obj.to;
				},
				set: function(value) {
					this._obj.to = value;
				}
			},
			cc: {
				get: function() {
					return this._obj.cc;
				},
				set: function(value) {
					this._obj.cc = value;
				}
			},
			bcc: {
				get: function() {
					return this._obj.bcc;
				},
				set: function(value) {
					this._obj.bcc = value;
				}
			},
			body: {
				set: function(value) {
					this._obj.body = value._obj;

					return value;
				}
			},
			isRead: {
				get: function() {
					return this._obj.isRead;
				},
				set: function(value) {
					this._obj.isRead = value;
				}
			},
			isHighPriority: {
				get: function() {
					return this._obj.isHighPriority;
				},
				set: function(value) {
					this._obj.isHighPriority = value;
				}
			},
			subject: {
				get: function() {
					return this._obj.subject;
				},
				set: function(value) {
					this._obj.subject = value;
				}
			},
			inResponseTo: {
				get: function() {
					return this._obj.inResponseTo;
				},
				set: function(value) {
					this._obj.inResponseTo = value;
				}
			},
			attachments: {
				get: function() {
					return this._obj.attachments;
				},
				set: function(value) {
					this._obj.attachments = value;
				}
			},
		},
	});
});