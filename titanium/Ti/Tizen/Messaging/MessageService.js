define(['Ti/_/declare', 'Ti/Tizen/Messaging/MessageStorage'], function(declare, MessageStorage) {
	return declare('Ti.Tizen.Messaging.MessageService', null, {
		constructor: function(args) {
			this._obj = args;
			this.constants.__values__.messageStorage = new MessageStorage(this._obj.messageStorage);
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
			name: {
				get: function() {
					return this._obj.name;
				}
			},
			messageStorage: {}
		},

		sendMessage: function(message /*Message*/, successCallback /*MessageRecipientsCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.sendMessage(message._obj, successCallback, errorCallback);
		},

		loadMessageBody: function(message /*Message*/, successCallback /*MessageBodySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.loadMessageBody(message._obj, successCallback, errorCallback);
		},

		loadMessageAttachment: function(attachment /*MessageAttachment*/, successCallback /*MessageAttachmentSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.loadMessageAttachment(attachment._obj, successCallback, errorCallback);
		},

		sync: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, limit /*unsigned long*/) {
			return this._obj.sync(successCallback, errorCallback, limit);
		},

		syncFolder: function(folder /*MessageFolder*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, limit /*unsigned long*/) {
			return this._obj.syncFolder(folder._obj, successCallback, errorCallback, limit);
		},

		stopSync: function(opId /*long*/) {
			return this._obj.stopSync(opId);
		},
	});
});