define(['Ti/_/lang', 'Ti/Tizen/SystemInfo/SystemInfoBattery', 'Ti/Tizen/SystemInfo/SystemInfoBuild', 'Ti/Tizen/SystemInfo/SystemInfoProperty', 'Ti/Tizen/SystemInfo/SystemInfoCpu', 'Ti/Tizen/SystemInfo/SystemInfoStorage', 
		'Ti/Tizen/SystemInfo/SystemInfoDisplay', 'Ti/Tizen/SystemInfo/SystemInfoDeviceCapability', 'Ti/Tizen/SystemInfo/SystemInfoNetwork', 'Ti/Tizen/SystemInfo/SystemInfoWifiNetwork', 'Ti/Tizen/SystemInfo/SystemInfoCellularNetwork',
		'Ti/Tizen/SystemInfo/SystemInfoSIM', 'Ti/Tizen/SystemInfo/SystemInfoDeviceOrientation', 'Ti/Tizen/SystemInfo/SystemInfoStorageUnit', 'Ti/Tizen/WebAPIError', 'Ti/_/Evented'],
		function(lang, SystemInfoBattery, SystemInfoBuild, SystemInfoProperty, SystemInfoCpu, SystemInfoStorage, SystemInfoDisplay, SystemInfoDeviceCapability,
			SystemInfoNetwork,	SystemInfoWifiNetwork, SystemInfoCellularNetwork, SystemInfoSIM, SystemInfoDeviceOrientation, SystemInfoStorageUnit, WebAPIError, Evented) {

	return lang.setObject('Ti.Tizen.SystemInfo', Evented, {

		constants: {
			SYSTEM_INFO_PROPERTY_ID_BATTERY: 'BATTERY',
			SYSTEM_INFO_PROPERTY_ID_CPU: 'CPU',
			SYSTEM_INFO_PROPERTY_ID_STORAGE: 'STORAGE',
			SYSTEM_INFO_PROPERTY_ID_DISPLAY: 'DISPLAY',
			SYSTEM_INFO_PROPERTY_ID_DEVICE_ORIENTATION: 'DEVICE_ORIENTATION',
			SYSTEM_INFO_PROPERTY_ID_BUILD: 'BUILD',
			SYSTEM_INFO_PROPERTY_ID_NETWORK: 'NETWORK',
			SYSTEM_INFO_PROPERTY_ID_WIFI_NETWORK: 'WIFI_NETWORK',
			SYSTEM_INFO_PROPERTY_ID_CELLULAR_NETWORK: 'CELLULAR_NETWORK',
			SYSTEM_INFO_PROPERTY_ID_SIM: 'SIM',
			SYSTEM_INFO_NETWORK_TYPE_NONE: 'NONE',
			SYSTEM_INFO_NETWORK_TYPE_2G: '2G',
			SYSTEM_INFO_NETWORK_TYPE_25G: '2.5G',
			SYSTEM_INFO_NETWORK_TYPE_3G: '3G',
			SYSTEM_INFO_NETWORK_TYPE_4G: '4G',
			SYSTEM_INFO_NETWORK_TYPE_WIFI: 'WIFI',
			SYSTEM_INFO_NETWORK_TYPE_ETHERNET: 'ETHERNET',
			SYSTEM_INFO_NETWORK_TYPE_UNKNOWN: 'UNKNOWN',
			SYSTEM_INFO_DEVICE_ORIENTATION_STATUS_PORTRAIT_PRIMARY: 'PORTRAIT_PRIMARY',
			SYSTEM_INFO_DEVICE_ORIENTATION_STATUS_PORTRAIT_SECONDARY: 'PORTRAIT_SECONDARY',
			SYSTEM_INFO_DEVICE_ORIENTATION_STATUS_LANDSCAPE_PRIMARY: 'LANDSCAPE_PRIMARY',
			SYSTEM_INFO_DEVICE_ORIENTATION_STATUS_LANDSCAPE_SECONDARY: 'LANDSCAPE_SECONDARY',
		},

		getCapabilities: function() {
			return this._wrap(tizen.systeminfo.getCapabilities());
		},

		getPropertyValue: function(property /*SystemInfoPropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			tizen.systeminfo.getPropertyValue(property, 
				function(object){
					getPropertySuccessCallBack(object, successCallback)
				}, 
				function(error) {
					errorCallback.call(null, new WebAPIError(error));
				});
		},

		addPropertyValueChangeListener: function(property /*PropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, options /*SystemInfoOptions*/) {
			return tizen.systeminfo.addPropertyValueChangeListener(property, function(object){
				onSystemInfoPropertySuccessCallback(object, successCallback)
			}, options);
		},

		removePropertyValueChangeListener: function(listenerId /*unsigned long*/) {
			return tizen.systeminfo.removePropertyValueChangeListener(listenerId);
		},

		_wrap: function(object) {
			console.log('>>>>>>>>>>>>>>>>>>' + object.toString());
			if (object.toString() === '[object devicecapabilitiesinfo]') {
				return new SystemInfoDeviceCapability(object);
			}
		},
	});
	
	function onSystemInfoPropertySuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new SystemInfoProperty(object));
	};

	function getPropertySuccessCallBack(object, successCallback) {
		successCallback.call(null, wrap(object));
	}
	
	function wrap(object) {
		if (object.toString() === '[object cpuinfo]') {
			return new SystemInfoCpu(object);
		}
		if (object.toString() === '[object storageinfo]') {		
			return new SystemInfoStorage(object);
		}
		if (object.toString() === '[object displayinfo]') {
			return new SystemInfoDisplay(object);
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
		if (object.toString() === '[object siminfo]') {
			return new SystemInfoSIM(object);
		}
		if (object.toString() === '[object deviceorientationinfo]') {
			return new SystemInfoDeviceOrientation(object);
		}
		if (object.toString() === '[object buildinfo]') {
			return new SystemInfoBuild(object);
		}
		if (object.toString() === '[object batteryinfo]') {
			return new SystemInfoBattery(object);
		}
	};
});