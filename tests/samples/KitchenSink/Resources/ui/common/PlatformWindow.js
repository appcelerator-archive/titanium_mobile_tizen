function PlatformWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	
	var isMobileWeb = Ti.Platform.osname === 'mobileweb';
	var isTizen = Ti.Platform.osname === 'tizen';
	
	var data = [];
	
	if (isTizen) {
		data.push({title: 'Tizen', hasChild: true,  test: 'ui/common/platform/tizen'});
	}	
	// create table view data object
	data.push({title:'XHR', hasChild:true, test:'ui/common/platform/xhr'});
	!isTizen && data.push({title:'Network', hasChild:true, test:'ui/common/platform/network'});
	data.push({title:'Common JS', hasChild:true, test:'ui/common/platform/commonjs'});
	data.push({title:'Logging', hasChild:true, test:'ui/common/platform/logging'});
	data.push({title:'Application Data', hasChild:!isMobileWeb, test:'ui/common/platform/app_data', touchEnabled:!isMobileWeb, color:isMobileWeb?"#aaa":"#000"});
	!isTizen && data.push({title:'Application Events', hasChild:!isMobileWeb, test:'ui/common/platform/app_events', touchEnabled:!isMobileWeb, color:isMobileWeb?"#aaa":"#000"});
	data.push({title:'Properties API', hasChild:true, test:'ui/common/platform/properties'});
	data.push({title:'Database', hasChild:!isMobileWeb, test:'ui/common/platform/database', touchEnabled:!isMobileWeb, color:isMobileWeb?"#aaa":"#000"});
	data.push({title:'Platform Data', hasChild:true, test:'ui/common/platform/platform'});
	data.push({title:'Filesystem', hasChild:true, test:'ui/common/platform/filesystem'});
	data.push({title:'JS Includes', hasChild:true, test:'ui/common/platform/js_include'});
	data.push({title:'Set Timeout (timer)', hasChild:true, test:'ui/common/platform/set_timeout'});
	data.push({title:'Set Interval (timer)', hasChild:true, test:'ui/common/platform/set_interval'});
	data.push({title:'XML RSS', hasChild:!isMobileWeb, test:'ui/common/platform/xml_rss', touchEnabled:!isMobileWeb, color:isMobileWeb?"#aaa":"#000"});
	data.push({title:'Utils', hasChild:true, test:'ui/common/platform/utils'});
	data.push({title:'JSON', hasChild:true, test:'ui/common/platform/json'});
	data.push({title:'JS search', hasChild:true, test:'ui/common/platform/search_case_insensitive'});
	data.push({title:'Clipboard', hasChild:true, test:'ui/common/platform/clipboard'});
	data.push({title:'Sockets', hasChild:!isMobileWeb, test:'ui/common/platform/sockets', touchEnabled:!isMobileWeb, color:isMobileWeb?"#aaa":"#000"});
	
	if (Titanium.Platform.name == 'iPhone OS' || isMobileWeb) {
		data.push({title:'Passing Data (windows)', hasChild:true, test:'ui/common/platform/custom_properties'});
	}
	
	
	if (Titanium.Platform.name == 'iPhone OS') {
		data.push({title:'Bonjour', hasChild:true, test:'ui/handheld/ios/platform/bonjour'});
	}
	
	if (Titanium.Platform.osname === 'android') {
		data.push({title: 'Android services', hasChild:true, test:'ui/handheld/android/platform/android_services'});
	}
	
	
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
	var tableview = Titanium.UI.createTableView({
		data:data
	});
	
	// create table view event listener
	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var ExampleWindow = require(e.rowData.test),
				win = new ExampleWindow({title:e.rowData.title,containingTab:self.containingTab});
			self.containingTab.open(win,{animated:true});
		}
	});
	
	// add table view to the window
	self.add(tableview);
	
	return self;
};

module.exports = PlatformWindow;
