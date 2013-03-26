define(['Ti/_/Evented', 'Ti/_/lang'], function(Evented, lang) {

	var Network = lang.setObject('Ti.Network', Evented, {

			constants: {
				NETWORK_LAN: 1,
				NETWORK_MOBILE: 3,
				NETWORK_NONE: 0,
				NETWORK_UNKNOWN: -1,
				NETWORK_WIFI: 2,
				networkType: void 0,
				networkTypeName: void 0,
				online: void 0
			},

			properties: {
				httpURLFormatter: null
			},

			createHTTPClient: function(args) {
				return new (require('Ti/Network/HTTPClient'))(args);
			},

			decodeURIComponent: function(value) {
				return decodeURIComponent(value);
			},

			encodeURIComponent: function(value) {
				return encodeURIComponent(value);
			}

		});

	function initNetworkType() {
		tizen.systeminfo.getPropertyValue('NETWORK', onSuccessNetworkCallback, onErrorCallback);
		tizen.systeminfo.addPropertyValueChangeListener('NETWORK', onSuccessNetworkCallback);
	}

	function onErrorCallback(e) {
		Ti.API.error('An error occured: ' + e.message);
	}

	function onSuccessNetworkCallback(network) {
		var networkType = network.networkType,
			online = 1,
			type;

		if (networkType === 'NONE') {
			type = Network.NETWORK_NONE;
			online = 0;
		} else if (networkType === 'WIFI') {
			type = Network.NETWORK_WIFI;
		} else if (networkType === 'ETHERNET') {
			type = Network.NETWORK_LAN;
			networkType = 'LAN';
		} else if (networkType === 'UNKNOWN') {
			type = Network.NETWORK_UNKNOWN;
		} else if (networkType !== 'LAN') {
			type = Network.NETWORK_MOBILE;
			networkType = 'MOBILE';
		}

		Network.constants.__values__.networkType = type;
		Network.constants.__values__.networkTypeName = typeName;
		Network.constants.__values__.online = online;

		Network.fireEvent('change', {
			networkType: type,
			networkTypeName: typeName,
			online: online
		});
	}

	initNetworkType();

	return Network;

});