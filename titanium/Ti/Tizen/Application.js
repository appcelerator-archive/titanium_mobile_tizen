define(['Ti/_/lang', 'Ti/Tizen/WebAPIError', 'Ti/Tizen/Application/ApplicationInformation', 'Ti/Tizen/Application/ApplicationContext', 'Ti/Tizen/Application/Application', 
		'Ti/Tizen/Application/ApplicationControl', 'Ti/Tizen/Application/ApplicationControlData'], 
		function(lang, WebAPIError, ApplicationInformation, ApplicationContext, Application, ApplicationControl) {

	return lang.setObject('Ti.Tizen.Application', {
		getCurrentApplication: function() {
			return new Application(tizen.application.getCurrentApplication());
		},

		launch: function(id /*ApplicationId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			tizen.application.launch(id, successCallback, errorCallback && wrappedErrorCallback);
		},

		launchAppControl: function(appControl /*ApplicationControl*/, id /*ApplicationId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, replyCallback /*ApplicationControlDataArrayReplyCallback*/) {
			var wrappedReplyCallback = {
				onsuccess: replyCallback.onsuccess && function(data) {
					var i = 0,
						len = data.length,
						wrappedItems = [];

					for (; i < len; i++) {
						wrappedItems.push(new TiTizenApplicationApplicationControlData(data[i]));
					}

					replyCallback.onsuccess(wrappedItems);
				},
				onfailure: replyCallback.onfailure && function() {
				   replyCallback.onfailure();
				}
			}

			tizen.application.launchAppControl(appControl._obj, id, successCallback, errorCallback, replyCallback && wrappedReplyCallback);
		},

		findAppControl: function(appControl /*ApplicationControl*/, successCallback /*FindAppControlSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			tizen.application.findAppControl(appControl._obj, successCallback, errorCallback);
		},

		getAppsContext: function(successCallback /*ApplicationContextArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function applicationsContextListSuccessCallback(items) {
				var i = 0,
					itemsCount = items.length,
					wrappedItems = [];

				for (var i = 0; i < itemsCount; i++) {
					wrappedItems.push(new ApplicationContext(items[i]));
				}

				successCallback(wrappedItems);
			}

			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			tizen.application.getAppsContext(successCallback && applicationsContextListSuccessCallback, errorCallback && wrappedErrorCallback);
		},

		getAppContext: function(contextId /*ApplicationContextId*/) {
			return new new ApplicationContext(tizen.application.getAppContext(contextId));
		},

		getAppsInfo: function(successCallback /*ApplicationInformationArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function applicationsInformationSuccessCallback(items) {
				var i = 0,
					itemsCount = items.length,
					wrappedItems = [];

				for (var i = 0; i < itemsCount; i++) {
					wrappedItems.push(new ApplicationInformation(items[i]));
				}

				successCallback(wrappedItems);
			}

			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			tizen.application.getAppsInfo(successCallback && applicationsInformationSuccessCallback, errorCallback && wrappedErrorCallback);
		},

		getAppInfo: function(id /*ApplicationId*/) {
			return new ApplicationInformation(tizen.application.getAppInfo(id));
		},

		addAppInfoEventListener: function(eventCallback /*ApplicationInformationEventCallback*/) {
			tizen.application.addAppInfoEventListener(eventCallback);
		},

		removeAppInfoEventListener: function(watchId /*long*/) {
			tizen.application.removeAppInfoEventListener(watchId);
		},

		createApplicationControlData: function(args) {
			return new ApplicationControlData(args);
		},

		createApplicationControl: function(args) {
			return new ApplicationControl(args);
		},
	});

	function onApplicationInformationArraySuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new ApplicationInformation(object));
	};

	function onFindAppControlSuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new ApplicationInformation(object));
	};

	function onApplicationContextArraySuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new ApplicationContext(object));
	};
});