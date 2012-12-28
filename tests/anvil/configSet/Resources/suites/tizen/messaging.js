/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */


module.exports = new function() {
	var finish;
	var valueOf;
	var reportError;


	this.name = "messaging";
	this.tests = [
		{name: "get_services"},
		{name: "send_message"},
		{name: "message_body"},
		{name: "update_messages"},
		{name: "remove_messages"},
		{name: "conversations"},
		{name: "find_folders"},
		{name: "add_draft_message"},
		{name: "sync_folders"},
		{name: "message_attach"}
	];


	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	};


	// Get message services that are available on emulator
	this.get_services = function(testRun) {
		var messaging = null;

	 	// Define the error callback
	    function errorCallback(error) {
	        reportError(testRun, 'The following error occurred: ' +  error.message);

	        finish(testRun);
	    }

	    // Define the success callback
	    function serviceListCB(services) {
	    	valueOf(testRun, services).shouldNotBeNull();

	    	if (services.length == 0) {
				reportError(testRun, 'You must add message service.');

				finish(testRun);
	    	} else {
	    		valueOf(testRun, services.length).shouldBeGreaterThan();

				for (var i in services) {
					valueOf(testRun, services[i].id).shouldBeString();
					valueOf(testRun, services[i].name).shouldNotBe('');
					valueOf(testRun, services[i].name).shouldBeString();
					valueOf(testRun, services[i].type).shouldBe('messaging.email');
					valueOf(testRun, services[i].messageStorage).shouldBeObject();
		        }
	    	}

			finish(testRun);
	    }

	    messaging = tizen.messaging;

		valueOf(testRun, messaging).shouldNotBeNull();
		valueOf(testRun, messaging).shouldBeObject();	    
		valueOf(testRun, function() { messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();
	}


	// Send message
	this.send_message = function(testRun) {
		var messaging = null;

		// Define the message sending success callback
	    function messageSent(recipients) {
	        valueOf(testRun, recipients).shouldBeObject();

	        finish(testRun);
	    }

	    // Define the error callback. 
	    function messageFailed(error) { 
	        reportError(testRun, 'The following error occurred: ' +  error.message);

	        finish(testRun);
	    }

	    // Define the service success callback
	    function serviceListCB(services) {
			if (services.length == 0) {
				reportError(testRun, 'You must add some message service.');

				finish(testRun);
	    	} else {
		    	var msg = new tizen.Message("messaging.sms", {plainBody: "I will arrive in 10 minutes.", to: ["+34666666666", "+34888888888"]}); // Example of sending an SMS message

				valueOf(testRun, services[0]).shouldBeObject();
				valueOf(testRun, msg).shouldBeObject();
		    	valueOf(testRun, msg.attachments).shouldBeUndefined();
		    	valueOf(testRun, msg.type).shouldBeString();
				valueOf(testRun, msg.timestamp).shouldBeObject();
		    	valueOf(testRun, function() { services[0].sendMessage(msg, messageSent, messageFailed); }).shouldNotThrowException(); // Attempts to send the specified message.	
	    	}
	    }

	    messaging = tizen.messaging;

	    valueOf(testRun, messaging).shouldBeObject();
	    valueOf(testRun, messaging).shouldNotBeNull();
	    valueOf(testRun, function() { messaging.getMessageServices("messaging.sms", serviceListCB); }).shouldNotThrowException();
	}


	// Test messages body and sync
	this.message_body = function(testRun) {
	    var Service = null,
			emailFilter = null,
			messageId = null;

		// Define the error callback
		function errorCallback(error) {
			reportError(testRun, 'The following error occurred: ' +  error.message);
		
		    finish(testRun);
		}
		
		function messageSent(recipients) {
			filter = new tizen.AttributeFilter("serviceId", "EXACTLY", Service.id);
	        
	        valueOf(testRun, filter).shouldBeObject();
			valueOf(testRun, filter).shouldNotBeNull();
			valueOf(testRun, function() { Service.messageStorage.findFolders(filter, folderQueryCallback, errorCallback); }).shouldNotThrowException();
		}
		
	    function folderQueryCallback(folders) {
	    	valueOf(testRun, folders).shouldNotBeNull();
	    	valueOf(testRun, folders[0]).shouldNotBeNull();
	    	valueOf(testRun, folders).shouldBeObject();
	    	valueOf(testRun, folders[0]).shouldBeObject();	    	
	    	valueOf(testRun, function() { Service.syncFolder(folders[0], folderSynced, errorCallback, 30); }).shouldNotThrowException();
	    }
		
	    function folderSynced() {
			emailFilter = new tizen.AttributeFilter("type", "EXACTLY", "messaging.email");
			
			valueOf(testRun, emailFilter).shouldBeObject();
			valueOf(testRun, emailFilter).shouldNotBeNull();
			valueOf(testRun, function() { Service.messageStorage.findMessages(emailFilter, messageQueryCallback, errorCallback); }).shouldNotThrowException();
	    }
	    
		// Define the success callback for services list
		function serviceListCB(services) {
			if (services.length == 0) {
				reportError(testRun, 'Services not found!');

				finish(testRun);
			} else {
				Service = services[0];
		
				var msg = new tizen.Message("messaging.email");
				msg.to = ["jz21fk@gmail.com"];
				msg.subject = "some message subject";
		        msg.body.htmlBody = "this is image -> ...<img src='images/myimage.png'>...";
				
				valueOf(testRun, Service).shouldBeObject();
				valueOf(testRun, Service).shouldNotBeNull();		        
				valueOf(testRun, msg).shouldBeObject();
				valueOf(testRun, msg).shouldNotBeNull();
		        valueOf(testRun, function() { Service.sendMessage(msg, messageSent, errorCallback); }).shouldNotThrowException();
			}
		}  
				
		// Define the success callback
		function successCallback(message) {
			if (messageId == message.id) {
				finish(testRun);
			}
		}
		
		// Define the success callback for find message
		function messageQueryCallback(messages) {
			var message = null;
		
			if (messages.length == 0) {
				reportError(testRun, 'Messages not found!');

				finish(testRun);
			} else if(messages.length > 0) {
				for (var i = 0; i < messages.length; i++) {
					message = messages[i];
					messageId = message.id;
					
					valueOf(testRun, message).shouldBeObject();
					valueOf(testRun, messageId).shouldBeString();
					valueOf(testRun, !!message.body.loaded).shouldBeBoolean();

		   			if (!message.body.loaded) {
		   				valueOf(testRun, function() { Service.loadMessageBody(message, successCallback, errorCallback); }).shouldNotThrowException();
		   			}
				}
			}
		};
		
		valueOf(testRun, function() { tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();
	}


	// update messages
	this.update_messages = function(testRun) {
	    var emailService = null,
	    	messageStorage = null,
        	messageChangeCallback = {
		       	messagesupdated: function(messages) {
		        	valueOf(testRun, messages.length).shouldBeGreaterThan(0);
		       	},
		       	messagesadded: function(messages) {
		        	valueOf(testRun, messages.length).shouldBeGreaterThan(0);
		        },
		    	messagesremoved: function(messages) {
		        	valueOf(testRun, messages.length).shouldBeGreaterThan(0);
		        }
 			};

	    function errorCallback(error) {
			reportError(testRun, 'The following error occurred: ' +  error.message);

			finish(testRun);
	    }

	    function folderQueryCallback(folders) {
	    	valueOf(testRun, folders).shouldNotBeNull();
	    	valueOf(testRun, folders[0]).shouldNotBeNull();
	    	valueOf(testRun, folders).shouldBeObject();
	    	valueOf(testRun, folders[0]).shouldBeObject();	    	
	    	valueOf(testRun, function() { emailService.syncFolder(folders[0], folderSynced, errorCallback, 30); }).shouldNotThrowException();
	    }
		
	    function folderSynced() {
			var eFilter = new tizen.AttributeFilter("type", "EXACTLY", "messaging.email");
			
	    	// Define the update message success callback
			function successCallback() {
			    finish(testRun);
			}

			// Define the error callback
			function messageArrayCB(messages) {
				valueOf(testRun, messages).shouldBeObject();
				valueOf(testRun, messages.length).shouldBeGreaterThan(0);

				for (var i in messages) {
					messages[i].isRead = true;
				}			

			    valueOf(testRun, function() { messageStorage.updateMessages(messages, successCallback, errorCallback); }).shouldNotThrowException();
			}
			
			valueOf(testRun, eFilter).shouldBeObject();
	    	valueOf(testRun, function() { messageStorage.findMessages(eFilter, messageArrayCB, errorCallback); }).shouldNotThrowException();
	    }

	    // Define the success callback.
	    function messageSent(recipients) {
	  		filter = new tizen.AttributeFilter("serviceId", "EXACTLY", emailService.id);
	        
	        valueOf(testRun, filter).shouldBeObject();
			valueOf(testRun, filter).shouldNotBeNull();
			valueOf(testRun, function() { messageStorage.findFolders(filter, folderQueryCallback, errorCallback); }).shouldNotThrowException();
	    }
	    
	    // Define the success callback for services list
	    function serviceListCB(services) {	
	    	if (services.length == 0) {
	    		reportError(testRun, 'The following error occurred: Services not found');

	    		finish(testRun);
	    	} else {
	    		var msg = new tizen.Message("messaging.email");

	    		emailService = services[0];
	    		messageStorage = emailService.messageStorage;
	    		msg.to = ["jz21fk@gmail.com"];
	            msg.body.htmlBody = "html body for updateMessages";
	    		
				valueOf(testRun, msg).shouldBeObject();
				valueOf(testRun, emailService).shouldBeObject();
				valueOf(testRun, emailService).shouldNotBeNull();
				valueOf(testRun, function() { messageStorage.addMessagesChangeListener(messageChangeCallback); }).shouldNotThrowException();
				valueOf(testRun, function() { emailService.sendMessage(msg, messageSent, errorCallback); }).shouldNotThrowException();
	    	}
	    }  
	    
	    tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback);
	}


	// delete selected messages
	this.remove_messages = function(testRun) {
	    var emailService = null,
	    	messageStorage = null,
	    	msg = null,
	    	filter = null;
	        
	    function errorCallback(error) {
			reportError('The following error occurred: ' +  error.message);

			finish(testRun);
	    }

	    function successCallback() {
	    	finish(testRun);
	    }
	    	    
	    // Define the success callback for services list
	    function serviceListCB(services) {	
	    	if (services.length == 0) {
	    		reportError('The following error occurred: Services not found');

	    		finish(testRun);
	    	} else {
	    		msg = new tizen.Message("messaging.email");
	    		emailService = services[0];
	    		messageStorage = emailService.messageStorage;
	    		msg.to = ["email@gmail.com"];
	            msg.body.htmlBody = "this is image -> ...<img src='images/myimage.png'>...";
	            filter = new tizen.AttributeFilter("type", "EXACTLY", "messaging.email");
	    		
				function messageArrayCB(messages) {
					valueOf(testRun, messages).shouldBeObject();
					valueOf(testRun, messages.length).shouldBeGreaterThan(0);
		   			valueOf(testRun, function() { messageStorage.removeMessages(messages, successCallback, errorCallback); }).shouldNotThrowException();

		   			finish(testRun);
	          	};

				valueOf(testRun, filter).shouldNotBeNull();
	    		valueOf(testRun, emailService).shouldNotBeNull();
	    		valueOf(testRun, messageStorage).shouldNotBeNull();
	    		valueOf(testRun, msg).shouldNotBeNull();
	    		valueOf(testRun, filter).shouldBeObject();
	    		valueOf(testRun, emailService).shouldBeObject();
	    		valueOf(testRun, messageStorage).shouldBeObject();
	    		valueOf(testRun, msg).shouldBeObject();
	    		valueOf(testRun, function() { emailService.sendMessage(msg, function() {}, errorCallback); }).shouldNotThrowException();
	            valueOf(testRun, function() { messageStorage.findMessages(filter, messageArrayCB, errorCallback); }).shouldNotThrowException();
	    	}
	    }  
	    
	    valueOf(testRun, function() { tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();
	}


	// Find and delete conversations
	this.conversations = function(testRun) {
	    var emailService = null,
	    	messageStorage = null,
	    	watchId = null,
	    	conversationChangeCB = {
       			conversationsupdated: function(conversations) {
         			valueOf(testRun, function() { messageStorage.removeChangeListener(watchId); }).shouldNotThrowException();
         		},
	       		conversationsadded: function(conversations) {
	         		valueOf(testRun, function() { messageStorage.removeChangeListener(watchId); }).shouldNotThrowException();
	         	},
	       		conversationsremoved: function(conversations) {
	         		valueOf(testRun, function() { messageStorage.removeChangeListener(watchId); }).shouldNotThrowException();
	         	}
		};

	        
	    function errorCallback(error) {
			reportError('The following error occurred: ' +  error.message);

			finish(testRun);
	    }

	    // Define the success callback for services list
	    function serviceListCB(services) {
	    	var filter = null;

	    	if (services.length == 0) {
	    		reportError('The following error occurred: Services not found');

	    		finish(testRun);
	    	} else {
	    		emailService = services[0];
	    		messageStorage = emailService.messageStorage;
	            filter = new tizen.AttributeFilter('from', 'CONTAINS', 'jz21fk@gmail.com');

	          	function conversationsArrayCB(conversations) {
	          		valueOf(testRun, conversations).shouldBeObject();
	          		valueOf(testRun, conversations).shouldNotBeNull();

	   			 	if (conversations.length > 0) {
	   			 		valueOf(testRun, conversations.length).shouldBeGreaterThan(0);
						valueOf(testRun, conversations[0].id).shouldBeNumber();
		    			valueOf(testRun, conversations[0].from).shouldBeString();
		    			valueOf(testRun, conversations[0].lastMessageId).shouldBeNumber();
		    			valueOf(testRun, conversations[0].timestamp).shouldBeObject();
		    			valueOf(testRun, conversations[0].type).shouldBeString();
		    			valueOf(testRun, conversations[0].isRead).shouldBeBoolean();

	   			 		valueOf(testRun, function() { messageStorage.removeConversations(conversations, function() {}, errorCallback); }).shouldNotThrowException();
	   			 	}

	   			 	finish(testRun);
	          	};
		   		
		   		valueOf(testRun, filter).shouldBeObject();
		   		valueOf(testRun, filter).shouldNotBeNull();
		   		valueOf(testRun, messageStorage).shouldBeObject();
		   		valueOf(testRun, messageStorage).shouldNotBeNull();
				valueOf(testRun, emailService).shouldBeObject();
		   		valueOf(testRun, emailService).shouldNotBeNull();
		   		valueOf(testRun, function() { watchId = messageStorage.addConversationsChangeListener(conversationChangeCB); }).shouldNotThrowException();
		   		valueOf(testRun, function() { messageStorage.findConversations(filter, conversationsArrayCB, errorCallback); }).shouldNotThrowException();
	    	}
	    }  
	    
	    valueOf(testRun, function() { tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();
	}


	// Return list of folders
	this.find_folders = function(testRun) {
	    function errorCallback(error) {
	    	reportError('The following error occurred: ' +  error.message);

	    	finish(testRun);
	    }
	    
	    // Define the success callback for services list
	    function serviceListCB(services) {
	    	var emailService = null,
	    		messageStorage = null,
				filter = null;

	    	if (services.length == 0) {
	    		reportError('The following error occurred: Services not found.');

	    		finish(testRun);
	    	} else {
	    		emailService = services[0];
	    		messageStorage = emailService.messageStorage;
	            filter = new tizen.AttributeFilter("serviceId", "EXACTLY", emailService.id);

	    		function folderArrayCB(folders) {
	    			valueOf(testRun, folders).shouldNotBeNull();
	    			valueOf(testRun, folders).shouldBeObject();
	    			valueOf(testRun, folders.length).shouldBeGreaterThan(0);

	    			for (var i in folders) {
		    			for (var j in folders[i]) {
		    				valueOf(testRun, folders[i].contentType).shouldBeString();
		    				valueOf(testRun, folders[i].path).shouldBeString();
		    				valueOf(testRun, folders[i].id).shouldBeNumber();
		    				valueOf(testRun, folders[i].name).shouldBeString();
		    				valueOf(testRun, folders[i].type).shouldBeString();
		    			}
	    			}

	    			finish(testRun);
	    		};

	    		valueOf(testRun, emailService).shouldNotBeNull();
	    		valueOf(testRun, emailService).shouldBeObject();
	    		valueOf(testRun, messageStorage).shouldNotBeNull();
	    		valueOf(testRun, messageStorage).shouldBeObject();
	    		valueOf(testRun, filter).shouldNotBeNull();
	    		valueOf(testRun, filter).shouldBeObject();
	    		valueOf(testRun, function() { messageStorage.findFolders(filter, folderArrayCB, errorCallback); }).shouldNotThrowException();
	    	}
	    }
	    
	    valueOf(testRun, function() { tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();
	}


	// Add draft message
	this.add_draft_message = function(testRun) {
	    function errorCallback(error) {
			reportError('The following error occurred: ' +  error.message);

			finish(testRun);
	    }

	    function successCallback() {
	    	finish(testRun);
	    }
    
	    // Define the success callback for services list
	    function serviceListCB(services) {
	    	var msg = null;

	    	valueOf(testRun, services).shouldBeObject();
	    	valueOf(testRun, services).shouldNotBeNull();

	    	if (services.length == 0) {
	    		reportError('The following error occurred: Services not found');

	    		finish(testRun);
	    	} else {            
	    		msg = new tizen.Message("messaging.sms", {plainBody: "Tizen draft SMS message."});

	    		valueOf(testRun, msg).shouldNotBeNull();
	    		valueOf(testRun, msg).shouldBeObject();
	    		valueOf(testRun, function() { services[0].messageStorage.addDraftMessage(msg, successCallback, errorCallback); }).shouldNotThrowException();
	    	}
	    }

	    valueOf(testRun, function() { tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();
	}


	// Sync folders from service
	this.sync_folders = function(testRun) {
		var filter = null, 
			emailService = null;
	    
	    function errorCallback(error) {
			reportError('The following error occurred: ' +  error.message);

			finish(testRun);
	    }

	    // Define the messaging service query success callback
	    function folderQueryCallback(folders) {
	    	valueOf(testRun, folders).shouldNotBeNull();
	    	valueOf(testRun, folders).shouldBeObject();

	        for (var i = 0; i < folders.length; i++) {
	        	valueOf(testRun, function() { emailService.syncFolder(folders[i], function() {}, errorCallback, 30); }).shouldNotThrowException();
	        }
	    }
	    
	    function serviceListCB(services) {
	    	emailService = services[0];

	    	valueOf(testRun, emailService).shouldNotBeNull();
	        valueOf(testRun, emailService).shouldBeObject();

	        if (services.length > 0) {
	            filter = new tizen.AttributeFilter("serviceId", "EXACTLY", emailService.id);

	            valueOf(testRun, services.length).shouldBeGreaterThan(0);
	            valueOf(testRun, filter).shouldNotBeNull();
	            valueOf(testRun, filter).shouldBeObject();
	            valueOf(testRun, function() { emailService.messageStorage.findFolders(filter, folderQueryCallback, errorCallback); }).shouldNotThrowException();
	        }
	    }

		valueOf(testRun, function() { tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();

	    setTimeout(function() {
			finish(testRun);
	    }, 2000)
	}


	// Load message attachments
	this.message_attach = function(testRun) {
	    var emailService = null,
	    	messageStorage = null;
	    	    
	 	// Define the success callback
	    function successCallback(attachment) {
	    	valueOf(testRun, attachment.id).shouldBeObject();
	    	valueOf(testRun, attachment.filePath).shouldBeObject();
	    }

	    function serviceSynced() {
    		valueOf(testRun, function() { messageStorage.findMessages(new tizen.AttributeFilter("type", "EXACTLY", "messaging.email"), messagesFoundCB, errorCallback); }).shouldNotThrowException();
    	}
	    
	    function errorCallback(error) {
			reportError('The following error occurred: ' +  error.message);

			finish(testRun);
	    }
	    
	    function messagesFoundCB(messages) {
	    	var message = null;
	    	
	    	for (var i = 0; i < messages.length; i++) {
	    		message = messages[i];
	    		
	    		valueOf(testRun, message).shouldBeObject();
	    		valueOf(testRun, !!message.attachments[0].loaded).shouldBeBoolean();

	    		if (!message.attachments[0].loaded) {
	    			valueOf(testRun, function() { emailService.loadMessageAttachment(message.attachments[0], successCallback, errorCallback); }).shouldNotThrowException();
	    		}
	    	}
	    };
	    
	    function serviceListCB(services) {
			valueOf(testRun, services).shouldBeObject();
			valueOf(testRun, services.length).shouldBeGreaterThan(0);

	    	if (services.length > 0) {
	        	emailService = services[0]; 
	            messageStorage = emailService.messageStorage;
	            
	            valueOf(testRun, function() { emailService.sync(serviceSynced, errorCallback, 30); }).shouldNotThrowException();
	            valueOf(testRun, emailService).shouldBeObject();
	            valueOf(testRun, messageStorage).shouldBeObject();
	        }
	    }

	    valueOf(testRun, function() { tizen.messaging.getMessageServices("messaging.email", serviceListCB, errorCallback); }).shouldNotThrowException();

	    setTimeout(function() {
	    	finish(testRun);
	    }, 1000);
	}
}