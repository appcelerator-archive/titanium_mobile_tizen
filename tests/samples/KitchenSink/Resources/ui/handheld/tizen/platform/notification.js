function tizen_alarm() {
	var win = Titanium.UI.createWindow(),
	    labelNotification = Titanium.UI.createLabel({
			top: 15,
			text: 'enter message'
		}),
		titleInput = Ti.UI.createTextField({
			top: 45,
			left: 10,
			width: '60%',
			height: 30,
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
		}),
		postButton = Ti.UI.createButton({
			top: 45,
			left: '70%',
			width: '25%',
			height: 30,
			title: 'post'
		}),
		removeButton = Ti.UI.createButton({
			left: 10,
			width: '60%',
			top: 95,
			title: 'Remove all notifications'
		});

	removeButton.addEventListener('click', function() {
		Ti.Tizen.Notification.removeAll();

		Ti.UI.createAlertDialog({
			title: 'Info',
			message: 'All notifications removed successfully'
		}).show();
	});

	postButton.addEventListener('click', createNotification);

	function createNotification() {
		var appControl = Ti.Tizen.Application.createApplicationControl({
			operation: "http://tizen.org/appcontrol/operation/create_content",
			uri: null
		}),
		// Create notification`s parameters
		notificationDict = {
			content: titleInput.value,
			vibration: true, 
			appControl: appControl
		},
		// Create and post notification
		notification = Ti.Tizen.Notification.createStatusNotification({
			statusType: Ti.Tizen.Notification.STATUS_NOTIFICATION_TYPE_SIMPLE,
			title: 'Simple notification',
			notificationInitDict: notificationDict
		});

		Ti.Tizen.Notification.post(notification);
		titleInput.value = '';
	}

	win.add(removeButton);
	win.add(labelNotification);
	win.add(titleInput);
	win.add(postButton);

	return win;
}

module.exports = tizen_alarm;