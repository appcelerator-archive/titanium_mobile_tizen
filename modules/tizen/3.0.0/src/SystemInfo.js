define(['Ti/_/lang', 'SystemInfo/SystemInfoProperty', 'SystemInfo/SystemInfoCpu', 'SystemInfo/SystemInfoStorage', 
		'SystemInfo/SystemInfoDeviceCapability', 'SystemInfo/SystemInfoCellularNetwork',
		'SystemInfo/SystemInfoSIM', 'SystemInfo/SystemInfoStorageUnit', 'WebAPIError', 'Ti/_/Evented', 'SystemInfo/SystemInfoWifiNetwork'],
		function(lang, SystemInfoProperty, SystemInfoCpu, SystemInfoStorage, SystemInfoDeviceCapability,
			SystemInfoCellularNetwork, SystemInfoSIM, SystemInfoStorageUnit, WebAPIError, Evented, SystemInfoWifiNetwork) {

	var SystemInfo = lang.mixProps(require.mix({}, Evented), {

		constants: {
			SYSTEM_INFO_PROPERTY_ID_CPU: 'CPU',
			SYSTEM_INFO_PROPERTY_ID_STORAGE: 'STORAGE',
			SYSTEM_INFO_PROPERTY_ID_WIFI_NETWORK: 'WIFI_NETWORK',
			SYSTEM_INFO_PROPERTY_ID_CELLULAR_NETWORK: 'CELLULAR_NETWORK',
			SYSTEM_INFO_PROPERTY_ID_SIM: 'SIM'
		},

		getCapabilities: function() {
			return this._wrap(tizen.systeminfo.getCapabilities());
		},

		getPropertyValue: function(property /*SystemInfoPropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			tizen.systeminfo.getPropertyValue(property, 
				function(object){
					getPropertySuccessCallBack(object, successCallback)
				},
				errorCallback && function(error) {
					errorCallback(new WebAPIError(error));
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
			if (object.toString() === '[object devicecapabilitiesinfo]') {
				return new SystemInfoDeviceCapability(object);
			}
		}
	}, true);

	function onSystemInfoPropertySuccessCallback(object, onsuccess) { 
		onsuccess(new SystemInfoProperty(object));
	}

	function getPropertySuccessCallBack(object, successCallback) {
		successCallback(wrap(object));
	}
	
	function wrap(object) {
		if (object.toString() === '[object cpuinfo]') {
			return new SystemInfoCpu(object);
		}
		if (object.toString() === '[object storageinfo]') {
			return new SystemInfoStorage(object);
		}
		if (object.toString() === '[object cellularnetworkinfo]') {
			return new SystemInfoCellularNetwork(object);
		}
		if (object.toString() === '[object siminfo]') {
			return new SystemInfoSIM(object);
		}
		if (object.toString() === '[object wifinetworkinfo]') {
			return new SystemInfoWifiNetwork(object);
		}
	}

	return SystemInfo;
});