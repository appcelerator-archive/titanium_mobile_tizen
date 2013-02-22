define(['Ti/_/lang'], function(lang) {
	return lang.setObject('Ti.Tizen.Call', {

		constants: {
			history: {
				get: function() {
					return Ti.Tizen.Call.CallHistory;
				}
			},
		},

		isCallInProgress: function() {
			return tizen.call.isCallInProgress();
		},

	});
});