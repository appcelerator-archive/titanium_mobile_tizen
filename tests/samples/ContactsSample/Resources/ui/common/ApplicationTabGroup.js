function ApplicationTabGroup(Window, AddContactWnd, SearchContactWnd) {
	//create module instance
	var self = Ti.UI.createTabGroup();
	
	//create app tabs
	var win1 = new Window(L('Contacts Sample - All contacts'));
		win2 = new AddContactWnd(L('Contacts Sample - Add contact'));
		win3 = new SearchContactWnd(L('Contacts sample - Search contacts'));
	
	var tab1 = Ti.UI.createTab({
		title: L('Contacts list'),
		//icon: '/images/KS_nav_ui.png',
		window: win1
	});
	win1.containingTab = tab1;
	
	 var tab2 = Ti.UI.createTab({
		 title: L('Add contact'),
		// icon: '/images/KS_nav_views.png',
		 window: win2
	 });
	 win2.containingTab = tab2;
	 
	 var tab3 = Ti.UI.createTab({
		 title: L('Search contact'),
		// icon: '/images/KS_nav_views.png',
		 window: win3
	 });
	 win2.containingTab = tab3;	 
	
	self.addTab(tab1);
	self.addTab(tab2);
	self.addTab(tab3);
	
	Ti.UI.currentTabGroup = self;
	
	return self;
};

module.exports = ApplicationTabGroup;
