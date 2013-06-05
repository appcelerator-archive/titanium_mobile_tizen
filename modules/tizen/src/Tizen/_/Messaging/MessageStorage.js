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

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			addDraftMessage: function(message /*Message*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [ message._obj ];
				(typeof callback !== 'undefined') && args.push(function () {
						onSuccess(callback);
					},
					function (e) {
						onError(e, callback);
					}
				);
				this._obj.addDraftMessage.apply(this._obj, args);
			},

			findMessages: function(filter /*AbstractFilter*/, callback, sort /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [
					filter._obj,
					function (messages) {
						var i = 0,
							messagesCount = messages.length,
							result = [];
						for (; i < messagesCount; i++) {
							result.push(new Message(void 0, messages[i]));
						}
						callback({
							code: 0,
							success: true,
							messages: result
						});
					},
					function (e) {
						onError(e, callback);
					}
				];
				(typeof sort !== 'undefined') && args.push(sort && sort._obj || sort);
				(typeof limit !== 'undefined') && args.push(limit);
				(typeof offset !== 'undefined') && args.push(offset);
				this._obj.findMessages.apply(this._obj, args);
			},

			removeMessages: function(messages /*Message*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var i = 0,
					tizenMessages = [],
					len = messages.length,
					args = [];

				for (; i < len; i++) {
					tizenMessages.push(messages[i]._obj);
				}

				args.push(tizenMessages);
				(typeof callback !== 'undefined') && args.push(function () {
						onSuccess(callback);
					},
					function (e) {
						onError(e, callback);
					}
				);

				this._obj.removeMessages.apply(this._obj, args);
			},

			updateMessages: function(messages /*Message*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var i = 0,
					tizenMessages = [],
					len = messages.length,
					args = [];

				for (; i < len; i++) {
					tizenMessages.push(messages[i]._obj);
				}

				args.push(tizenMessages);
				(typeof callback !== 'undefined') && args.push(function () {
						onSuccess(callback);
					},
					function (e) {
						onError(e, callback);
					}
				);

				this._obj.updateMessages.apply(this._obj, args);
			},

			findConversations: function(filter /*AbstractFilter*/, callback, sort /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [
					filter._obj,
					function (conversations) {
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
					}, 
					callback && function (e) {
						onError(e, callback);
					}
				];
				(typeof sort !== 'undefined') && args.push(sort && sort._obj || sort);
				(typeof limit !== 'undefined') && args.push(limit);
				(typeof offset !== 'undefined') && args.push(offset);
				this._obj.findConversations.apply(this._obj, args);
			},

			removeConversations: function(conversations /*MessageConversation*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var i = 0,
					tizenConversations = [],
					len = conversations.length;

				for (; i < len; i++) {
					tizenConversations.push(conversations[i]._obj);
				}

				args.push(tizenConversations);
				(typeof callback !== 'undefined') && args.push(function () {
						onSuccess(callback);
					},
					function (e) {
						onError(e, callback);
					}
				);

				this._obj.removeConversations.apply(this._obj, args);
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
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [
					{
						messagesupdated: function(items) {
							messagesChangeCallback.messagesupdated(getWrappedItems(items));
						},

						messagesadded: function(items) {
							messagesChangeCallback.messagesadded(getWrappedItems(items));
						},

						messagesremoved: function(items) {
							messagesChangeCallback.messagesremoved(getWrappedItems(items));
						}
					}
				];

				function getWrappedItems(items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						wrappedItems.push(new Message(void 0, items[i]));
					}

					return wrappedItems;
				}

				(typeof filter !== 'undefined') && args.push(filter && filter._obj || filter);

				return this._obj.addMessagesChangeListener.apply(this._obj, args);
			},

			addConversationsChangeListener: function(conversationsChangeCallback /*MessageConversationsChangeCallback*/, filter /*AbstractFilter*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [
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
					}
				];

				function getWrappedItems(items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						wrappedItems.push(new MessageConversation(items[i]));
					}

					return wrappedItems;
				}

				(typeof filter !== 'undefined') && args.push(filter._obj);

				this._obj.addConversationsChangeListener.apply(this._obj, args);
			},

			addFoldersChangeListener: function(foldersChangeCallback /*MessageFoldersChangeCallback*/, filter /*AbstractFilter*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [
					{
						foldersupdated: function(items) {
							foldersChangeCallback.foldersupdated(getWrappedItems(items));
						},

						foldersadded: function(items) {
							foldersChangeCallback.foldersadded(getWrappedItems(items));
						},

						foldersremoved: function(items) {
							foldersChangeCallback.foldersremoved(getWrappedItems(items));
						}
					}
				]; 

				function getWrappedItems(items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						wrappedItems.push(new MessageFolder(items[i]));
					}

					return wrappedItems;
				}

				(typeof filter !== 'undefined') && args.push(filter && filter._obj || filter);

				this._obj.addFoldersChangeListener.apply(this._obj, args);
			},

			removeChangeListener: function(watchId /*long*/) {
				this._obj.removeChangeListener(watchId);
			}

		});

		messageStorage.prototype.declaredClass = 'Tizen.Messaging.MessageStorage';
		return messageStorage;
	});
