define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoDisplay', SystemInfoProperty, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			resolutionWidth: {
				get: function() {
					return this._obj.resolutionWidth;
				}
			},
			resolutionHeight: {
				get: function() {
					return this._obj.resolutionHeight;
				}
			},
			dotsPerInchWidth: {
				get: function() {
					return this._obj.dotsPerInchWidth;
				}
			},
			dotsPerInchHeight: {
				get: function() {
					return this._obj.dotsPerInchHeight;
				}
			},
			physicalWidth: {
				get: function() {
					return this._obj.physicalWidth;
				}
			},
			physicalHeight: {
				get: function() {
					return this._obj.physicalHeight;
				}
			},
			brightness: {
				get: function() {
					return this._obj.brightness;
				}
			},
		},

	});
});