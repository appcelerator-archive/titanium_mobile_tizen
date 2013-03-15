define(['Ti/_/lang', 'Ti/_/Evented', 'Ti/Tizen/WebAPIError', 'Ti/Tizen/Apps/ApplicationInformation', 'Ti/Tizen/Apps/ApplicationContext', 'Ti/Tizen/Apps/Application'], 
		function(lang, Evented, WebAPIError, ApplicationInformation, ApplicationContext, Application) {

	return lang.setObject('Tizen.Application', Evented, {
		getCurrentApplication: function() {
			return new Application(tizen.application.getCurrentApplication());
		},

		launch: function(id /*ApplicationId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			tizen.application.launch(id, successCallback, errorCallback && wrappedErrorCallback);
		},

		launchAppControl: function(appControl /*Object*/, id /*ApplicationId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, replyCallback /*Object*/) {
			var wrappedReplyCallback = {
				onsuccess: replyCallback && replyCallback.onsuccess && function(data) {
					var i = 0,
						len = data.length,
						wrappedItems = [];

					for (; i < len; i++) {
						var j = 0,
							dataLen = data[i].value.length,
							controlDataObj = {
								key: data[i].key,
								value: []
							};

						for (; i < dataLen; j++) {
							controlDataObj.value.push(data[i].value[j]);
						}

						wrappedItems.push(controlDataObj);
					}

					replyCallback.onsuccess(wrappedItems);
				},
				onfailure: replyCallback && replyCallback.onfailure && function() {
				   replyCallback.onfailure();
				}
			}

			tizen.application.launchAppControl(appControl._obj, id, successCallback, errorCallback, replyCallback && wrappedReplyCallback);
		},

		findAppControl: function(appControl /*Object*/, successCallback /*FindAppControlSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function wrapperdSuccessCallback(informationArray, appControl) {
				var wrappedInformationArray = [],
					wrappedAppControl,
					i = 0,
					infoLen = informationArray.length;

				for (; i < infoLen; i++) {
					wrappedInformationArray.push(new ApplicationInformation(informationArray[i]));
				}

				wrappedAppControl = {
					operation: appControl.operation,
					uri: appControl.uri,
					mime: appControl.mime,
					category: appControl.category,
					data: appControl.data
				};

				successCallback(wrappedInformationArray, wrappedAppControl);
			}

			tizen.application.findAppControl(appControl._obj, successCallback && wrapperdSuccessCallback, errorCallback);
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
			if (args.hasOwnProperty('key') && args.hasOwnProperty('value')) {
				return {
					key: args.key,
					value: args.value,
					_obj: new tizen.ApplicationControlData(args.key, args.value)
				}	
			} else {
				Ti.API.error('Constructor with such parameters not found for ApplicationControlData.');	
			}
		},

		createApplicationControl: function(args) {
			if (args.hasOwnProperty('operation')) {
				return {
					opration: args.operation,
					uri: args.uri,
					MIME: args.mime,
					category: args.category,
					data: args.data,
					_obj: new tizen.ApplicationControl(args.operation, args.uri, args.mime, args.category, args.data)
				};
			} else {
				Ti.API.error('Constructor with such parameters not found for ApplicationControl.');	
			}
		}
	});
});