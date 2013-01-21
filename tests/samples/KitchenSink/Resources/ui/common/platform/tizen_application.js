function tizen_application(_args) {
	var self = Titanium.UI.createWindow(), data = [{
		title : 'Installed App Info',
		hasChild : true,
		test : 'ui/common/platform/tizen_appsinfo'
	}, {
		title : 'Running App Info',
		hasChild : true,
		test : 'ui/common/platform/tizen_appscontext'
	}, {
		title : 'Kill Running App',
		hasChild : true,
		test : 'ui/common/platform/tizen_apps_kill'
	}, {
		title : 'Exit / Hide / Launch / Kill',
		hasChild : true,
		test : 'ui/common/platform/tizen_exit_hide_launch'
	}

	], tableview = Ti.UI.createTableView({
		data : data
	});

	tableview.addEventListener('click', function(e) {
		if (e.rowData.test) {
			var TizenApplication = require(e.rowData.test), win = new TizenApplication({
				title : e.rowData.title,
				containingTab : _args.containingTab,
				showAppInfoById : _showAppInfoById,
				showErrorDialog : _showErrorDialog
			});
			_args.containingTab.open(win, {
				animated : true
			});
		}
	});

	// Function show AlertDialog with app information
	// e.rowData.app_id - should consist application id
	// e.rowData.title - Should consist dialog title
	function _showAppInfoById(e) {
		if (e.rowData && e.rowData.app_id) {
			var appInfo;
			try {
				appInfo = tizen.application.getAppInfo(e.rowData.app_id);
			} catch (error) {
				_showErrorDialog(error, "Could not call tizen.application.getAppInfo function");
				return;
			}

			Titanium.UI.createAlertDialog({
				title : e.rowData.title,
				message : "\n\n Id = " + appInfo.id + 
				"\n\n Name = " + appInfo.name +
					(appInfo.iconPath ? "\n\n IconPath =" + appInfo.iconPath : "") +
					(appInfo.version ? "\n\n Version =" + appInfo.version : " ") + 
					(appInfo.show ? "\n\n Show =" + appInfo.show : " ") +
					(appInfo.installDate ? "\n\n InstallDate =" + appInfo.installDate : "") +
					(appInfo.size ? "\n\n Size =" + appInfo.size : "")
			}).show();
		}
	}

	// Function show AlertDialog with error message
	// And log this error
	function _showErrorDialog(logMessage, userMessage) {
		Ti.API.error(logMessage);
		Titanium.UI.createAlertDialog({
			title : "Unexpected action",
			message : userMessage ? userMessage : logMessage
		}).show();
	}
	self.add(tableview);

	return self;
}
module.exports = tizen_application;
