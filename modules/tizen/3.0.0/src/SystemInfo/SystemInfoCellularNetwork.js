define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoCellularNetwork', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoCellularNetwork]') {
				this._obj = args;
			}
		},

		constants: {
			status: {
				get: function() {
					return this._obj.status;
				}
			},
			apn: {
				get: function() {
					return this._obj.apn;
				}
			},
			ipAddress: {
				get: function() {
					return this._obj.ipAddress;
				}
			},
			ipv6Address: {
				get: function() {
					return this._obj.ipv6Address;
				}
			},
			mcc: {
				get: function() {
					return this._obj.mcc;
				}
			},
			mnc: {
				get: function() {
					return this._obj.mnc;
				}
			},
			cellId: {
				get: function() {
					return this._obj.cellId;
				}
			},
			lac: {
				get: function() {
					return this._obj.lac;
				}
			},
			isRoaming: {
				get: function() {
					return this._obj.isRoaming;
				}
			},
		},

	});
});