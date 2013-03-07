define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoDeviceOrientation', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoDeviceOrientation]') {
				this._obj = args;
			} else {
			}
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