define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoEthernetNetwork', SystemInfoProperty, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			status: {
				get: function() {
					return this._obj.status;
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
			proxyAddress: {
				get: function() {
					return this._obj.proxyAddress;
				}
			},
			macAddress: {
				get: function() {
					return this._obj.macAddress;
				}
			},
			gateway: {
				get: function() {
					return this._obj.gateway;
				}
			},
			dns: {
				get: function() {
					return this._obj.dns;
				}
			},
			subnetMask: {
				get: function() {
					return this._obj.subnetMask;
				}
			},
		},

	});
});