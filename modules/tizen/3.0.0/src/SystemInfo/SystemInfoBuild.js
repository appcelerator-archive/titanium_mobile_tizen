define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoBuild', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoBuild]') {
				this._obj = args;
			} 
		},

		constants: {
			model: {
				get: function() {
					return this._obj.model;
				}
			},
		},

	});
});