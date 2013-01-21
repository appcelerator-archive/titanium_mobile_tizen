function listeners() {
	var win = Ti.UI.createWindow({
			title: "Call history listeners"
		}),
		addListenerBtn = Ti.UI.createButton({
			title: "Add listeners",
			top: 20,
			left: 5
		}),
		removeListenerBtn = Ti.UI.createButton({
			title: "Remove listeners",
			top: 60,
			left: 5
		}),
		tableView = Ti.UI.createTableView({
			headerTitle: 'Call list (make a call)',
			backgroundColor: 'transparent',
			rowBackgroundColor: 'white',
			rowHeight: 20,
			top: 110
		}),
		onListenerCB = {
			onadded: function(newItems) {
				Ti.API.info("New Item added");

				for (var i = 0; i < newItems.length; i++) {
					Ti.API.info(newItems[i].remoteParties[0].remoteParty + ": " + newItems[i].startTime);

					tableView.appendRow({title: newItems[i].remoteParties[0].remoteParty + ": " + newItems[i].startTime});
		        }
			},
		    onchanged: function(changedItems) {
		    	Ti.API.info("Items changed");

		    	for (var i = 0; i < changedItems.length; changedItems++) {
		    		Ti.API.info(changedItems[i].remoteParties[0].remoteParty + ": " + changedItems[i].direction);

		    		tableView.appendRow({title: changedItems[i].remoteParties[0].remoteParty + ": " + changedItems[i].direction});
		    	}
		    }
		};

		addListenerBtn.addEventListener("click", function(e) {
			try {
				// register a call history callback
				var handle = tizen.call.history.addListener(onListenerCB);

				Ti.UI.createAlertDialog({
					ok: "Ok",
					message: "Listener added"
				}).show();
				
				removeListenerBtn.addEventListener("click", function(re) {
					try {
						// unregister a previously registered listener
						tizen.call.history.removeListener(handle);
						win.remove(removeListenerBtn);

						Ti.UI.createAlertDialog({
							ok: "Ok",
							message: "Listener removed"
						}).show();
					} catch (removeExc) {
						Ti.UI.createAlertDialog({
							ok: "Ok",
							title: "The following error occurred: ",
							message: "Exception - code: " + removeExc.name + " message: " + removeExc.message
						}).show();
					}
				});

				win.add(tableView);
				win.add(removeListenerBtn);
			} catch (error) {
				Ti.UI.createAlertDialog({
					ok: "Ok",
					title: "The following error occurred: ",
					message: "Exception - code: " + error.name + " message: " + error.message
				}).show();
				
				Ti.API.info("Exception - code: " + error.name + " message: " + error.message);
			}
		});

	win.add(addListenerBtn);

	return win;
}

module.exports = listeners;