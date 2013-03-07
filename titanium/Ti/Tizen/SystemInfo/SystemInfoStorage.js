define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoStorage', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoStorage]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			units: {
				get: function() {
					return this._obj.units;
				}
			},
		},

	});
});