define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoDeviceOrientation', SystemInfoProperty, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			status: {
				get: function() {
					return this._obj.status;
				}
			},
		},

	});
});