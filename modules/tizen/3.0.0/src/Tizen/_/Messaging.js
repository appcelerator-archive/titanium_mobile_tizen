define(['Ti/_/lang', 'Tizen/_/Messaging/MessageService', 'Tizen/_/Messaging/Message', 'Tizen/_/Messaging/MessageAttachment', 'Ti/_/Evented', 'Tizen/_/WebAPIError'],
	function(lang, MessageService, Message, MessageAttachment, Evented, WebAPIError) {

		return lang.mixProps(require.mix({}, Evented), {

			getMessageServices: function(messageServiceType /*MessageServiceTag*/, successCallback /*MessageServiceArraySuccessCallback*/, errorCallback /*ErrorCallback*/, serviceId /*AccountServiceId*/) {

				function servicesListSuccessCallBack(objects) {
					var i = 0,
						objectsCount = objects.length,
						result = [];

					for (; i < objectsCount; i++) {
						result.push(new MessageService(objects[i]));
					}

					successCallback(result);
				}

				function wrappedErrorCallback(error) {
					errorCallback(new WebAPIError(error));
				}

				tizen.messaging.getMessageServices(messageServiceType, servicesListSuccessCallBack, errorCallback && wrappedErrorCallback, serviceId);
			},

			createMessage: function(args) {
				return new Message(args);
			},

			createMessageAttachment: function(args) {
				return new MessageAttachment(args);
			},

			constants: {
				MESSAGE_SERVICE_TAG_MESSAGINGSMS: 'messaging.sms',
				MESSAGE_SERVICE_TAG_MESSAGINGMMS: 'messaging.mms',
				MESSAGE_SERVICE_TAG_MESSAGINGEMAIL: 'messaging.email'
			}

		}, true);
	});