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

	function initNetworkInfo() {
		// 'NETWORK' is a Tizen identifier that provides access to various network-related
		// information (via tizen.systeminfo.getPropertyValue). However, this function is
		// asynchronous - Tizen does not offer synchronous requests for this data. Since we 
		// must implement the corresponding synchronous Titanium API, we will cache the data
		// and synchronously return the cached copy to the Titanium programmer. The cache
		// will be kept up to date.

		// Initialize the locally cached values of 'NETWORK' for the first time:
		tizen.systeminfo.getPropertyValue('NETWORK', onSuccessNetworkCallback, onErrorCallback);

		// Initialize Tizen listeners for changes of the 'NETWORK' values, so that we are always
		// in sync with the system. Every time the system value changes, onSuccessNetworkCallback 
		// will execute, and the locally cached values will update. 
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

	initNetworkInfo();

	return Network;

});