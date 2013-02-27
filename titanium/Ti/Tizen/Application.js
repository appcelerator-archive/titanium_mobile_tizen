define(['Ti/_/lang', 'Ti/Tizen/WebAPIError', 'Ti/Tizen/Application/ApplicationInformation', 'Ti/Tizen/Application/ApplicationContext', 'Ti/Tizen/Application/ApplicationServiceData'], 
	function(lang, WebAPIError, ApplicationInformation, ApplicationContext, ApplicationServiceData) {

	return lang.setObject('Ti.Tizen.Application', {

		launch: function(id /*ApplicationId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, argument /*DOMString*/) {
			tizen.application.launch(id, successCallback, errorCallback && function(e) {
				errorCallback.call(null, new WebAPIError(e));
			}, argument);
		},

		kill: function(contextId /*ApplicationContextId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			tizen.application.kill(contextId, successCallback, errorCallback && function(e) {
				errorCallback.call(null, new WebAPIError(e));
			});
		},

		exit: function() {
			tizen.application.exit();
		},

		hide: function() {
			tizen.application.hide();
		},

		launchService: function(service /*ApplicationService*/, id /*ApplicationId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, replyCallback /*ApplicationServiceDataArrayReplyCallback*/) {
			tizen.application.launchService(service._obj, id, successCallback, errorCallback && function(e) {
				errorCallback.call(null,  new WebAPIError(e));
			}, replyCallback && {
				onsuccess: replyCallback.onsuccess && function(objects) {
					var i = 0,
						objectsCount = objects.length,
						result = [];
					for(; i < objectsCount; i++) {
						result.push(new ApplicationServiceData(objects[i]));
					}
					replyCallback.onsuccess.call(null, result);
				},
				onfail: replyCallback.onfail && function(e) {
					replyCallback.onfail.call(null);
				}
			});
		},

		getAppService: function() {
			return this._wrap(tizen.application.getAppService());
		},

		getAppsContext: function(successCallback /*ApplicationContextArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			tizen.application.getAppsContext(successCallback && function (objects) {
					var i = 0,
						objectsCount = objects.length,
						result = [];
					for(; i < objectsCount; i++) {
						result.push(new ApplicationContext(objects[i]));
					}
					successCallback.call(null, result);
				}, errorCallback && function(e) {
					errorCallback.call(null, new WebAPIError(e));
			});
		},
		
		getAppContext: function(id /*ApplicationContextId*/) {
			return new ApplicationContext(tizen.application.getAppContext(id));
		},

		getAppsInfo: function(successCallback /*ApplicationInformationArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			tizen.application.getAppsInfo(successCallback && function(objects) {
				var i = 0,
					objectsCount = objects.length,
					result = [];
				for(; i < objectsCount; i++) {
					result.push(new ApplicationInformation(objects[i]));
				}
				successCallback.call(null, result);
			}, errorCallback && function(e) {
				errorCallback.call(null, new WebAPIError(e));
			});
		},

		getAppInfo: function(id /*ApplicationId*/) {
			return new ApplicationInformation(tizen.application.getAppInfo(id));
		},

		addAppInfoEventListener: function(eventCallback /*ApplicationInformationEventCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.application.addAppInfoEventListener(eventCallback && {
				oninstalled: function(object) {
					eventCallback.oninstalled.call(null, new ApplicationInformation(object));
				},
				onupdated: function(object) {
					eventCallback.onupdated.call(null, new ApplicationInformation(object));
				},
				onuninstalled: function(id) {
					eventCallback.onuninstalled.call(null, id);
				}
			}, errorCallback && function(e) {
				errorCallback.call(null,  new WebAPIError(e));
			});
		},

		removeAppInfoEventListener: function(listenerID /*long*/) {
			return tizen.application.removeAppInfoEventListener(listenerID);
		},

		_wrap: function(object) {
			if (object.toString() === '[object ApplicationService]') {
				return this.createApplicationService(object);
			}
		},

		createApplicationService: function(args) {
			return new (require('Ti/Tizen/Application/ApplicationService'))(args);
		},
	});
});