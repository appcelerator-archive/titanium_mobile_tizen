define(['Ti/_/lang'], function(lang) {
	return lang.setObject('Ti.Tizen.SystemInfo', {

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
			SYSTEM_INFO_NETWORK_TYPE_2_5G: '2.5G',
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
			return tizen.systeminfo.getPropertyValue(property, successCallback, errorCallback);
		},

		addPropertyValueChangeListener: function(property /*SystemInfoPropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, options /*SystemInfoOptions*/) {
			return tizen.systeminfo.addPropertyValueChangeListener(property, successCallback, options);
		},

		removePropertyValueChangeListener: function(listenerId /*unsigned long*/) {
			return tizen.systeminfo.removePropertyValueChangeListener(listenerId);
		},

		_wrap: function(object) {
			if (object.toString() === '[object SystemInfoDeviceCapability]') {
				return this.createSystemInfoDeviceCapability(object);
			}
		},
	});
	function onSystemInfoPropertySuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new SystemInfoProperty(object));
	};

});