define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoCpu', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoCpu]') {
				this._obj = args;
			}
		},

		constants: {
			load: {
				get: function() {
					return this._obj.load;
				}
			},
		},

	});
});