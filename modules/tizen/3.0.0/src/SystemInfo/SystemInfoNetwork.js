define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoNetwork', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoNetwork]') {
				this._obj = args;
			}
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