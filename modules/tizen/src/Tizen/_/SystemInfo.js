// Wraps Tizen module "SystemInfo".

define(['Ti/_/lang', 'Tizen/_/SystemInfo/SystemInfoCpu', 'Tizen/_/SystemInfo/SystemInfoStorage',
	'Tizen/_/SystemInfo/SystemInfoDeviceCapability', 'Tizen/_/SystemInfo/SystemInfoCellularNetwork', 'Tizen/_/SystemInfo/SystemInfoSIM',
	'Tizen/_/SystemInfo/SystemInfoStorageUnit', 'Ti/_/Evented'],
	function(lang, SystemInfoCpu, SystemInfoStorage, SystemInfoDeviceCapability, SystemInfoCellularNetwork,
			SystemInfoSIM, SystemInfoStorageUnit, Evented) {

		var SystemInfo = lang.mixProps(require.mix({}, Evented), {

			getCapabilities: function() {
				return wrap(tizen.systeminfo.getCapabilities());
			},

			getPropertyValue: function(property /*SystemInfoPropertyId*/, callback) {
				tizen.systeminfo.getPropertyValue(property, function(object) {
					callback({
						code: 0,
						success: true,
						data: wrap(object)
					});
				}, function(e) {
					callback({
						code: -1,
						error: e.type + ': ' + e.message,
						success: false
					});
				});
			},

			addPropertyValueChangeListener: function(property /*PropertyId*/, successCallback /*SystemInfoPropertySuccessCallback*/, options /*SystemInfoOptions*/) {
				return tizen.systeminfo.addPropertyValueChangeListener(property, function(object) {
					successCallback(wrap(object));
				}, options);
			},

			removePropertyValueChangeListener: function(listenerId /*unsigned long*/) {
				return tizen.systeminfo.removePropertyValueChangeListener(listenerId);
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
			if (object instanceof tizen.cpuinfo) {
				return new SystemInfoCpu(object);
			}
			if (object instanceof tizen.storageinfo) {
				return new SystemInfoStorage(object);
			}
			if (object instanceof tizen.cellularnetworkinfo) {
				return new SystemInfoCellularNetwork(object);
			}
			if (object instanceof tizen.siminfo) {
				return new SystemInfoSIM(object);
			}
			if (object instanceof tizen.devicecapabilitiesinfo) {
				return new SystemInfoDeviceCapability(object);
			}
		}

		return SystemInfo;
	});