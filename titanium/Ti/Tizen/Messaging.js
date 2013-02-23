define(['Ti/_/lang', 'Ti/Tizen/Messaging/MessageService'], function(lang, MessageService) {
	return lang.setObject('Ti.Tizen.Messaging', {
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

			return tizen.messaging.getMessageServices(messageServiceType, servicesListSuccessCallBack, errorCallback, serviceId);
		},

		createMessage: function(args) {
			return new (require('Ti/Tizen/Messaging/Message'))(args);
		},

		createMessageAttachment: function(args) {
			return new (require('Ti/Tizen/Messaging/MessageAttachment'))(args);
		},
	});
});