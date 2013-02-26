define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoDevice', SystemInfoProperty, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			imei: {
				get: function() {
					return this._obj.imei;
				}
			},
			model: {
				get: function() {
					return this._obj.model;
				}
			},
			version: {
				get: function() {
					return this._obj.version;
				}
			},
			vendor: {
				get: function() {
					return this._obj.vendor;
				}
			},
		},

	});
});