function tizen_alarm() {

	var win = Titanium.UI.createWindow(),
	    label_notification = Titanium.UI.createLabel({
		top: 15,
		text: 'enter message'
	});

	win.add(label_notification);

	var titleInput = Ti.UI.createTextField({
		top: 45,
		left: 10,
		width: '60%',
		height: 30,
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED
	});
	win.add(titleInput);
 
	var postButton = Ti.UI.createButton({
		top: 45,
		left: '70%',
		width: '25%',
		height: 30,
		title: 'post'
	});

	var removeButton = Ti.UI.createButton({
		left: 10,
		width: '60%',
		top: 95,
		title: 'Remove all notifications'
	});

	removeButton.addEventListener('click', function(){
		tizen.notification.removeAll();
	});

	win.add(removeButton);

	postButton.addEventListener('click', createNotification);
	
	function createNotification(){
		
		var appService = new tizen.ApplicationService("http://tizen.org/appcontrol/operation/default", null);

		//create notification`s parameters
		var notificationDict = {
                  content : titleInput.value,
                  vibration : true, 
                  service : appService};

        //create and post notification                 
      	var notification = new tizen.StatusNotification("SIMPLE", 
                  "Simple notification", notificationDict);

        tizen.notification.post(notification);

        titleInput.value = '';
	}

	win.add(postButton);

	return win;
}

module.exports = tizen_alarm;
