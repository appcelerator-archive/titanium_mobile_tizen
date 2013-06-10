// Wraps Tizen module "Power".

define(['Ti/_/lang', 'Ti/_/Evented'], function(lang, Evented) {

	var listening;

	return lang.mixProps(require.mix({}, Evented), {

		request: function(resource /*PowerResource*/, state /*PowerState*/) {
			tizen.power.request(resource, state);
		},

		release: function(resource /*PowerResource*/) {
			tizen.power.release(resource);
		},

		isScreenOn: function() {
			return tizen.power.isScreenOn();
		},

		turnScreenOn: function() {
			 tizen.power.turnScreenOn();
		},

		turnScreenOff: function() {
			 tizen.power.turnScreenOff();
		},

		addEventListener: function () {
			var self = this;
			Evented.addEventListener.apply(this, arguments);

			if (! listening) {
				listening = true;

				tizen.power.setScreenStateChangeListener(function (prevState, changedState) {
					self.fireEvent('screenstatechanged', {
						previousState: prevState,
						changedState: changedState
					});
				});
			}
		},

		constants: {
			POWER_RESOURCE_SCREEN: 'SCREEN',
			POWER_RESOURCE_CPU: 'CPU',
			POWER_SCREEN_STATE_SCREEN_OFF: 'SCREEN_OFF',
			POWER_SCREEN_STATE_SCREEN_DIM: 'SCREEN_DIM',
			POWER_SCREEN_STATE_SCREEN_NORMAL: 'SCREEN_NORMAL',
			POWER_SCREEN_STATE_SCREEN_BRIGHT: 'SCREEN_BRIGHT',
			POWER_CPU_STATE_CPU_AWAKE: 'CPU_AWAKE'
		},

		properties: {
			screenBrightness: {
				get: function() {
					return tizen.power.getScreenBrightness();
				},
				set: function(value) {
					return tizen.power.setScreenBrightness(value);
				}
			}
		}

	}, true);

});