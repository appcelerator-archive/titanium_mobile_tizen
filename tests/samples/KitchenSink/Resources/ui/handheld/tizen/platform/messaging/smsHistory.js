function smsHistory(args) {
	var win = Ti.UI.createWindow({
			title: "sms history"
		}),
		serviceType = "messaging.sms";
		
	function serviceListCB(services) {
		Ti.API.info(services.length + " service(s) found.");
		
		// SuccessCallback funciton for findMessages
		function messagesListCB(messagesList) {
			var tableView = Ti.UI.createTableView({
					headerTitle: 'Click to delete.',
					rowHeight: 25
				}),
				messages = messagesList,
				emptyHistoryLbl = Ti.UI.createLabel({
					text: "History is empty. Add some messages first.",
					top: 25,
					left: 5
				}),
				INBOX = 1, 
				OUTBOX = 2, 
				DRAFTS = 3, 
				SENTBOX = 4;
			
			Ti.API.info(messagesList.length + " message(s) found.");
			
			function removeMessage(item) {
				Ti.API.info("Start to remove sms.");
				
				// Success callback function for removeMessages
				function messagesRemovedCB() {
					Ti.API.info("Message successfully removed.");
					
					// delete message from tableview (from list)
					tableView.deleteRow(item.index);
					messages.splice(item.index, 1);
					
					if (messages.length == 0) {
						win.remove(tableView);
						win.add(emptyHistoryLbl);
					}
				}
				
				if (item.rowData.title) {
					// Remove array of messages
					try {
						smsService.messageStorage.removeMessages([messages[item.index]], messagesRemovedCB, errorCB);
					} catch (exc) {
						Ti.API.info("Exception has been thrown.");
						
						errorCB(exc);
					}
				}
			}
			
			if (messages.length > 0) {
				var box = ["INBOX", "OUTBOX", "DRAFTS", "SENTBOX"];
				
				win.add(tableView);
				tableView.addEventListener("click", removeMessage);
				
				for (var i = 0; i < messages.length; i++) {
					var row = Ti.UI.createTableViewRow(),
						inFolder = "In " + box[messages[i].folderId - 1];
					
					if (messages[i].folderId == INBOX) {
						row.title = messages[i].from + "  (" + inFolder + ")";
					} else {
						row.title = messages[i].to[0] + "  (" + inFolder + ")";
					}
					
					// Add message to tableview 
					tableView.appendRow(row);
				}
			} else {
				win.add(emptyHistoryLbl);
			}
		}
		
		if (services.length > 0) {
			var smsService = services[0];
			
			// Search for messages by filter
			smsService.messageStorage.findMessages(new tizen.AttributeFilter("type", "EXACTLY", serviceType), messagesListCB, errorCB);
		} else {
			Ti.API.info("Exception has been thrown.");

			errorCB({message: "Services list is empty."});
		}
	}
	
	// Callback function for errors
	function errorCB(error) {
		Ti.API.info("The following error occurred: " + error.message);
		Ti.UI.createAlertDialog({
		    message: error.message,
		    title: "The following error occurred: ",
		    ok: "Ok"
		}).show();
	}

	tizen.messaging.getMessageServices(serviceType, serviceListCB, errorCB);
	
	return win;
}

module.exports = smsHistory;