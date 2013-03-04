define(['Ti/_/lang', 'Ti/_/Evented'], function(lang, Evented) {
	return lang.setObject('Ti.Tizen.Power', Evented, {

		constants: {
			POWER_RESOURCE_SCREEN: 'SCREEN',
			POWER_RESOURCE_CPU: 'CPU',
			POWER_SCREEN_STATE_SCREEN_OFF: 'SCREEN_OFF',
			POWER_SCREEN_STATE_SCREEN_DIM: 'SCREEN_DIM',
			POWER_SCREEN_STATE_SCREEN_NORMAL: 'SCREEN_NORMAL',
			POWER_SCREEN_STATE_SCREEN_BRIGHT: 'SCREEN_BRIGHT',
			POWER_CPU_STATE_CPU_AWAKE: 'CPU_AWAKE'
		},

		request: function(resource /*PowerResource*/, state /*PowerState*/) {
			return tizen.power.request(resource, state);
		},

		release: function(resource /*PowerResource*/) {
			return tizen.power.release(resource);
		},

		setScreenStateChangeListener: function(listener /*ScreenStateChangeCallback*/) {
			return tizen.power.setScreenStateChangeListener(listener);
		},

		unsetScreenStateChangeListener: function() {
			return tizen.power.unsetScreenStateChangeListener();
		},

		getScreenBrightness: function() {
			return tizen.power.getScreenBrightness();
		},

		setScreenBrightness: function(brightness /*double*/) {
			return tizen.power.setScreenBrightness(brightness);
		},

		isScreenOn: function() {
			return tizen.power.isScreenOn();
		},

		restoreScreenBrightness: function() {
			return tizen.power.restoreScreenBrightness();
		},

		turnScreenOn: function() {
			return tizen.power.turnScreenOn();
		},

		turnScreenOff: function() {
			return tizen.power.turnScreenOff();
		}

	});
});