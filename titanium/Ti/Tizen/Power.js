define(['Ti/_/lang', 'Ti/Tizen/WebAPIError', 'Ti/Tizen/Power/PowerStateRequest', 'Ti/_/Evented'], function(lang, WebAPIError, PowerRequest, Evented) {
	return lang.setObject('Ti.Tizen.Power', Evented, {

		constants: {
			POWER_RESOURCE_DISPLAY: 'DISPLAY',
			POWER_STATE_DISPLAY_OFF: 'DISPLAY_OFF',
			POWER_STATE_DISPLAY_DIM: 'DISPLAY_DIM',
			POWER_STATE_DISPLAY_NORMAL: 'DISPLAY_NORMAL',
			POWER_STATE_DISPLAY_BRIGHT: 'DISPLAY_BRIGHT',
		},

		request: function(request /*PowerStateRequest*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, listener /*PowerStateChangeCallback*/) {
			return tizen.power.request(request._obj, successCallback, errorCallback && function(e) {
				errorCallback.call(null, new WebAPIError(e));
			}, listener);
		},

		release: function(resource /*PowerResource*/) {
			return tizen.power.release(resource);
		},

		createPowerStateRequest: function(args) {
			return new PowerRequest(args);
		},
	});
});