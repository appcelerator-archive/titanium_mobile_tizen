define(['Ti/_/declare', 'Tizen/_/WebAPIError', 'Tizen/_/Messaging/MessageStorage', 'Tizen/_/Messaging/MessageBody', 'Tizen/_/Messaging/MessageAttachment'],
	function(declare, WebAPIError, MessageStorage, MessageBody, MessageAttachment) {

		var messageService = declare(null, {
			constructor: function(args) {
				this._obj = args;
				this.constants.__values__.messageStorage = new MessageStorage(this._obj.messageStorage);
			},

			sendMessage: function(message /*Message*/, successCallback /*MessageRecipientsCallback*/, errorCallback /*ErrorCallback*/) {
				this._obj.sendMessage(message._obj, successCallback, errorCallback && wrappedErrorCallback);
			},

			loadMessageBody: function(message /*Message*/, successCallback /*MessageBodySuccessCallback*/, errorCallback /*ErrorCallback*/) {
				function messageBodyLoadedSuccessCallback(message) {
					successCallback(new Ti.Tizen.Messaging.MessageBody(message));
				}

				this._obj.loadMessageBody(message._obj, messageBodyLoadedSuccessCallback, errorCallback && wrappedErrorCallback);
			},

			loadMessageAttachment: function(attachment /*MessageAttachment*/, successCallback /*MessageAttachmentSuccessCallback*/, errorCallback /*ErrorCallback*/) {
				function attachmentLoadedSuccessCallback(attachment) {
					successCallback(new Ti.Tizen.Messaging.MessageAttachment(attachment));
				}

				this._obj.loadMessageAttachment(attachment._obj, attachmentLoadedSuccessCallback, errorCallback && wrappedErrorCallback);
			},

			sync: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, limit /*unsigned long*/) {
				return this._obj.sync(successCallback, errorCallback && wrappedErrorCallback, limit);
			},

			syncFolder: function(folder /*MessageFolder*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, limit /*unsigned long*/) {
				return this._obj.syncFolder(folder._obj, successCallback, errorCallback && wrappedErrorCallback, limit);
			},

			stopSync: function(opId /*long*/) {
				this._obj.stopSync(opId);
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
			}

		});

		function wrappedErrorCallback(error) {
			errorCallback(new WebAPIError(error));
		}

		messageService.prototype.declaredClass = 'Tizen.Messaging.MessageService';

		return messageService;
	});