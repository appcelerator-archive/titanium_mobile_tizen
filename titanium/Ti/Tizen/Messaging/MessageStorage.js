define(['Ti/_/declare', 'Ti/Tizen/Messaging/Message', 'Ti/Tizen/Messaging/MessageFolder', 'Ti/Tizen/Messaging/MessageConversation'], function(declare, Message, MessageFolder, MessageConversation) {
	return declare('Ti.Tizen.Messaging.MessageStorage', null, {
		constructor: function(args) {
			this._obj = args;
		},

		addDraftMessage: function(message /*Message*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			this._obj.addDraftMessage(message._obj, successCallback, errorCallback);
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

			this._obj.findMessages(filter._obj, messagesListSuceessCallBack, errorCallback, sort ? sort._obj : sort, limit, offset);
		},

		removeMessages: function(messages /*Message*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var i = 0,
				tizenMessages = [],
				len = messages.length;

			for (; i < len; i++) {
				tizenMessages.push(messages[i]._obj);
			}

			this._obj.removeMessages(tizenMessages, successCallback, errorCallback);
		},

		updateMessages: function(messages /*Message*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var i = 0,
				tizenMessages = [],
				len = messages.length;

			for (; i < len; i++) {
				tizenMessages.push(messages[i]._obj);
			}

			this._obj.updateMessages(tizenMessages, successCallback, errorCallback);
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

			this._obj.findConversations(filter._obj, conversationsListSuceessCallBack, errorCallback, sort ? sort._obj : sort, limit, offset);
		},

		removeConversations: function(conversations /*MessageConversation*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var i = 0,
				tizenConversations = [],
				len = conversations.length;

			for (; i < len; i++) {
				tizenConversations.push(conversations[i]._obj);
			}

			this._obj.removeConversations(tizenConversations, successCallback, errorCallback);
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

			this._obj.findFolders(filter._obj, foldersListSuccessCallBack, errorCallback);
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
					messagesChangeCallback.messagesupdated.call(this, getWrappedItems(items));
				},

				messagesadded: function(items) {
					messagesChangeCallback.messagesadded.call(this, getWrappedItems(items));
				},

				messagesremoved: function(items) {
					messagesChangeCallback.messagesremoved.call(this, getWrappedItems(items));
				}
			};

			return this._obj.addMessagesChangeListener(wrappedMessagesChangeCallback, filter ? filter._obj : filter);
		},

		addConversationsChangeListener: function(conversationsChangeCallback /*MessageConversationsChangeCallback*/, filter /*AbstractFilter*/) {
			this._obj.addConversationsChangeListener(conversationsChangeCallback, filter ? filter._obj : filter);
		},

		addFoldersChangeListener: function(foldersChangeCallback /*MessageFoldersChangeCallback*/, filter /*AbstractFilter*/) {
			this._obj.addFoldersChangeListener(foldersChangeCallback, filter ? filter._obj : filter);
		},

		removeChangeListener: function(watchId /*long*/) {
			this._obj.removeChangeListener(watchId);
		}
	});
});