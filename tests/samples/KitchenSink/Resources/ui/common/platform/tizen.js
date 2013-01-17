function tizen() {
	var win = Titanium.UI.createWindow(),
		data = [
			{title: 'Contacts', hasChild: true, test: 'ui/common/platform/tizen_contacts'}
		],
		tableview = Ti.UI.createTableView({
			data: data
		});
	
	// initialize to all modes
	win.orientationModes = [
		Titanium.UI.PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	]; 
	
	win.add(tableview);
	
	return win;
};

module.exports = tizen;
