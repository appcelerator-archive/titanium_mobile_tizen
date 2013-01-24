function tizen_apps_kill(_args) {

	var self = Titanium.UI.createWindow();
	var tableview = Ti.UI.createTableView({
		//Data will be filled by _addRunAppsToTableView
		data : []
	});
	
	function _addRunAppsToTableView() {
		// Return information available about a running application.
		tizen.application.getAppsContext(function(contexts) {
			var data = [];
			for ( var i = 0; i < contexts.length; i++) {
				data.push({
					// AlertDialog title
					title : contexts[i].appId + "\n" + "<font size='1'>" + contexts[i].id + "</font>",
					// app_id consist application id used in showAppInfoById
					// Do not remove it
					app_id : contexts[i].appId,
					id : contexts[i].id
				});
			}
			tableview.data = data;

		}, _args.showErrorDialog);
	}	

	// Function kill application by id in e.rowData.app_id
	// e.rowData.app_id - should consist application id
	// e.rowData.title - Should consist dialog title
	function _killAppInfoById(e) {
		if (e.rowData && e.rowData.app_id) {
			var checkedAppId = e.rowData.app_id;
			try {
				appInfo = tizen.application.getAppInfo(checkedAppId);
			} catch (error) {
				_args.showErrorDialog(error, "Could not call tizen.application.getAppInfo function");
				return;
			}
			var dialogMessage = "Do you want to kill this application?" + " \n\n Id = " + appInfo.id + "\n\n Name = " + appInfo.name
					+ (appInfo.version ? "\n\n Version =" + appInfo.version : " ");

			var optionsDialogOpts = {
				options : ['Ok', 'Cancel'],
				destructive : 1,
				cancel : 1,
				title : dialogMessage
			};

			var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);
			dialog.addEventListener('click', function(e) {
				// Press ok(kill) button
				Ti.API.info("checkedAppId=" + checkedAppId);
				if (e.index === 0) {
					tizen.application.kill(checkedAppId, function() {
						//Succes callback
						Ti.API.info("Application with ID = " + checkedAppId + "has been killed");
					}, function(error) {
						//Error callback
						//Error should be instace of WebAPIError
						_args.showErrorDialog(error.name, error.message);
					});
					_addRunAppsToTableView();
				}

			});
			dialog.show();

		}
	}
	tableview.addEventListener('click', _killAppInfoById);
	self.add(tableview);
	_addRunAppsToTableView();


	return self;

}
module.exports = tizen_apps_kill;
