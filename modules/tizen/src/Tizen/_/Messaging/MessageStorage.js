// Wraps Tizen interface "MessageStorage" that resides in Tizen module "Messaging".

define(['Ti/_/declare', 'Tizen/_/Messaging/Message', 'Tizen/_/Messaging/MessageFolder', 'Tizen/_/Messaging/MessageConversation'],
	function(declare, Message, MessageFolder, MessageConversation) {

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

		var messageStorage = declare(null, {

			constructor: function(args) {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			},

			addDraftMessage: function(message /*Message*/, callback) {
				this._obj.addDraftMessage(message._obj, callback && function () {
					onSuccess(callback);
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			findMessages: function(filter /*AbstractFilter*/, callback, sort /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				this._obj.findMessages(filter._obj, callback && function (messages) {
					var i = 0,
						messagesCount = messages.length,
						result = [];
					for (; i < messagesCount; i++) {
						result.push(new Message(messages[i]));
					}
					callback({
						code: 0,
						success: true,
						messages: result
					});
				}, callback && function (e) {
					onError(e, callback);
				}, sort ? sort._obj : sort, limit, offset);
			},

			removeMessages: function(messages /*Message*/, callback) {
				var i = 0,
					tizenMessages = [],
					len = messages.length;

				for (; i < len; i++) {
					tizenMessages.push(messages[i]._obj);
				}

				this._obj.removeMessages(tizenMessages, callback && function () {
					onSuccess(callback);
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			updateMessages: function(messages /*Message*/, callback) {
				var i = 0,
					tizenMessages = [],
					len = messages.length;

				for (; i < len; i++) {
					tizenMessages.push(messages[i]._obj);
				}

				this._obj.updateMessages(tizenMessages, callback && function () {
					onSuccess(callback);
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			findConversations: function(filter /*AbstractFilter*/, callback, sort /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				this._obj.findConversations(filter._obj, callback && function (conversations) {
					var i = 0,
						conversationsCount = conversations.lengh,
						result = [];
					for (; i < conversationsCount; i++) {
						result.push(new MessageConversation(conversations[i]));
					}
					callback({
						code: 0,
						success: true,
						conversations: result
					});
				}, callback && function (e) {
					onError(e, callback);
				}, sort ? sort._obj : sort, limit, offset);
			},

			removeConversations: function(conversations /*MessageConversation*/, callback) {
				var i = 0,
					tizenConversations = [],
					len = conversations.length;

				for (; i < len; i++) {
					tizenConversations.push(conversations[i]._obj);
				}

				this._obj.removeConversations(tizenConversations, callback && function () {
					onSuccess(callback);
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			findFolders: function(filter /*AbstractFilter*/, callback) {
				this._obj.findFolders(filter._obj, callback && function (folders) {
					var i = 0,
						foldersCount = folders.length,
						result = [];
					for  (; i < foldersCount; i++) {
						result.push(new MessageFolder(folders[i]));
					}
					callback({
						code: 0,
						success: true,
						folders: result
					});
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			addMessagesChangeListener: function(messagesChangeCallback /*MessagesChangeCallback*/, filter /*AbstractFilter*/) {
				function getWrappedItems(items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						wrappedItems.push(new Message(items[i]));
					}

					return wrappedItems;
				}

				return this._obj.addMessagesChangeListener(messagesChangeCallback && {
					messagesupdated: function(items) {
						messagesChangeCallback.messagesChangeCallback.messagesupdated(getWrappedItems(items));
					},

					messagesadded: function(items) {
						messagesChangeCallback.messagesadded(getWrappedItems(items));
					},

					messagesremoved: function(items) {
						messagesChangeCallback.messagesremoved(getWrappedItems(items));
					}
				}, filter ? filter._obj : filter);
			},

			addConversationsChangeListener: function(conversationsChangeCallback /*MessageConversationsChangeCallback*/, filter /*AbstractFilter*/) {
				function getWrappedItems(items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						wrappedItems.push(new MessageConversation(items[i]));
					}

					return wrappedItems;
				}

				this._obj.addConversationsChangeListener(conversationsChangeCallback && 
				{
					conversationsupdated: function(items) {
						conversationsChangeCallback.conversationsupdated(getWrappedItems(items));
					},

					conversationsadded: function(items) {
						conversationsChangeCallback.conversationsadded(getWrappedItems(items));
					},

					conversationsremoved: function(items) {
						conversationsChangeCallback.conversationsremoved(getWrappedItems(items));
					}
				}, filter ? filter._obj : filter);
			},

			addFoldersChangeListener: function(foldersChangeCallback /*MessageFoldersChangeCallback*/, filter /*AbstractFilter*/) {
				function getWrappedItems(items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						wrappedItems.push(new MessageFolder(items[i]));
					}

					return wrappedItems;
				}

				this._obj.addFoldersChangeListener(foldersChangeCallback && {
					foldersupdated: function(items) {
						foldersChangeCallback.foldersupdated(getWrappedItems(items));
					},

					foldersadded: function(items) {
						foldersChangeCallback.foldersadded(getWrappedItems(items));
					},

					foldersremoved: function(items) {
						foldersChangeCallback.foldersremoved(getWrappedItems(items));
					}
				}, filter ? filter._obj : filter);
			},

			removeChangeListener: function(watchId /*long*/) {
				this._obj.removeChangeListener(watchId);
			}

		});

		messageStorage.prototype.declaredClass = 'Tizen.Messaging.MessageStorage';
		return messageStorage;
	});
