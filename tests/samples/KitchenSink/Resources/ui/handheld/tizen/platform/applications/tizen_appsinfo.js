function tizen_appsinfo(_args) {
	
	var self = Ti.UI.createWindow();
	
	//Return list installed on the device applications 
	tizen.application.getAppsInfo(function(applications) {
		var data = [];
		for ( var i = 0; i < applications.length; i++) {
			data.push({
				//AlertDialog title
				title : applications[i].name +"\n" + "<font size='1'>"+applications[i].id +"</font>",
				//app_id consist application id used in showAppInfoById
				//Do not remove it
				app_id : applications[i].id,
				app_name: applications[i].name
			});
		}
		var tableview = Ti.UI.createTableView({
			data : data
		});
		
		//Show dialog with Application information on click
		tableview.addEventListener('click',  _args.showAppInfoById);
		self.add(tableview);

	}, _args.showErrorDialog);
	
	return self;
}
module.exports = tizen_appsinfo;
