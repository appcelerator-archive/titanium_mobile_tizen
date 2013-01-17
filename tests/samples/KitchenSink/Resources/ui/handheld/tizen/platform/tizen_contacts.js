function tizen_contacts(_args) {
	var self = Ti.UI.createWindow(),
		data = [
			{title: 'Add contact', test: 'ui/handheld/tizen/platform/tizen_contacts_add'}
		],
		tableview = Ti.UI.createTableView({data: data});
	
	tableview.addEventListener('click', function(e){
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow();
			_args.containingTab.open(win, {animated: true});
		}
	});
	
	
	self.add(tableview);
	
	return self;
}
module.exports = tizen_contacts;
