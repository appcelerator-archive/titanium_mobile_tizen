define(['Ti/_/lang', 'Ti/Tizen/Messaging/MessageService', 'Ti/Tizen/Messaging/Message', 'Ti/Tizen/Messaging/MessageAttachment', 'Ti/_/Evented'], 
		function(lang, MessageService, Message, MessageAttachment, Evented) {
	return lang.setObject('Ti.Tizen.Messaging', Evented, {
		constants: {
			MESSAGE_SERVICE_TAG_MESSAGINGSMS: 'messaging.sms',
			MESSAGE_SERVICE_TAG_MESSAGINGMMS: 'messaging.mms',
			MESSAGE_SERVICE_TAG_MESSAGINGEMAIL: 'messaging.email',
		},

		getMessageServices: function(messageServiceType /*MessageServiceTag*/, successCallback /*MessageServiceArraySuccessCallback*/, errorCallback /*ErrorCallback*/, serviceId /*AccountServiceId*/) {
			function servicesListSuccessCallBack(objects) {
				var i = 0,
					objectsCount = objects.length,
					result = [];

				for (; i < objectsCount; i++) {
					result.push(new MessageService(objects[i]));
				}

				successCallback.call(this, result);
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
	});
});