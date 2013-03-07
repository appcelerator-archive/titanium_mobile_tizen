define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoBattery', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoBattery]') {
				this._obj = args;
			} else {
			}
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