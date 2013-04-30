// Wraps Tizen interface "MessageAttachment" that resides in Tizen module "Messaging".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var messageAttachment = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				if ('filePath' in args) {
					this._obj = new tizen.MessageAttachment(args.filePath, args.mimeType);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
			}
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			messageId: {
				get: function() {
					return this._obj.messageId;
				}
			},
			mimeType: {
				get: function() {
					return this._obj.mimeType;
				}
			},
			filePath: {
				get: function() {
					return this._obj.filePath;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	messageAttachment.prototype.declaredClass = 'Tizen.Messaging.MessageAttachment';
	return messageAttachment;
});
