define(['Ti/_/declare', '_/Messaging/Message', '_/Messaging/MessageFolder', '_/Messaging/MessageConversation', '_/WebAPIError'],
	function(declare, Message, MessageFolder, MessageConversation, WebAPIError) {

		var messageStorage = declare(null, {

			constructor: function(args) {
				this._obj = args;
			},

			addDraftMessage: function(message /*Message*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
				this._obj.addDraftMessage(message._obj, successCallback, errorCallback && wrappedErrorCallback);
			},

			findMessages: function(filter /*AbstractFilter*/, successCallback /*MessageArraySuccessCallback*/, errorCallback /*ErrorCallback*/, sort /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				function messagesListSuceessCallBack(objects) {
					var i = 0,
						objectsCount = objects.length,
						result = [];

					for (; i < objectsCount; i++) {
						result.push(new Message(objects[i]));
					}

					successCallback.call(this, result);
				}


				this._obj.findMessages(filter._obj, messagesListSuceessCallBack, errorCallback && wrappedErrorCallback, sort ? sort._obj : sort, limit, offset);
			},

			removeMessages: function(messages /*Message*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
				var i = 0,
					tizenMessages = [],
					len = messages.length;

				for (; i < len; i++) {
					tizenMessages.push(messages[i]._obj);
				}

				this._obj.removeMessages(tizenMessages, successCallback, errorCallback && wrappedErrorCallback);
			},

			updateMessages: function(messages /*Message*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
				var i = 0,
					tizenMessages = [],
					len = messages.length;

				for (; i < len; i++) {
					tizenMessages.push(messages[i]._obj);
				}

				this._obj.updateMessages(tizenMessages, successCallback, errorCallback && wrappedErrorCallback);
			},

			findConversations: function(filter /*AbstractFilter*/, successCallback /*MessageConversationArraySuccessCallback*/, errorCallback /*ErrorCallback*/, sort /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				function conversationsListSuceessCallBack(objects) {
					var i = 0,
						objectsCount = objects.length,
						result = [];

					for (; i < objectsCount; i++) {
						result.push(new MessageConversation(objects[i]));
					}

					successCallback.call(this, result);
				}

				this._obj.findConversations(filter._obj, conversationsListSuceessCallBack, errorCallback && wrappedErrorCallback, sort ? sort._obj : sort, limit, offset);
			},

			removeConversations: function(conversations /*MessageConversation*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
				var i = 0,
					tizenConversations = [],
					len = conversations.length;

				for (; i < len; i++) {
					tizenConversations.push(conversations[i]._obj);
				}

				this._obj.removeConversations(tizenConversations, successCallback, errorCallback && wrappedErrorCallback);
			},

			findFolders: function(filter /*AbstractFilter*/, successCallback /*MessageFolderArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
				function foldersListSuccessCallBack(objects) {
					var i = 0,
						len = objects.length,
						result = [];

					for (; i < len; i++) {
						result.push(new MessageFolder(objects[i]));
					}

					successCallback.call(this, result);
				}

				this._obj.findFolders(filter._obj, foldersListSuccessCallBack, errorCallback && wrappedErrorCallback);
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

				var wrappedMessagesChangeCallback = {
					messagesupdated: function(items) {
						messagesChangeCallback.messagesChangeCallback.messagesupdated.call(this, getWrappedItems(items));
					},

					messagesadded: function(items) {
						messagesChangeCallback.messagesadded.call(this, getWrappedItems(items));
					},

					messagesremoved: function(items) {
						messagesChangeCallback.messagesremoved.call(this, getWrappedItems(items));
					}
				};

				return this._obj.addMessagesChangeListener(messagesChangeCallback && wrappedMessagesChangeCallback, filter ? filter._obj : filter);
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

				var wrappedConversationsChangeCallback = {
					conversationsupdated: function(items) {
						conversationsChangeCallback.conversationsupdated.call(this, getWrappedItems(items));
					},

					conversationsadded: function(items) {
						conversationsChangeCallback.conversationsadded.call(this, getWrappedItems(items));
					},

					conversationsremoved: function(items) {
						conversationsChangeCallback.conversationsremoved.call(this, getWrappedItems(items));
					}
				};

				this._obj.addConversationsChangeListener(conversationsChangeCallback && wrappedConversationsChangeCallback, filter ? filter._obj : filter);
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

				var wrappedFoldersChangeCallback = {
					foldersupdated: function(items) {
						foldersChangeCallback.foldersupdated.call(this, getWrappedItems(items));
					},

					foldersadded: function(items) {
						foldersChangeCallback.foldersadded.call(this, getWrappedItems(items));
					},

					foldersremoved: function(items) {
						foldersChangeCallback.foldersremoved.call(this, getWrappedItems(items));
					}
				};

				this._obj.addFoldersChangeListener(wrappedFoldersChangeCallback, filter ? filter._obj : filter);
			},

			removeChangeListener: function(watchId /*long*/) {
				this._obj.removeChangeListener(watchId);
			}

		});

		function wrappedErrorCallback(error) {
			errorCallback(new WebAPIError(error));
		}

		messageStorage.prototype.declareClass = 'Tizen.Messaging.MessageStorage';
		return messageStorage;
	});