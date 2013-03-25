define(['Ti/_/lang'], function(lang) {
	var currentTizenApp = tizen.application.getCurrentApplication(),
		appInfo = currentTizenApp.appInfo;

	return lang.setObject('Ti.App.Tizen', {
		constants: {
			id: {
				get: function() {
					return appInfo.id;
				}
			},
			name: {
				get: function() {
					return appInfo.name;
				}
			},
			iconPath: {
				get: function() {
					return appInfo.iconPath;
				}
			},
			show: {
				get: function() {
					return appInfo.show;
				}
			},
			categories: {
				get: function() {
					return appInfo.categories;
				}
			},
			installDate: {
				get: function() {
					return appInfo.installDate;
				}
			},
			size: {
				get: function() {
					return appInfo.size;
				}
			}
		},

		exit: function() {
			currentTizenApp.exit();
		},

		hide: function() {
			currentTizenApp.hide();
		}
	});
});