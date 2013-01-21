function tizen(_args) {
	var self = Titanium.UI.createWindow(),
		data = [
			{title: 'Contacts', hasChild: true, test: 'ui/handheld/tizen/platform/contacts'},
			{title: 'Call', hasChild: true, test: 'ui/handheld/tizen/platform/call/call'},
			{title: 'Geocoder', hasChild: true, test: 'ui/handheld/tizen/platform/geocoder'},		
			{title: 'Application', hasChild: true, test: 'ui/common/platform/tizen_application'},
			{title: 'Filesystem', hasChild: true, test: 'ui/common/platform/tizen_filesystem'},
			{title: 'Download demo', hasChild: true, test: 'ui/handheld/tizen/platform/tizenDownload'},		
			{title: 'System info and Power', hasChild: true, test: 'ui/handheld/tizen/platform/tizenSystemInfo'},
			{title: 'Application', hasChild: true, test: 'ui/common/platform/tizen_application'}

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
