function manageHistory() {
	var win = Ti.UI.createWindow({
			title: "All history"
		}),
		emptyHistoryLbl = Ti.UI.createLabel({
			text: "History is empty. Add some call first.",
			top: 25,
			left: 5
		}),
		removeAllHistoryBtn = Ti.UI.createButton({
			title: "Remove all history",
			top: 10,
			left: 5
		}),
		tableView = Ti.UI.createTableView({
			headerTitle: 'Call history list. Click to delete.',
			rowBackgroundColor: 'white',
			rowHeight: 25,
			top: 60
		}),
		delBtn = Ti.UI.createButton({
			title: "d",
			right: 5,
			height: 10,
			width: 10
		}),
		filter = new tizen.AttributeFilter("callType", "EXACTLY", "tizen.tel"),
		sortMode = new tizen.SortMode("startTime", "DESC");


	function onSuccess(results) {
		Ti.API.info("results.length: " + results.length);
		
		if (results.length > 0) {
			function removeRow(item) {
				if (item.rowData.title) {
					Ti.API.info("item.index: " + item.index);
					
					try {
						tizen.call.history.remove(results[item.index]);
						tableView.deleteRow(item.index);
						
						if (tableView.sections[0].rowCount == 0) {
							win.remove(tableView);
							win.remove(removeAllHistoryBtn);
							win.add(emptyHistoryLbl);
						}
					} catch (removeExc) {
						Ti.UI.createAlertDialog({
						    message: removeExc.message,
						    title: "The following error occurred: ",
						    ok: "Ok"
						}).show();
					}					
				}
			}
			
			function removeAll(e) {
				tizen.call.history.removeAll(
					function() {
						Ti.API.info("All history removed.");
						
						win.remove(tableView);
						win.remove(removeAllHistoryBtn);
						win.add(emptyHistoryLbl);
					},
					function(error) {
						Ti.UI.createAlertDialog({
						    message: removeExc.message,
						    title: "The following error occurred: ",
						    ok: "Ok"
						}).show();
					}
				);
			}
			
			tableView.addEventListener("click", removeRow);
			removeAllHistoryBtn.addEventListener('click', removeAll);
						
			for (var i = 0; i < results.length; i++) {
				tableView.appendRow({title: results[i].remoteParties[0].remoteParty + " (" + results[i].direction + ")"});
			}
			
			win.add(tableView);
			win.add(removeAllHistoryBtn);
		} else if (results.length == 0) {
			win.add(emptyHistoryLbl);
		}
    }

    function onError(error) {
    	Ti.UI.createAlertDialog({
    		message: exep.message,
    		title: "The following error occurred: ",
    		ok: "Ok"
		}).show();
    }
	
	tizen.call.history.find(onSuccess, onError, filter, sortMode);
	
	return win;
}

module.exports = manageHistory;