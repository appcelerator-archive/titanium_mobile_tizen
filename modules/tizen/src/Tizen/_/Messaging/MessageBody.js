// Wraps Tizen interface "MessageBody" that resides in Tizen module "Messaging".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var messageBody = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
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
			}
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
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	messageBody.prototype.declaredClass = 'Tizen.Messaging.MessageBody';
	return messageBody;
});
