// Wraps Tizen interface "MessageService" that resides in Tizen module "Messaging".

define(['Ti/_/declare', 'Tizen/_/WebAPIError', 'Tizen/_/Messaging/MessageStorage', 'Tizen/_/Messaging/MessageBody', 'Tizen/_/Messaging/MessageAttachment'],
	function(declare, WebAPIError, MessageStorage, MessageBody, MessageAttachment) {

		function onError (e, callback) {
			callback({
				code: e.code,
				success: false,
				error: e.type + ': ' + e.message
			});
		}

		function onSuccess (callback) {
			callback({
				code: 0,
				success: true
			});
		}

		var messageService = declare(null, {
			constructor: function(args) {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
				// Automatically initialize messageStorage.
				this.constants.__values__.messageStorage = new MessageStorage(this._obj.messageStorage);
			},

			sendMessage: function(message /*Message*/, callback) {
				this._obj.sendMessage(message._obj, callback && function (recipients) {
					callback({
						code: 0,
						success: true,
						recipients: recipients
					}, function (e) {
						onError(e, callback);
					});
				});
			},

			loadMessageBody: function(message /*Message*/, callback) {
				this._obj.loadMessageBody(message._obj, callback && function (message) {
					callback({
						code: 0,
						success: true,
						message: new MessageBody(message)
					});
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			loadMessageAttachment: function(attachment /*MessageAttachment*/, callback) {
				this._obj.loadMessageAttachment(attachment._obj, callback && function (attachment) {
					callback({
						code: 0,
						success: true,
						attachment: new MessageAttachment(attachment)
					});
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			sync: function(callback, limit /*unsigned long*/) {
				return this._obj.sync(callback && function () {
					onSuccess(callback);
				}, callback && function (e) {
					onError(e, callback);
				}, limit);
			},

			syncFolder: function(folder /*MessageFolder*/, callback, limit /*unsigned long*/) {
				return this._obj.syncFolder(folder._obj, callback && function () {
					onSuccess(callback);
				}, callback && function (e) {
					onError(e, callback);
				}, limit);
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

		// Initialize declaredClass, so that toString() works properly on such objects.
		// Correct operation of toString() is required for proper wrapping and automated testing.
		messageService.prototype.declaredClass = 'Tizen.Messaging.MessageService';

		return messageService;
	});
