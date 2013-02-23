/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

// To use this suite add test email account on device:
// login: 	test.anvil@gmail.com
// pass: 	test12anvil34

module.exports = new function() {
	var finish,
		valueOf,
		reportError,
		MESSAGING_SMS = 'messaging.sms',
		MESSAGING_EMAIL = 'messaging.email',
		TEST_EMAIL = 'test.anvil@gmail.com';


	this.name = 'messaging';
	this.tests = [
		{name: 'getEmailServices'},
		{name: 'addDraftMessage'},
		{name: 'removeMessages', timeout: 25000},
		{name: 'sendSMS'},
		{name: 'findFolders'},
		{name: 'syncFolders'},
		{name: 'messageAttach'},
		{name: 'conversations', timeout: 25000},
		{name: 'messageBody', timeout: 25000},
		{name: 'updateMessages', timeout: 25000}
	];

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	};

	// Report error and finish test
	var finishWithError = function(testRun, errorMessage) {
		Ti.API.info('The following error occurred: ' + errorMessage);

		reportError(testRun, 'The following error occurred: ' + errorMessage);
		finish(testRun);
	}

	// Return list of email services
	var getServices = function(testRun, serviceName, callBack) {
		Ti.API.info('Get services started.');

		function serviceListCB(services) {
			var i = 0, 
				len = services.length;

			Ti.API.info(len + ' services found.');

			if (len == 0) {
				finishWithError(testRun, 'To run the messaging suite, you must configure a test email account on this Tizen device. Please go to Settings, Email, Add.');
			} else {
				valueOf(testRun, services).shouldBeObject();
				valueOf(testRun, services).shouldNotBeNull();

				Ti.API.info('Start to test services properties.');

				for (; i < len; i++) {
					valueOf(testRun, services[i]).shouldNotBeNull();
					valueOf(testRun, services[i]).shouldNotBeUndefined();
					valueOf(testRun, services[i]).shouldBeObject();
					valueOf(testRun, services[i].toString()).shouldBe('[object TiTizenMessagingMessageService]');
					valueOf(testRun, services[i].messageStorage).shouldNotBeNull();
					valueOf(testRun, services[i].messageStorage).shouldBeObject();					
					valueOf(testRun, services[i].messageStorage.toString()).shouldBe('[object TiTizenMessagingMessageStorage]');
				}

				setTimeout(function() {
					callBack && callBack(services);
				}, 2000);

				Ti.API.info('Get services end.');
			}
		}

		function errorCallback(error) {
			finishWithError(testRun, error.message);
		}

		valueOf(testRun, Ti.Tizen.Messaging).shouldBeObject();
		valueOf(testRun, Ti.Tizen.Messaging).shouldNotBeNull();
		valueOf(testRun, function() { Ti.Tizen.Messaging.getMessageServices(serviceName, serviceListCB, errorCallback); }).shouldNotThrowException();
	}

	// Get email messages of text messages from inbox
	var getMessages = function(testRun, emailService, messagingType, callBack) {
		Ti.API.info('Start to find messages.');
		
		function errorCallback(error) {
			finishWithError(testRun, error.message);
		}

		// Define the success callback for find message
		function messageQueryCallback(messages) {		
			Ti.API.info(messages.length + ' message(s) found.');
				
			setTimeout(function() {
				callBack && callBack(messages);
			}, 1000);
		};
		
		var attributeFilter = Ti.Tizen.createAttributeFilter({
			attributeName: 'type',
			matchFlag: 'EXACTLY',
			matchValue: messagingType
		});

		valueOf(testRun, attributeFilter).shouldNotBeNull();
		valueOf(testRun, attributeFilter).shouldNotBeUndefined();
		valueOf(testRun, emailService.messageStorage).shouldNotBeNull();
		valueOf(testRun, emailService.messageStorage.findMessages).shouldBeFunction();
		valueOf(testRun, function() {
			emailService.messageStorage.findMessages(
				attributeFilter,
				messageQueryCallback,
				errorCallback
			); 
		}).shouldNotThrowException();
	}

	// Send new email to the test email account
	var sendEmail = function(testRun, emailService, callBack) {
		var message, 
			recipientsList = [TEST_EMAIL];

		Ti.API.info('Start send email message.');

		function messageSent(recipients) {
			valueOf(testRun, recipients.length).shouldBeGreaterThan(0);
			
			for (var i = 0; i < recipients.length; i++) {
			   Ti.API.info('The email has been sent to ' + recipients[i]);
			}			

			setTimeout(function() {
				callBack && callBack(recipients, message);
			}, 2000);
		}

		function errorCallback(error) {
			finishWithError(testRun, error.message);
		}			
		
		valueOf(testRun, function() {
			message = Ti.Tizen.Messaging.createMessage({
				type: MESSAGING_EMAIL,
				messageInitDict: {
					subject: 'email subject', 
					plainBody: 'plain_body text',
					htmlBody: 'html_body text',
					to: recipientsList
				}
			});
		}).shouldNotThrowException();
		valueOf(testRun, emailService).shouldBeObject();
		valueOf(testRun, emailService).shouldNotBeNull();		        
		valueOf(testRun, message).shouldBeObject();
		valueOf(testRun, message).shouldNotBeNull();
		valueOf(testRun, function() { emailService.sendMessage(message, messageSent, errorCallback); }).shouldNotThrowException();
	}

	// Get messages from test email account and remove these
	var removeAllMessages = function(testRun, emailService, messagingType, callBack) {
		Ti.API.info('Start removeAllMessages function.');

		function successCallback() {
			Ti.API.info('All messages has been removed successfully.');

			setTimeout(function() {
				callBack && callBack();
			}, 2000);
		}

		function errorCallback(error) {
			finishWithError(testRun, error.message);
		}

		function removeMessages(messages) {
			if (messages.length > 0) {
				Ti.API.info(messages.length + ' message(s) found. Start to remove.');

				valueOf(testRun, emailService.messageStorage.removeMessages).shouldBeFunction();
				valueOf(testRun, function() { emailService.messageStorage.removeMessages(messages, successCallback, errorCallback); }).shouldNotThrowException();
			} else {
				Ti.API.info('Nothing to remove. Start to call callback function.');

				setTimeout(function() {
					callBack && callBack();
				}, 2000);
			}
		}

		getMessages(testRun, emailService, messagingType, removeMessages);
	}

	// Return list of folders
	var getFolders = function(testRun, emailService, filter, callBack) {
		Ti.API.info('Start to find folders.');

		function errorCallback(error) {
			finishWithError(testRun, error.message);
		}

		function folderArrayCB(folders) {
			Ti.API.info(folders.length + ' folder(s) found.');

			valueOf(testRun, folders).shouldNotBeNull();
			valueOf(testRun, folders).shouldBeObject();
			valueOf(testRun, folders.length).shouldBeGreaterThan(0);

			setTimeout(function() {
				callBack && callBack(folders);
			}, 500);
		};

		valueOf(testRun, filter).shouldNotBeNull();
		valueOf(testRun, filter).shouldBeObject();
		valueOf(testRun, filter).shouldNotBeUndefined();
		valueOf(testRun, emailService.messageStorage.findFolders).shouldBeFunction();
		valueOf(testRun, function() { emailService.messageStorage.findFolders(filter, folderArrayCB, errorCallback); }).shouldNotThrowException();
	}

	// Get message services that are available on the Tizen emulator/device
	// Check their properties
	this.getEmailServices = function(testRun) {
		function testGetServices(services) {
			Ti.API.info('Start check services test.');

			valueOf(testRun, services.length).shouldBeGreaterThan(0);

			for (var i = 0, len = services.length; i < len; i++) {
				valueOf(testRun, services[i].id).shouldBeString();
				valueOf(testRun, services[i].name).shouldNotBe('');
				valueOf(testRun, services[i].name).shouldBeString();
				valueOf(testRun, services[i].type).shouldBe(MESSAGING_EMAIL);
				valueOf(testRun, services[i].messageStorage).shouldBeObject();
			}

			Ti.API.info('End check services test.');

			finish(testRun);
		}

		getServices(testRun, MESSAGING_EMAIL, testGetServices);
	}

	// Empty the test email, account, add draft email message, read it back and verify it's the same.
	this.addDraftMessage = function(testRun) {
		function testAddDraftMessage(services) {
			var emailService = services[0],
				message,
				recipientsList = [TEST_EMAIL];

			function allMessagesRemoved() {
				Ti.API.info('Start to add draft message.');

				function errorCallback(error) {
					finishWithError(testRun, error.message);
				}

				function successCallback() {
					Ti.API.info('Draft message added successfully.');

					function allMessagesFound(messages) {
						Ti.API.info('Test if new message properties are the same.');

						valueOf(testRun, messages.length).shouldBeEqual(1);
						valueOf(testRun, messages[0].toString()).shouldBe('[object TiTizenMessagingMessage]');

						Ti.API.info('messages.length: ' + messages.length);
						Ti.API.info('message.id: ' + message.id + ", messages[0].id: " + messages[0].id);
						Ti.API.info('message.subject: ' + message.subject);
						Ti.API.info('message.plainBody: ' + message.plainBody);

						valueOf(testRun, message.id).shouldBeEqual(messages[0].id);
						valueOf(testRun, message.subject).shouldBeEqual(messages[0].subject);
						valueOf(testRun, message.plainBody).shouldBeEqual(messages[0].plainBody);

						Ti.API.info('Finish test.');

						finish(testRun);
					}

					getMessages(testRun, emailService, MESSAGING_EMAIL, allMessagesFound);
				}

				valueOf(testRun, function() {
					message	= Ti.Tizen.Messaging.createMessage({
						type: MESSAGING_EMAIL,
						messageInitDict: {
							subject: 'draft email message', 
							plainBody: 'Tizen draft email message.',
							to: recipientsList
						}
					});
				}).shouldNotThrowException();
				valueOf(testRun, message.toString()).shouldBe('[object TiTizenMessagingMessage]');
				valueOf(testRun, message).shouldNotBeNull();
				valueOf(testRun, message).shouldBeObject();
				valueOf(testRun, emailService.messageStorage.addDraftMessage).shouldBeFunction();
				valueOf(testRun, function() { emailService.messageStorage.addDraftMessage(message, successCallback, errorCallback); }).shouldNotThrowException();
			}

			removeAllMessages(testRun, emailService, MESSAGING_EMAIL, allMessagesRemoved);
		}

		getServices(testRun, MESSAGING_EMAIL, testAddDraftMessage);
	}

	// Remove all messages from messageStorage to setup test.
	// Add new message; check if there is one message in inbox.
	// Remove message; check if there are no messages in inbox.
	this.removeMessages = function(testRun) {
		function testRemoveMessages(services) {
			var emailService = services[0],
				messageStorage = emailService.messageStorage,
				message,
				recipientsList = [TEST_EMAIL];

			Ti.API.info('Start testRemoveMessages test.');

			function errorCallback(error) {
				finishWithError('The following error occurred: ' +  error.message);
			}

			function messagesRemoved() {
				Ti.API.info('Messages removed.');
			}

			// Remove all available messages
			valueOf(testRun, function() { removeAllMessages(testRun, emailService, MESSAGING_EMAIL, messagesRemoved); }).shouldNotThrowException();

			// Send new message and check if it really sent.
			setTimeout(function() {
				function messageSent() {
					var attributeFilter = Ti.Tizen.createAttributeFilter({
						attributeName: 'type',
						matchFlag: 'EXACTLY',
						matchValue: MESSAGING_EMAIL
					});

					function isMessageSent(messages) {
						Ti.API.info(messages.length + ' sent message(s) found.');

						valueOf(testRun, messages.length).shouldBeEqual(1);

						function newMessageRemoved() {
							Ti.API.info('New messages removed.'); 

							function successCallBack(newMessages) {
								Ti.API.info(newMessages.length + ' message(s) found.');
								
								valueOf(testRun, newMessages.length).shouldBeEqual(0);

								finish(testRun);
							}
							
							setTimeout(function() {
								valueOf(testRun, function() {
									messageStorage.findMessages(attributeFilter, successCallBack, errorCallback); 
								}).shouldNotThrowException();
							}, 1000);
						}

						valueOf(testRun, function() { removeAllMessages(testRun, emailService, MESSAGING_EMAIL, newMessageRemoved); }).shouldNotThrowException();
					}
					
					valueOf(testRun, attributeFilter).shouldBe('[object TiTizenAttributeFilter]');
					valueOf(testRun, messageStorage.findMessages).shouldBeFunction();
					valueOf(testRun, function() { messageStorage.findMessages(attributeFilter, isMessageSent, errorCallback); }).shouldNotThrowException();
				}
				
				valueOf(testRun, function() {
					message	= Ti.Tizen.Messaging.createMessage({
						type: MESSAGING_EMAIL,
						messageInitDict: {
							subject: 'new email subject', 
							plainBody: 'plain_body text for messageBody',
							htmlBody: 'html_body text',
							to: recipientsList
						}
					});
				}).shouldNotThrowException();
				valueOf(testRun, message).shouldBe('[object TiTizenMessagingMessage]');
				valueOf(testRun, emailService.sendMessage).shouldBeFunction();
				valueOf(testRun, function() { emailService.sendMessage(message, messageSent, errorCallback); }).shouldNotThrowException();
			}, 2000);
		}
		
		valueOf(testRun, function() { getServices(testRun, MESSAGING_EMAIL, testRemoveMessages); }).shouldNotThrowException();
	}

	// Remove all sms
	// Send new sms
	// Check if it exists in 'sent'.
	this.sendSMS = function(testRun) {
		function testSendSMS(services) {
			var SMSService = services[0],
				message,
				recipientsList = ['+00000000001', '+111111111112'];

			Ti.API.info('Start testSendSMS test.')

			function errorCallback(error) {
				finishWithError('The following error occurred: ' +  error.message);
			}

			function smsRemoved(messages) {
				Ti.API.info('All SMS has been removed.');

				function messagesCB(sms) {
					Ti.API.info(sms.length + ' sms found.');

					function messageSent() {
						Ti.API.info('SMS sent.');

						function successCallBack(sms) {
							Ti.API.info(sms.length + ' sms found.');

							valueOf(testRun, sms.length).shouldBeEqual(2);

							finish(testRun);
						}

						valueOf(testRun, function() { getMessages(testRun, SMSService, MESSAGING_SMS, successCallBack); }).shouldNotThrowException();
					}
					
					valueOf(testRun, sms.length).shouldBeEqual(0);
					valueOf(testRun, function() {
						message	= Ti.Tizen.Messaging.createMessage({
							type: MESSAGING_SMS,
							messageInitDict: {
								plainBody: 'SMS message body text.',
								to: recipientsList
							}
						});
					}).shouldNotThrowException();
					valueOf(testRun, message).shouldBe('[object TiTizenMessagingMessage]');
					valueOf(testRun, SMSService.sendMessage).shouldBeFunction();
					valueOf(testRun, function() { SMSService.sendMessage(message, messageSent, errorCallback); }).shouldNotThrowException();
				}

				valueOf(testRun, function() { getMessages(testRun, SMSService, MESSAGING_SMS, messagesCB); }).shouldNotThrowException();
			}

			// Remove all sms before test
			removeAllMessages(testRun, SMSService, MESSAGING_SMS, smsRemoved);
		}
 
		getServices(testRun, MESSAGING_SMS, testSendSMS);
	}

	// Test if finding folders of the test email account returns realistic results
	this.findFolders = function(testRun) {
		function testFindFolders(services) {
			var emailService = services[0],
				filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'serviceId',
					matchFlag: 'EXACTLY',
					matchValue: emailService.id
				});

			function foldersFound(folders) {
				Ti.API.info('Start to test properties of found folders.');

				for (var i = 0, len = folders.length; i < len; i++) {
					Ti.API.info('Folder ' + folders[i].name + ' found. Check properties.');

					valueOf(testRun, folders[i]).shouldBe('[object TiTizenMessagingMessageFolder]');
					valueOf(testRun, folders[i].contentType).shouldBeString();
					valueOf(testRun, folders[i].path).shouldBeString();
					valueOf(testRun, folders[i].id).shouldBeNumber();
					valueOf(testRun, folders[i].name).shouldBeString();
					valueOf(testRun, folders[i].type).shouldBeString();

					Ti.API.info(folders[i].name + ' properties had been checked.');
				}

				Ti.API.info('All folders has been checked. Finish.');

				finish(testRun);
			}			

			valueOf(testRun, filter).shouldBe('[object TiTizenAttributeFilter]');

			getFolders(testRun, emailService, filter, foldersFound);
		}

		getServices(testRun, MESSAGING_EMAIL, testFindFolders);		
	}

	// Test if folder syncing works without errors. (The synced information is not verified.)
	// Fails, see https://bugs.tizen.org/jira/browse/TDIST-165
	this.syncFolders = function(testRun) {
		function testSyncFolders(services) {
			Ti.API.info('Start test sync folders.');

			var emailService = services[0],
				filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'serviceId',
					matchFlag: 'EXACTLY',
					matchValue: emailService.id
				}),
				syncedFoldersCount = 0;

			function foldersFound(folders) {
				Ti.API.info('Start to sync folders.');

				function errorCallback(error) {
					finishWithError('The following error occurred: ' +  error.message);
				}

				function folderSynced() {
					Ti.API.info('Folder ' + folders[syncedFoldersCount].name + ' syccesfully synced.');

					++syncedFoldersCount;
				}

				valueOf(testRun, emailService.syncFolder).shouldBeFunction();

				for (var i = 0, len = folders.length; i < len; i++) {
					Ti.API.info('Start to sync ' + folders[i].name + ' folder.');

					valueOf(testRun, function() { emailService.syncFolder(folders[i], folderSynced, errorCallback, 30); }).shouldNotThrowException();
				}

				setTimeout(function() {
					Ti.API.info('Finish syncFolders test.');

					valueOf(testRun, syncedFoldersCount).shouldBeEqual(folders.length);

					finish(testRun);
				}, 6000);
			}

			valueOf(testRun, filter).shouldBe('[object TiTizenAttributeFilter]');

			getFolders(testRun, emailService, filter, foldersFound);
		}

		getServices(testRun, MESSAGING_EMAIL, testSyncFolders);
	}
	
	// Create message
	// Add attachments to message
	// Send message
	// Load message attachments
	// Fails, because Tizen currently does not support attachments.
	this.messageAttach = function(testRun) {
		function testMessageAttach(services) {
			var emailService = services[0];

			function errorCallback(error) {
				finishWithError('The following error occurred: ' +  error.message);
			}

			function messagesRemoved() {
				Ti.API.info('All messages has been removed.');

				var message,
					watchId,					
					recipientsList = [TEST_EMAIL],
					messageChangeCallback = {
						messagesupdated: function(messages) {
							Ti.API.info('Update event listener invoked.');

							valueOf(testRun, messages.length).shouldBeGreaterThan(0);
							valueOf(testRun, watchId).shouldNotBeNull();
							messageStorage.removeChangeListener(watchId);

							Ti.API.info('Update event listener removed.')
						},
						messagesadded: function(messages) {
							Ti.API.info('Add event listener invoked.');

							valueOf(testRun, messages.length).shouldBeGreaterThan(0);
						},
						messagesremoved: function(messages) {
							Ti.API.info('Remove event listener invoked.');

							valueOf(testRun, messages.length).shouldBeGreaterThan(0);
						}
					};

				function messageSent(recipients, message) {
					Ti.API.info('Message sent with attachment.');

					function serviceSynced() {
						Ti.API.info('Service synced.');

						function messagesFoundCB(messages) {
							Ti.API.info(messages.length + ' message(s) found.');
							finish(testRun);

							function attachmentLoaded(attachment) {
								Ti.API.info('Attachment loaded.');

								valueOf(testRun, attachment.id).shouldBeObject();
								valueOf(testRun, attachment.id).shouldNotBeNull();
								valueOf(testRun, attachment.filePath).shouldBeObject();
								valueOf(testRun, attachment.filePath).shouldNotBeNull();

								finish(testRun);
							}

							for (var i = 0, len = messages.length; i < len; i++) {				    		
								valueOf(testRun, messages[i]).shouldBeObject();
								valueOf(testRun, !!messages[i].attachments[0].loaded).shouldBeBoolean();

								if (!messages[i].attachments[0].loaded) {
									valueOf(testRun, function() { emailService.loadMessageAttachment(messages[i].attachments[0], attachmentLoaded, errorCallback); }).shouldNotThrowException();
								}
							}

							setTimeout(function() {
								Ti.API.info('Finish attachments test.');

								finish(testRun);
							}, 5000);
						};

						var filter = Ti.Tizen.createAttributeFilter({
							attributeName: 'type',
							matchFlag: 'EXACTLY',
							matchValue: MESSAGING_EMAIL
						});

						valueOf(testRun, filter).shouldBe('[object TiTizenAttributeFilter]');
						valueOf(testRun, function() { emailService.messageStorage.findMessages(filter, messagesFoundCB, errorCallback); }).shouldNotThrowException();
					}

					valueOf(testRun, emailService.sync).shouldBeFunction();
					valueOf(testRun, function() { emailService.sync(serviceSynced, errorCallback, 30); }).shouldNotThrowException();
				}

				Ti.API.info('Start to add message listener.');

				valueOf(testRun, emailService.messageStorage.addMessagesChangeListener).shouldBeFunction();
				
				// Add messages listener: doesn't work on Anvil but work in Tizen IDE
				valueOf(testRun, function() { watchId = emailService.messageStorage.addMessagesChangeListener(messageChangeCallback); }).shouldNotThrowException();
				valueOf(testRun, watchId).shouldNotBeUndefined();
				valueOf(testRun, watchId).shouldBeNumber();

				setTimeout(function() {
					valueOf(testRun, function() {
						message	= Ti.Tizen.Messaging.createMessage({
							type: MESSAGING_EMAIL,
							messageInitDict: {
								subject: 'email subject', 
								plainBody: 'plain_body text',
								htmlBody: 'html_body text',
								to: recipientsList
							}
						});
					}).shouldNotThrowException();
					valueOf(testRun, message).shouldBe('[object TiTizenMessagingMessage]');

					valueOf(testRun, function() { 
						message.attachments = [
							Ti.Tizen.Messaging.createMessageAttachment({
								filePath: 'suites/tizen/images/img1_for_anvil.png',
								mimeType: 'image/png'
							})
						];
					}).shouldNotThrowException();
					valueOf(testRun, message).shouldBe('[object TiTizenMessagingMessageAttachment]');
					
					Ti.API.info('Start to send message');

					valueOf(testRun, emailService.sendMessage).shouldBeFunction();
					valueOf(testRun, function() { emailService.sendMessage(message, messageSent, errorCallback); }).shouldNotThrowException();
				}, 5000);
			}

			// Remove all available messages
			valueOf(testRun, function() { removeAllMessages(testRun, emailService, MESSAGING_EMAIL, messagesRemoved); }).shouldNotThrowException();
		}

		getServices(testRun, MESSAGING_EMAIL, testMessageAttach);
	}

	// Remove all messages;
	// Send new message;
	// Update all messages in messageStorage (by mnarking them as read);
	// Verify they really became read.
	this.updateMessages = function(testRun) {
		function testUpdateMessages(services) {
			Ti.API.info('Start updateMessages test.');

			var emailService = services[0],
				messageStorage = emailService.messageStorage,
				watchId,
				recipientsList = [TEST_EMAIL],
				message;
 
			function errorCallback(error) {
				finishWithError(testRun, 'The following error occurred: ' +  error.message);
			}

			// Define the success callback.
			function messageSent(recipients) {
				Ti.API.info('Inbox folder synced.');

				var filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'type',
					matchFlag: 'EXACTLY',
					matchValue: MESSAGING_EMAIL
				});
				
				// Define the update message success callback
				function successCallback() {
					Ti.API.info('All messages has been updated.');

					function updatedMessageFound(updatedMessages) {
						Ti.API.info(updatedMessages.length + ' updated message(s) found.');

						for (var i = 0; i < updatedMessages.length; i++) {
							Ti.API.info('updatedMessages[' + i + '].id: ' + updatedMessages[i].id + ', isRead: ' + updatedMessages[i].isRead);

							valueOf(testRun, updatedMessages[i]).shouldBe('[object TiTizenMessagingMessage]');
							valueOf(testRun, updatedMessages[i].id).shouldNotBeNull();
							valueOf(testRun, updatedMessages[i].isRead).shouldBeTrue();
						}

						finish(testRun);
					}

					valueOf(testRun, function() { messageStorage.findMessages(filter, updatedMessageFound, errorCallback); }).shouldNotThrowException();
				}

				// Define the error callback
				function messageArrayCB(messages) {
					Ti.API.info(messages.length + ' message(s) found.');

					valueOf(testRun, messages).shouldBeObject();
					valueOf(testRun, messages.length).shouldBeGreaterThan(0);

					for (var i = 0, len = messages.length; i < len; i++) {
						valueOf(testRun, messages[i]).shouldBe('[object TiTizenMessagingMessage]');

						messages[i].isRead = true;
					}

					Ti.API.info('Start to update ' + len + ' messages.');

					valueOf(testRun, function() { messageStorage.updateMessages(messages, successCallback, errorCallback); }).shouldNotThrowException();
				}
				
				valueOf(testRun, filter).shouldBe('[object TiTizenAttributeFilter]');
				valueOf(testRun, messageStorage.findMessages).shouldBeFunction();
				valueOf(testRun, function() { messageStorage.findMessages(filter, messageArrayCB, errorCallback); }).shouldNotThrowException();
			}

			valueOf(testRun, function() {
				message	= Ti.Tizen.Messaging.createMessage({
					type: MESSAGING_EMAIL,
					messageInitDict: {
						subject: 'new email subject', 
						plainBody: 'plain_body text for messageBody',
						htmlBody: 'html_body text',
						to: recipientsList
					}
				});
			}).shouldNotThrowException();
			valueOf(testRun, message).shouldBe('[object TiTizenMessagingMessage]');
			valueOf(testRun, message).shouldBeObject();
			valueOf(testRun, function() { emailService.sendMessage(message, messageSent, errorCallback); }).shouldNotThrowException();
		}
		
		valueOf(testRun, function() { getServices(testRun, MESSAGING_EMAIL, testUpdateMessages); }).shouldNotThrowException();
	}

	// Remove all conversation
	// Add new conversation
	// Check if conversation added
	this.conversations = function(testRun) {
		function testConversations(services) {
			Ti.API.info('Start testConversations test.')

			var emailService = services[0];
				messageStorage = emailService.messageStorage,
				attributeFilter = Ti.Tizen.createAttributeFilter({
					attributeName: 'from',
					matchFlag: 'CONTAINS',
					matchValue: TEST_EMAIL
				});

			function errorCallback(error) {
				finishWithError('The following error occurred: ' +  error.message);
			}

			function conversationsFound(conversations) {
				Ti.API.info(conversations.length + ' conversation(s) found.');

				function removeConversationsSuccess() { 
					Ti.API.info(conversations.length + ' conversation(s) has been removed.'); 
				}

				if (conversations.length > 0) {
					valueOf(testRun, function() { messageStorage.removeConversations(conversations, removeConversationsSuccess, errorCallback); }).shouldNotThrowException();
				}
			}

			valueOf(testRun, attributeFilter).shouldBe('[object TiTizenAttributeFilter]');

			valueOf(testRun, function() { messageStorage.findConversations(attributeFilter, conversationsFound, errorCallback); }).shouldNotThrowException();

			setTimeout(function() {
				function messageSent(recipients, message) {
					Ti.API.info('Message sent.');

					function conversationsFound(conversations) {
						Ti.API.info(conversations.length + ' conversation(s) found.');

						valueOf(testRun, conversations.length).shouldBeEqual(1);
						finish(testRun);
					}

					valueOf(testRun, messageStorage.findConversations).shouldBeFunction();
					valueOf(testRun, function() { messageStorage.findConversations(attributeFilter, conversationsFound, errorCallback); }).shouldNotThrowException();
				}

				valueOf(testRun, function() { sendEmail(testRun, emailService, messageSent); }).shouldNotThrowException();
			}, 3000);
		}

		valueOf(testRun, function() { getServices(testRun, MESSAGING_EMAIL, testConversations); }).shouldNotThrowException();
	}

	// Remove all messages
	// Send new message
	// Try to load message body
	// Check if it the same message
	this.messageBody = function(testRun) {
		function testMessageBody(services) {
			var emailService = services[0],
				messageStorage = emailService.messageStorage,
				messageId;

			Ti.API.info('Start test testMessgeBody.');

			function errorCallback(error) {
				finishWithError('The following error occurred: ' +  error.message);
			}

			function messagesRemoved() {
				Ti.API.info('Messages removed.');
			}

			valueOf(testRun, function() { removeAllMessages(testRun, emailService, MESSAGING_EMAIL, messagesRemoved); }).shouldNotThrowException();

			setTimeout(function() {
				function messageSent(recipients, message) {
					Ti.API.info('Message sent.');

					function messagesFound(messages) {
						Ti.API.info(messages.length + ' message(s) found.');

						function successCallback(messageLoaded) {
							Ti.API.info('Message ' + messageLoaded.id + ' body loaded.');

							valueOf(testRun, messageLoaded.id).shouldBeEqual(message.id);
							valueOf(testRun, messageLoaded.body['plainBody']).shouldBeEqual(message.body['plainBody']);
							valueOf(testRun, messageLoaded.body['messageId']).shouldBeEqual(message.body['messageId']);
							valueOf(testRun, messageLoaded.body['htmlBody']).shouldBeEqual(message.body['htmlBody']);

							Ti.API.info('Finish test messageBody.');

							finish(testRun);
						}

						valueOf(testRun, messages[0]).shouldBeObject();
						valueOf(testRun, messages[0]).shouldBe('[object TiTizenMessagingMessage]');
						valueOf(testRun, messages[0].body).shouldBe('[object TiTizenMessagingMessageBody]');
						valueOf(testRun, !!messages[0].body.loaded).shouldBeBoolean();

						if (!messages[0].body.loaded) {
							valueOf(testRun, messageId).shouldBeString();
							valueOf(testRun, function() { emailService.loadMessageBody(messages[0], successCallback, errorCallback); }).shouldNotThrowException();
						} else if (messages[0].body.loaded) {
							valueOf(testRun, messages[0].body['loaded']).shouldBeTrue();
							valueOf(testRun, messages[0].id).shouldBeEqual(message.id);
							valueOf(testRun, messages[0].body['plainBody']).shouldBeEqual(message.body['plainBody']);
							valueOf(testRun, messages[0].body['messageId']).shouldBeEqual(message.body['messageId']);
							valueOf(testRun, messages[0].body['htmlBody']).shouldBeEqual(message.body['htmlBody']);

							finish(testRun);
						}
					}

					valueOf(testRun, function() { getMessages(testRun, emailService, MESSAGING_EMAIL, messagesFound); }).shouldNotThrowException();
				}

				valueOf(testRun, function() { sendEmail(testRun, emailService, messageSent) }).shouldNotThrowException();
			}, 2000);
		}

		valueOf(testRun, function() { getServices(testRun, MESSAGING_EMAIL, testMessageBody); }).shouldNotThrowException();
	}
}
