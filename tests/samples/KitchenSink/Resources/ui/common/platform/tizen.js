function tizen(_args) {
	var self = Titanium.UI.createWindow(),
		data = [
			{title: 'Contacts', hasChild: true, test: 'ui/handheld/tizen/platform/contacts'},
			{title: 'Call', hasChild: true, test: 'ui/handheld/tizen/platform/call/call'},
			{title: 'Geocoder', hasChild: true, test: 'ui/handheld/tizen/platform/geocoder'},		
			{title: 'Application', hasChild: true, test: 'ui/handheld/tizen/platform/applications/tizen_application'},
			{title: 'Filesystem', hasChild: true, test: 'ui/handheld/tizen/platform/tizen_filesystem'},
			{title: 'Download demo', hasChild: true, test: 'ui/handheld/tizen/platform/tizenDownload'},
			{title: 'System info and Power', hasChild: true, test: 'ui/handheld/tizen/platform/tizenSystemInfo'},
			{title: 'NFC demo', hasChild: true, test: 'ui/handheld/tizen/platform/tizenNFC'},
			{title: 'Messaging', hasChild: true, test: 'ui/handheld/tizen/platform/messaging/messaging'},
			{title: 'Media content', hasChild: true, test: 'ui/handheld/tizen/platform/tizen_media_content'},
			{title: 'Alarm', hasChild: true, test: 'ui/handheld/tizen/platform/alarm'},
			{title: 'Notification', hasChild: true, test: 'ui/handheld/tizen/platform/tizen_notification'},
			{title: 'Calendar', hasChild: true, test: 'ui/handheld/tizen/platform/calendar'}
		],
		tableview = Ti.UI.createTableView({
			data: data
		});
	
	tableview.addEventListener('click', function(e){
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({title: e.rowData.title, containingTab: _args.containingTab});
			_args.containingTab.open(win, {animated: true});
		}
	});
	
	self.add(tableview);
	
	return self;
};

module.exports = tizen;
