define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoProperty', Evented, {
		constructor: function(args) {
			this._obj = args;
		},

	});
});