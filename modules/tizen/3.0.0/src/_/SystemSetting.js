define(['Ti/_/lang', 'Ti/_/Evented', '_/WebAPIError'], function(lang, WebAPIError, Evented) {

	return lang.mixProps(require.mix({}, Evented), {

		setProperty: function(type /*SystemSettingType*/, value /*DOMString*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.systemsetting.setProperty(type, value, function() {
				successCallback();
			}, errorCallback && function(e) {
				errorCallback(new WebAPIError(e));
			});
		},

		getProperty: function(type /*SystemSettingType*/, successCallback /*SystemSettingSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.systemsetting.getProperty(type, function(value) {
				successCallback(value);
			}, errorCallback && function(e) {
				errorCallback(new WebAPIError(e));
			});
		},

		constants: {
			SYSTEM_SETTING_TYPE_HOME_SCREEN: 'HOME_SCREEN',
			SYSTEM_SETTING_TYPE_LOCK_SCREEN: 'LOCK_SCREEN',
			SYSTEM_SETTING_TYPE_INCOMING_CALL: 'INCOMING_CALL',
			SYSTEM_SETTING_TYPE_NOTIFICATION_EMAIL: 'NOTIFICATION_EMAIL',
		}

	}, true);
});