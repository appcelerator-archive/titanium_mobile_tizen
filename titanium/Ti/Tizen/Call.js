define(['Ti/_/lang', 'Ti/_/Evented'], function(lang, Evented) {

	return lang.setObject('Ti.Tizen.Call', Evented, {

		constants: {
			history: {
				get: function() {
					return Ti.Tizen.Call.CallHistory;
				}
			},
		},

		isCallInProgress: function() {
			return tizen.call.isCallInProgress();
		}

	});

});