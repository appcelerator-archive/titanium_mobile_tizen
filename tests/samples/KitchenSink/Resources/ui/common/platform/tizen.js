function tizen(_args) {
	var self = Titanium.UI.createWindow(),
		data = [
			{title: 'Contacts', hasChild: true, test: 'ui/common/platform/tizen_contacts'}
		],
		tableview = Ti.UI.createTableView({
			data: data
		});
	
	tableview.addEventListener('click', function(e){
		if (e.rowData.test) {
			var ContactsWindow = require(e.rowData.test),
				win = new ContactsWindow();
			_args.containingTab.open(win, {animated: true});
		}
	});
	
	self.add(tableview);
	
	return self;
};

module.exports = tizen;
