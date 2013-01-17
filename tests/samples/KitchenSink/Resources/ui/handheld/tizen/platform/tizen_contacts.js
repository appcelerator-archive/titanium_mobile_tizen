function tizen_contacts(_args) {
	var self = Ti.UI.createWindow({
		title: _args.title
	}),
		data = [
			{title: 'Add contact', test: 'ui/handheld/tizen/platform/tizen_contacts_add'},
			{title: 'Find contacts',  test: 'ui/handheld/tizen/platform/contacts_find'},
			{title: 'Remove contacts', test: 'ui/handheld/tizen/platform/contact_remove'}
		],
		tableview = Ti.UI.createTableView({data: data});
	tableview.addEventListener('click', function(e){
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({title: e.rowData.title, containingTab: _args.containingTab});
			_args.containingTab.open(win, {animated: true});
		}
	});
	
	
	self.add(tableview);
	
	return self;
}
module.exports = tizen_contacts;
