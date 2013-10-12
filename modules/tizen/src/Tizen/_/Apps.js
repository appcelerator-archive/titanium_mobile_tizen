// Wraps Tizen module "Application".
// Module "Application" is renamed as "Apps" in this wrapper.

define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/WebAPIError', 'Tizen/_/Apps/ApplicationInformation', 'Tizen/_/Apps/ApplicationContext', 'Tizen/_/Apps/Application', 'Tizen/_/Apps/ApplicationMetaData'],
	function(lang, Evented, WebAPIError, ApplicationInformation, ApplicationContext, Application, ApplicationMetaData) {

		var listening;

		function onError (e, callback) {
			callback({
				success: false,
				error: e.type + ': ' + e.message,
				code: e.code
			});
		}

		return lang.mixProps(require.mix({}, Evented), {

			getCurrentApplication: function() {
				return new Application(tizen.application.getCurrentApplication());
			},

			launch: function(id /*ApplicationId*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				if(!callback) {
					tizen.application.launch(id);
				} else {
					tizen.application.launch(id, function () {
						callback({
							code: 0,
							success: true
						});
					}, function (e) {
						onError(e, callback);
					});
				}
			},

			launchAppControl: function(appControl /*Object*/, id /*ApplicationId*/, callback, replyCallback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [ appControl._obj ], 
				wrappedReplyCallback = {
					onsuccess: replyCallback && function(data) {
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

						replyCallback({
							code: 0,
							success: true,
							data: wrappedItems
						});
					},
					onfailure: replyCallback && function() {
						replyCallback({
							code: -1,
							success: false
						});
					}
				};

				(typeof id !== 'undefined') && args.push(id);
				(typeof callback !== 'undefined') && args.push(function () {
						callback({
							code: 0,
							success: true
						});
					},
					function (e) {
						onError(e, callback);
					}
				);
				(typeof replyCallback !== 'undefined') && args.push(wrappedReplyCallback);

				tizen.application.launchAppControl.apply(tizen.application, args);
			},

			findAppControl: function(appControl /*Object*/, callback) {
				var self = this;
				tizen.application.findAppControl(appControl._obj, callback && function (appInfo, appControl) {
					var resultAppInfo = [],
						i = 0,
						appInfoCount = appInfo.length;
					for (; i < appInfoCount; i++) {
						resultAppInfo.push(new ApplicationInformation(appInfo[i]));
					}
					callback({
						code: 0,
						success: true,
						appInfo: resultAppInfo,
						appControl: self.createApplicationControl({
							operation: appControl.operation,
							uri: appControl.uri,
							mime: appControl.mime,
							category: appControl.category,
							data: appControl.data
						})
					});
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			getAppsContext: function(callback) {
				tizen.application.getAppsContext(callback && function (contexts) {
					var i = 0,
						contextsCount = contexts.length,
						result = [];
					for (; i < contextsCount; i++) {
						result.push(new ApplicationContext(contexts[i]));
					}
					callback({
						code: 0,
						success: true,
						contexts: result
					});
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			getAppContext: function(contextId /*ApplicationContextId*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [];
				(typeof contextId !== 'undefined') && args.push(contextId);
				return new ApplicationContext(tizen.application.getAppContext.apply(tizen.application, args));
			},

			getAppsInfo: function(callback) {
				tizen.application.getAppsInfo(callback && function (applications) {
					var i = 0,
						appsCount = applications.length,
						result = [];
					for (; i < appsCount; i++) {
						result.push(new ApplicationInformation(applications[i]));
					}
					callback({
						code: 0,
						success: true,
						applications: result
					});
				}, callback && function (e) {
					onError(e, callback);
				});
			},

			getAppInfo: function(id /*ApplicationId*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [];
				(typeof id !== 'undefined') && args.push(id);
				return new ApplicationInformation(tizen.application.getAppInfo.apply(tizen.application, args));
			},

			addEventListener: function () {
				var self = this;
				Evented.addEventListener.apply(this, arguments);

				if (! listening) {
					listening = true;
					tizen.application.addAppInfoEventListener({
						oninstalled: function (application) {
							self.fireEvent('installed', {
								appInfo: new ApplicationInformation(application)
							});
						},
						onupdated: function (application) {
							self.fireEvent('updated', {
								appInfo: new ApplicationInformation(application)
							});
						},
						onuninstalled: function (applicationId) {
							self.fireEvent('uninstalled', {
								appId: applicationId
							});
						}
					});
				}
			},

			createApplicationControlData: function(args) {
				if (args.hasOwnProperty('key') && args.hasOwnProperty('value')) {
					return {
						key: args.key,
						value: args.value,
						_obj: new tizen.ApplicationControlData(args.key, args.value)
					};
				} else {
					throw new Error('Constructor with such parameters not found for ApplicationControlData.');
				}
			},

			createApplicationControl: function(args) {
				if (args.hasOwnProperty('operation')) {
					return {
						operation: args.operation,
						uri: args.uri,
						mime: args.mime,
						category: args.category,
						data: args.data,
						_obj: new tizen.ApplicationControl(args.operation, args.uri || null, args.mime || null, args.category || null , args.data || null)
					};
				} else {
					throw new Error('Constructor with such parameters not found for ApplicationControl.');
				}
			},

			getAppSharedURI: function(id) {
					return tizen.application.getAppSharedURI(id);
			},

			getAppMetaData: function(id /*ApplicationId*/) {
				var applicationId = id ? id : null,
					result = [],
					i = 0,
					metaDataArray = tizen.application.getAppMetaData.call(tizen.application, applicationId),
					len = metaDataArray && metaDataArray.length;

				for (; i < len; i++) {
					result.push(new ApplicationMetaData(metaDataArray[i]));
				}

				return result;
			}
		}, true);

	});
