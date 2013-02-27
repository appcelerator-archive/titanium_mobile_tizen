define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.Messaging.MessageAttachment', Evented, {
		constructor: function(args) {
			if (args.toString() === '[object MessageAttachment]') {
				this._obj = args;
			} else {	
				if (args.hasOwnProperty('filePath')) {
					this._obj = new tizen.MessageAttachment(args.filePath, args.mimeType);
				} else {
					Ti.API.error('MessageAttachment\'s constructor with such arguments not found.');
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
			},
		},
	});
});