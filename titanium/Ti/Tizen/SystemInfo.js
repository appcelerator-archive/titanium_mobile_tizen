define(['Ti/_/lang', 'Ti/Tizen/SystemInfo/SystemInfoProperty', 'Ti/Tizen/SystemInfo/SystemInfoPower', 'Ti/Tizen/SystemInfo/SystemInfoCpu', 'Ti/Tizen/SystemInfo/SystemInfoStorage', 'Ti/Tizen/SystemInfo/SystemInfoDisplay',
		'Ti/Tizen/SystemInfo/SystemInfoDevice', 'Ti/Tizen/SystemInfo/SystemInfoNetwork', 'Ti/Tizen/SystemInfo/SystemInfoWifiNetwork', 'Ti/Tizen/SystemInfo/SystemInfoCellularNetwork', 'Ti/Tizen/SystemInfo/SystemInfoEthernetNetwork',
		'Ti/Tizen/SystemInfo/SystemInfoSIM', 'Ti/Tizen/SystemInfo/SystemInfoDeviceOrientation'],
		function(lang, SystemInfoProperty, SystemInfoPower, SystemInfoCpu, SystemInfoStorage, SystemInfoDisplay, SystemInfoDevice, SystemInfoNetwork,
					SystemInfoWifiNetwork, SystemInfoCellularNetwork, SystemInfoEthernetNetwork, SystemInfoSIM, SystemInfoDeviceOrientation) {
	
	return lang.setObject('Ti.Tizen.SystemInfo', {

		constants: {
			SYSTEM_INFO_NETWORK_TYPE_NONE: 'NONE',
			SYSTEM_INFO_NETWORK_TYPE_2G: '2G',
			SYSTEM_INFO_NETWORK_TYPE_25G: '2.5G',
			SYSTEM_INFO_NETWORK_TYPE_3G: '3G',
			SYSTEM_INFO_NETWORK_TYPE_4G: '4G',
			SYSTEM_INFO_NETWORK_TYPE_WIFI: 'WIFI',
			SYSTEM_INFO_NETWORK_TYPE_ETHERNET: 'ETHERNET',
			SYSTEM_INFO_NETWORK_TYPE_UNKNOWN: 'UNKNOWN',
			SYSTEM_INFOS_DEVICE_ORIENTATION_STATUS_PORTRAIT_PRIMARY: 'portrait-primary',
			SYSTEM_INFOS_DEVICE_ORIENTATION_STATUS_PORTRAIT_SECONDARY: 'portrait-secondary',
			SYSTEM_INFOS_DEVICE_ORIENTATION_STATUS_LANDSCAPE_PRIMARY: 'landscape-primary',
			SYSTEM_INFOS_DEVICE_ORIENTATION_STATUS_LANDSCAPE_SECONDARY: 'landscape-secondary',
		},

		isSupported: function(property /*PropertyId*/) {
			return tizen.systeminfo.isSupported(property);
		},

		getPropertyValue: function(property /*PropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			tizen.systeminfo.getPropertyValue(property, function(object){getPropertySuccessCallBack(object, successCallback)}, errorCallback);
		},

		addPropertyValueChangeListener: function(property /*PropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, errorCallback /*ErrorCallback*/, options /*SystemInfoOptions*/) {			
			return tizen.systeminfo.addPropertyValueChangeListener(property, function(object){onSystemInfoPropertySuccessCallback(object, successCallback)}, errorCallback, options);
		},

		removePropertyValueChangeListener: function(listenerID /*long*/) {
			return tizen.systeminfo.removePropertyValueChangeListener(listenerID);
		},

	});
	
	function onSystemInfoPropertySuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new SystemInfoProperty(object));
	};
	
	function getPropertySuccessCallBack(object, successCallback) {
		successCallback.call(self, wrap(object));
	}
	
	function wrap(object) {
		if (object.toString() === '[object powerinfo]') {
			return new SystemInfoPower(object);
		}
		if (object.toString() === '[object cpuinfo]') {
			return new SystemInfoCpu(object);
		}
		if (object.toString() === '[object storageinfo]') {		
			return new SystemInfoStorage(object);
		}
		if (object.toString() === '[object displayinfo]') {
			return new SystemInfoDisplay(object);
		}
		if (object.toString() === '[object deviceinfo]') {
			return new SystemInfoDevice(object);
		}
		if (object.toString() === '[object networkinfo]') {
			return new SystemInfoNetwork(object);
		}
		if (object.toString() === '[object wifinetworkinfo]') {
			return new SystemInfoWifiNetwork(object);
		}
		if (object.toString() === '[object cellularnetworkinfo]') {
			return new SystemInfoCellularNetwork(object);
		}
		if (object.toString() === '[object ethernetnetworkinfo]') {
			return new SystemInfoEthernetNetwork(object);
		}
		if (object.toString() === '[object siminfo]') {
			return new SystemInfoSIM(object);
		}
		if (object.toString() === '[object deviceorientationinfo]') {
			return new SystemInfoDeviceOrientation(object);
		}
	};
});