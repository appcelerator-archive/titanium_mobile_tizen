// Wraps Tizen module "SystemInfo".

define(['Ti/_/lang', 'Tizen/_/SystemInfo/SystemInfoCpu', 'Tizen/_/SystemInfo/SystemInfoStorage',
	'Tizen/_/SystemInfo/SystemInfoDeviceCapability', 'Tizen/_/SystemInfo/SystemInfoCellularNetwork', 'Tizen/_/SystemInfo/SystemInfoSIM',
	'Tizen/_/SystemInfo/SystemInfoStorageUnit', 'Tizen/_/SystemInfo/SystemInfoLocale', 'Tizen/_/SystemInfo/SystemInfoPeripheral', 'Ti/_/Evented'],
	function(lang, SystemInfoCpu, SystemInfoStorage, SystemInfoDeviceCapability, SystemInfoCellularNetwork,
			SystemInfoSIM, SystemInfoStorageUnit, SystemInfoLocale, SystemInfoPeripheral, Evented) {

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
				// Tizen distinguishes between undefined optional parameters (this gives an error) and missing optional parameters (this is correct).
				var args = [
					property,
					function(object) {
						successCallback(wrap(object));
					}
				];
				(typeof options !== 'undefined') && args.push(options);
				return tizen.systeminfo.addPropertyValueChangeListener.apply(tizen.systeminfo, args);
			},

			removePropertyValueChangeListener: function(listenerId /*unsigned long*/) {
				return tizen.systeminfo.removePropertyValueChangeListener(listenerId);
			},

			constants: {
				SYSTEM_INFO_PROPERTY_ID_CPU: 'CPU',
				SYSTEM_INFO_PROPERTY_ID_STORAGE: 'STORAGE',
				SYSTEM_INFO_PROPERTY_ID_WIFI_NETWORK: 'WIFI_NETWORK',
				SYSTEM_INFO_PROPERTY_ID_CELLULAR_NETWORK: 'CELLULAR_NETWORK',
				SYSTEM_INFO_PROPERTY_ID_SIM: 'SIM',
				SYSTEM_INFO_PROPERTY_ID_LOCALE: 'LOCALE',
				SYSTEM_INFO_PROPERTY_ID_PERIPHERAL: 'PERIPHERAL',
				SYSTEM_INFO_SIM_STATE_ABSENT: 'ABSENT',
				SYSTEM_INFO_SIM_STATE_INITIALIZING: 'INITIALIZING',
				SYSTEM_INFO_SIM_STATE_READY: 'READY',
				SYSTEM_INFO_SIM_STATE_PIN_REQUIRED: 'PIN_REQUIRED',
				SYSTEM_INFO_SIM_STATE_PUK_REQUIRED: 'PUK_REQUIRED',
				SYSTEM_INFO_SIM_STATE_NETWORK_LOCKED: 'NETWORK_LOCKED',
				SYSTEM_INFO_SIM_STATE_SIM_LOCKED: 'SIM_LOCKED',
				SYSTEM_INFO_SIM_STATE_UNKNOWN: 'UNKNOWN'
			}

		}, true);

		// Appropriate types are absent in Tizen, so we leave toString.
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
			if (object.toString() === '[object devicecapabilitiesinfo]') {
				return new SystemInfoDeviceCapability(object);
			}
			if (object.toString() === '[object localeinfo]') {
				return new SystemInfoLocale(object);
			}
			if (object.toString() === '[object peripheralinfo]') {
				return new SystemInfoPeripheral(object);
			}
		}

		return SystemInfo;
	});