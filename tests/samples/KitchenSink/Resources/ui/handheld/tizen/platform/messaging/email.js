function email(args) {
	var self = Ti.UI.createWindow({
			title: "Messaging: email"
		}),
		tableview = Ti.UI.createTableView({
			data: [
			    {title: 'Send', hasChild: true, test: 'ui/handheld/tizen/platform/messaging/emailSend'},
				{title: 'Folder list', hasChild: true, test: 'ui/handheld/tizen/platform/messaging/emailFolders'},
			]
		});
	
	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({title: e.rowData.title, containingTab: args.containingTab});
			
			args.containingTab.open(win);
		}
	});
	
	self.add(tableview);
	
	return self;
}

module.exports = email;