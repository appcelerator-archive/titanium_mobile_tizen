// Wraps Tizen module "SystemInfo".

define(['Ti/_/lang', 'Tizen/_/SystemInfo/SystemInfoProperty', 'Tizen/_/SystemInfo/SystemInfoCpu', 'Tizen/_/SystemInfo/SystemInfoStorage',
	'Tizen/_/SystemInfo/SystemInfoDeviceCapability', 'Tizen/_/SystemInfo/SystemInfoCellularNetwork', 'Tizen/_/SystemInfo/SystemInfoSIM',
	'Tizen/_/SystemInfo/SystemInfoStorageUnit', 'Tizen/_/WebAPIError', 'Ti/_/Evented'],
	function(lang, SystemInfoProperty, SystemInfoCpu, SystemInfoStorage, SystemInfoDeviceCapability, SystemInfoCellularNetwork,
			 SystemInfoSIM, SystemInfoStorageUnit, WebAPIError, Evented) {

		var SystemInfo = lang.mixProps(require.mix({}, Evented), {

			getCapabilities: function() {
				return this._wrap(tizen.systeminfo.getCapabilities());
			},

			getPropertyValue: function(property /*SystemInfoPropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, errorCallback /*ErrorCallback*/) {
				tizen.systeminfo.getPropertyValue(property, function(object) {
					successCallback(wrap(object));
				}, errorCallback && function(error) {
					errorCallback(new WebAPIError(error));
				});
			},

			addPropertyValueChangeListener: function(property /*PropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, options /*SystemInfoOptions*/) {
				return tizen.systeminfo.addPropertyValueChangeListener(property, function(object) {
					successCallback(new SystemInfoProperty(object))
				}, options);
			},

			removePropertyValueChangeListener: function(listenerId /*unsigned long*/) {
				return tizen.systeminfo.removePropertyValueChangeListener(listenerId);
			},

			_wrap: function(object) {
				// Wrap the object (create a Titanium wrapped object out of a native Tizen object).
				if (object.toString() === '[object devicecapabilitiesinfo]') {
					return new SystemInfoDeviceCapability(object);
				}
				else
				{
					Ti.API.error("Incorrect object type");
				}
			},

			constants: {
				SYSTEM_INFO_PROPERTY_ID_CPU: 'CPU',
				SYSTEM_INFO_PROPERTY_ID_STORAGE: 'STORAGE',
				SYSTEM_INFO_PROPERTY_ID_WIFI_NETWORK: 'WIFI_NETWORK',
				SYSTEM_INFO_PROPERTY_ID_CELLULAR_NETWORK: 'CELLULAR_NETWORK',
				SYSTEM_INFO_PROPERTY_ID_SIM: 'SIM'
			}

		}, true);

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
		}

		return SystemInfo;
	});
