define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoPower', SystemInfoProperty, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			level: {
				get: function() {
					return this._obj.level;
				}
			},
			isCharging: {
				get: function() {
					return this._obj.isCharging;
				}
			},
		},

	});
});