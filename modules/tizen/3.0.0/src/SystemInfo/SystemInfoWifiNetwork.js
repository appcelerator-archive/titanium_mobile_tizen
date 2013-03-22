define(['Ti/_/declare', 'SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {

	var wifiNetwork = declare(SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoWifiNetwork]') {
				this._obj = args;
			}
		},

		constants: {
			status: {
				get: function() {
					return this._obj.status;
				}
			},
			ssid: {
				get: function() {
					return this._obj.ssid;
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
			signalStrength: {
				get: function() {
					return this._obj.signalStrength;
				}
			},
		},
	});

	wifiNetwork.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoWifiNetwork';

	return wifiNetwork;
});