define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Messaging.MessageAttachment', null, {
		constructor: function(args) {
			if (args.toString() === '[object MessageAttachment]') {
				this._obj = args;
			} else {
				this._obj = new tizen.MessageAttachment(args.filePath, args.mimeType);
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
			},
		},
	});
});