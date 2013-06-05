// Wraps Tizen interface "Message" that resides in Tizen module "Messaging".

define(['Ti/_/declare', 'Tizen/_/Messaging/MessageBody', 'Ti/_/Evented'], function(declare, MessageBody, Evented) {

	var message = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				if('type' in args){
					// args is a dictionary that the user of the wrapper module passed to the creator function.
					this._obj = (typeof args.messageInitDict !== 'undefined') ? 
						new tizen.Message(args.type, args.messageInitDict) : 
						new tizen.Message(args.type);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
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
			}
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
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	message.prototype.declaredClass = 'Tizen.Messaging.Message';
	return message;
});
