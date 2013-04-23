// Wraps Tizen module "Messaging".

define(['Ti/_/lang', 'Tizen/_/Messaging/MessageService', 'Tizen/_/Messaging/Message', 'Tizen/_/Messaging/MessageAttachment', 'Ti/_/Evented'],
	function(lang, MessageService, Message, MessageAttachment, Evented) {

		return lang.mixProps(require.mix({}, Evented), {

			getMessageServices: function(messageServiceType /*MessageServiceTag*/, callback, serviceId /*AccountServiceId*/) {
				tizen.messaging.getMessageServices(messageServiceType, callback && function (services) {
					var i = 0,
						servicesCount = services.length,
						result = [];
					for (; i < servicesCount; i++) {
						result.push(new MessageService(services[i]));
					}
					callback({
						code: 0,
						success: true,
						services: result
					});
				}, callback && function (e) {
					callback({
						code: e.code,
						success: true,
						error: e.type + ': ' + e.message
					});
				}, serviceId);
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