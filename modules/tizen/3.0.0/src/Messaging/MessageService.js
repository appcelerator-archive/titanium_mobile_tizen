define(['Ti/_/declare', 'WebAPIError', 'Messaging/MessageStorage', 'Messaging/MessageBody', 'Messaging/MessageAttachment'], 
		function(declare, WebAPIError, MessageStorage, MessageBody, MessageAttachment) {

	var messageService = declare(null, {
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
			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			this._obj.sendMessage(message._obj, successCallback, errorCallback && wrappedErrorCallback);
		},

		loadMessageBody: function(message /*Message*/, successCallback /*MessageBodySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function messageBodyLoadedSuccessCallback(message) {
				successCallback.call(this, new Ti.Tizen.Messaging.MessageBody(message));
			}

			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			this._obj.loadMessageBody(message._obj, successCallback, errorCallback && wrappedErrorCallback);
		},

		loadMessageAttachment: function(attachment /*MessageAttachment*/, successCallback /*MessageAttachmentSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function attachmentLoadedSuccessCallback(attachment) {
				successCallback.call(this, new Ti.Tizen.Messaging.MessageAttachment(attachment));
			}

			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			this._obj.loadMessageAttachment(attachment._obj, successCallback, errorCallback && wrappedErrorCallback);
		},

		sync: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, limit /*unsigned long*/) {
			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			return this._obj.sync(successCallback, errorCallback && wrappedErrorCallback, limit);
		},

		syncFolder: function(folder /*MessageFolder*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, limit /*unsigned long*/) {
			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}
			
			return this._obj.syncFolder(folder._obj, successCallback, errorCallback && wrappedErrorCallback, limit);
		},

		stopSync: function(opId /*long*/) {
			this._obj.stopSync(opId);
		}
	});

	messageService.prototype.declaredClass = 'Tizen.Messaging.MessageService';

	return messageService;
});