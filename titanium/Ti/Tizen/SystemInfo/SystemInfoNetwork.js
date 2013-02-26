define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoNetwork', SystemInfoProperty, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			networkType: {
				get: function() {
					return this._obj.networkType;
				}
			},
		},

	});
});