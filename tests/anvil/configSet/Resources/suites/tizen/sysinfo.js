/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		checkCallbackMethod,
		reportError;
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
		checkCallbackMethod = checkCallbackMethodFunction;
	}

	//Tests for Tizen Device API: SystemInfo Device API
	this.name = 'sysinfo';
	this.tests = [
		{name: 'checkSystemInfo'},
		// {name: 'allPropertiesSupported'},
		{name: 'getBatteryProperty'},
		{name: 'getCpuProperty'},
		{name: 'getStorageProperty'},
		{name: 'getDisplayProperty'},
		{name: 'getBuildProperty'},
		{name: 'getNetworkProperty'},
		{name: 'getWifiNetworkProperty'},
		{name: 'getCellularNetworkProperty'},
		// {name: 'getEthernetNetworkProperty'},
		{name: 'getSimProperty'},
		{name: 'getDeviceOrientationProperty'},
		{name: 'testListenersBattery'},
		{name: 'testListenersCpu'},
		{name: 'testListenersStorage'},
		{name: 'testListenersDisplay'},
		// {name: 'testListenersDevice'},
		{name: 'testListenersDeviceOrientation'},
		{name: 'testListenersSIM'},
		//{name: 'testListenersEthernetNetwork'},
		{name: 'testListenersCellularNetwork'},
		{name: 'testListenersWifiNetwork'},
		{name: 'testListenersNetwork'}
	];

	this.checkSystemInfo  = function(testRun) {

		Ti.API.debug('Checking SystemInfo object availability.');
		valueOf(testRun, Ti.Tizen).shouldBeObject();
		valueOf(testRun, Ti.Tizen.SystemInfo).shouldBeObject();
		finish(testRun);
	}

	this.allPropertiesSupported = function(testRun) {
		// Test for Tizen Device API: do all documented properties are supported?
		// according to 'Tizen Web App Programming' => 'Programming Guide' => 'Device' => 'SystemInfo'
		// Basic Supported Properties are: Power, Cpu, Storage, Display, Device, WifiNetwork, CellularNetwork.
		// And 'Network', 'EthernetNetwork', 'SIM', 'DeviceOrientation' are NOT 'Basic Supported Properties' and depends on device
		var i = 0,
			current,
			isSupported,
			listOfAllProperties = [
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_BATTERY,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_CPU,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_STORAGE,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_DISPLAY,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_BUILD,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_NETWORK,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_WIFI_NETWORK,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_CELLULAR_NETWORK,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_SIM,
				Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_DEVICE_ORIENTATION
			],
			len = listOfAllProperties.length;

		for (; i < len; i++) {
			current  = listOfAllProperties[i];
			try{
				isSupported = Ti.Tizen.SystemInfo.isSupported(current);
				valueOf(testRun, isSupported).shouldBeTrue(); // test passed only if all properties are supported!

				if (isSupported) {
					Ti.API.debug('"' + current + '" property is supported.');
				} else {
					Ti.API.debug('"' + current + '" property is not supported.');
				}
			}catch (e) {
				Ti.API.debug('"' + current + '" property cause exception: ' + e.message);
				reportError(testRun, JSON.stringify(e));
			}
		}
		finish(testRun);
	}

	this.getBatteryProperty = function(testRun) {
		//Test for Tizen Device API: SystemInfoPower
		function onSuccessCallback(power) {
			Ti.API.info('The Battery object:' + JSON.stringify(power));

			valueOf(testRun, power).shouldBe('[object TiTizenSystemInfoSystemInfoBattery]');
			valueOf(testRun, power.level).shouldBeNumber();
			valueOf(testRun, power.isCharging).shouldBeBoolean();
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on Battery property:' + error.message);
			
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_BATTERY, onSuccessCallback, onErrorCallback);
	}

	this.getCpuProperty = function(testRun) {
		//Test for Tizen Device API: SystemInfoCpu
		function onSuccessCallback(cpuData) {
			Ti.API.debug('The power CPU load level is ' + cpuData.load);
			
			valueOf(testRun, cpuData).shouldBe('[object TiTizenSystemInfoSystemInfoCpu]');
			valueOf(testRun, cpuData.load).shouldBeNumber(); // double!
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on Cpu property:' + error.message);
			
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_CPU, onSuccessCallback, onErrorCallback);
	}

	this.getStorageProperty = function(testRun) {
		//Test for Tizen Device API: SystemInfoStorage and SystemInfoStorageUnit
		function onSuccessCallback(systemInfoStorage) {
			Ti.API.debug('Storage info: ' + JSON.stringify(systemInfoStorage));

			valueOf(testRun, systemInfoStorage).shouldBe('[object TiTizenSystemInfoSystemInfoStorage]');

			if (systemInfoStorage.units) {
				var i = 0, 
					len = systemInfoStorage.units.length,
					current;

				for (; i < len; i++) {
					current  = systemInfoStorage.units[i];

					Ti.API.debug('Storage info: ' + JSON.stringify(current));

					valueOf(testRun, current).shouldBe('[object TiTizenSystemInfoSystemInfoStorageUnit]');
				}
			}

			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on Storage property:' + error.message);
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_STORAGE, onSuccessCallback, onErrorCallback);
	}

	this.getDisplayProperty = function(testRun) {
		// Test for Tizen Device API: SystemInfoDisplay
		function onSuccessCallback(systemInfoDisplay) {
			Ti.API.debug('Display info: ' + JSON.stringify(systemInfoDisplay));
			
			valueOf(testRun, systemInfoDisplay).shouldBe('[object TiTizenSystemInfoSystemInfoDisplay]');
			
			if (systemInfoDisplay){
				valueOf(testRun, systemInfoDisplay.resolutionWidth).shouldBeNumber();
				valueOf(testRun, systemInfoDisplay.resolutionHeight).shouldBeNumber();
				valueOf(testRun, systemInfoDisplay.dotsPerInchWidth).shouldBeNumber();
				valueOf(testRun, systemInfoDisplay.dotsPerInchHeight).shouldBeNumber();
				valueOf(testRun, systemInfoDisplay.physicalWidth).shouldBeNumber();
				valueOf(testRun, systemInfoDisplay.physicalHeight).shouldBeNumber();
				valueOf(testRun, systemInfoDisplay.brightness).shouldBeNumber();
			}
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on Display property:' + error.message);
			
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_DISPLAY, onSuccessCallback, onErrorCallback);
	}

	this.getBuildProperty = function(testRun) {
		// Test for Tizen Device API: SystemInfoDevice
		function onSuccessCallback(systemInfoDevice) {
			Ti.API.debug('Device info: ' + JSON.stringify(systemInfoDevice));
			
			valueOf(testRun, systemInfoDevice).shouldBe('[object TiTizenSystemInfoSystemInfoBuild]');
			
			if (systemInfoDevice){
				valueOf(testRun, systemInfoDevice.model).shouldBeString();
			}
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on Device property:' + error.message);
			
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_BUILD, onSuccessCallback, onErrorCallback);
	}

	this.getNetworkProperty = function(testRun) {
		// Test for Tizen Device API: SystemInfoNetwork
		function onSuccessCallback(systemInfoNetwork) {
			Ti.API.debug('Network info: ' + JSON.stringify(systemInfoNetwork));
			valueOf(testRun, systemInfoNetwork).shouldBe('[object TiTizenSystemInfoSystemInfoNetwork]');
			if (systemInfoNetwork){
				valueOf(testRun, systemInfoNetwork.networkType).shouldBeString();
			}
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on Network property:' + error.message);
			
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_NETWORK, onSuccessCallback, onErrorCallback);
	}

	this.getWifiNetworkProperty = function(testRun) {
		// Test for Tizen Device API: SystemInfoWifiNetwork
		function onSuccessCallback(systemInfoWifiNetwork) {
			Ti.API.debug('Wifi network info: ' + JSON.stringify(systemInfoWifiNetwork));
			
			valueOf(testRun, systemInfoWifiNetwork).shouldBe('[object TiTizenSystemInfoSystemInfoWifiNetwork]');
			
			if (systemInfoWifiNetwork){
				valueOf(testRun, systemInfoWifiNetwork.status).shouldBeString();
				valueOf(testRun, systemInfoWifiNetwork.ssid).shouldBeString();
				valueOf(testRun, systemInfoWifiNetwork.ipAddress).shouldBeString();
				valueOf(testRun, systemInfoWifiNetwork.ipv6Address).shouldBeString();
				valueOf(testRun, systemInfoWifiNetwork.signalStrength).shouldBeNumber();
			}
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on WifiNetwork property:' + error.message);
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_WIFI_NETWORK, onSuccessCallback, onErrorCallback);
	}

	this.getCellularNetworkProperty = function(testRun) {
	// Test for Tizen Device API: SystemInfoCellularNetwork
		function onSuccessCallback(systemInfoCellularNetwork) {
			Ti.API.debug('Cellular network info: ' + JSON.stringify(systemInfoCellularNetwork));
			
			valueOf(testRun, systemInfoCellularNetwork).shouldBe('[object TiTizenSystemInfoSystemInfoCellularNetwork]');
			
			if (systemInfoCellularNetwork){
				valueOf(testRun, systemInfoCellularNetwork.status).shouldBeString();
				valueOf(testRun, systemInfoCellularNetwork.apn).shouldBeString();
				valueOf(testRun, systemInfoCellularNetwork.ipAddress).shouldBeString();
				valueOf(testRun, systemInfoCellularNetwork.ipv6Address).shouldBeString();
				valueOf(testRun, systemInfoCellularNetwork.mcc).shouldBeNumber();
				valueOf(testRun, systemInfoCellularNetwork.mnc).shouldBeNumber();
				valueOf(testRun, systemInfoCellularNetwork.cellId).shouldBeNumber();
				valueOf(testRun, systemInfoCellularNetwork.lac).shouldBeNumber();
				valueOf(testRun, systemInfoCellularNetwork.isRoaming).shouldBeBoolean();
			}
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on "CellularNetwork" property:' + error.message);
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_CELLULAR_NETWORK, onSuccessCallback, onErrorCallback);
	}

	this.getEthernetNetworkProperty = function(testRun) {
	// Test for Tizen Device API: SystemInfoEthernetNetwork
		function onSuccessCallback(systemInfoEthernetNetwork) {
			Ti.API.debug('Ethernet network info: ' + JSON.stringify(systemInfoEthernetNetwork));
			
			valueOf(testRun, systemInfoEthernetNetwork).shouldBe('[object TiTizenSystemInfoSystemInfoEthernetNetwork]');
			
			if (systemInfoEthernetNetwork){
				valueOf(testRun, systemInfoEthernetNetwork.status).shouldBeString();
				valueOf(testRun, systemInfoEthernetNetwork.ipAddress).shouldBeString();
				valueOf(testRun, systemInfoEthernetNetwork.ipv6Address).shouldBeString();
				valueOf(testRun, systemInfoEthernetNetwork.proxyAddress).shouldBeString();
				valueOf(testRun, systemInfoEthernetNetwork.macAddress).shouldBeString();
				valueOf(testRun, systemInfoEthernetNetwork.gateway).shouldBeString();
				valueOf(testRun, systemInfoEthernetNetwork.dns).shouldBeString();
				valueOf(testRun, systemInfoEthernetNetwork.subnetMask).shouldBeString();
			}
			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on EthernetNetwork property:' + error.message);
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue('EthernetNetwork', onSuccessCallback, onErrorCallback);
	}

	this.getSimProperty = function(testRun) {
	// Test for Tizen Device API: SystemInfoSIM
		function onSuccessCallback(systemInfoSIM) {
			Ti.API.debug('SIM info: ' + JSON.stringify(systemInfoSIM));
			
			valueOf(testRun, systemInfoSIM).shouldBe('[object TiTizenSystemInfoSystemInfoSIM]');
			
			if (systemInfoSIM){
				valueOf(testRun, systemInfoSIM.operatorName).shouldBeString();
				valueOf(testRun, systemInfoSIM.msisdn).shouldBeString();
				valueOf(testRun, systemInfoSIM.iccid).shouldBeString();
				valueOf(testRun, systemInfoSIM.msin).shouldBeString();
				valueOf(testRun, systemInfoSIM.spn).shouldBeString();
				valueOf(testRun, systemInfoSIM.mcc).shouldBeNumber();
				valueOf(testRun, systemInfoSIM.mnc).shouldBeNumber();
			}

			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on SIM property:' + error.message);
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_SIM, onSuccessCallback, onErrorCallback);
	}

	this.getDeviceOrientationProperty = function(testRun) {
	// Test for Tizen Device API: SystemInfoDeviceOrientation
		function onSuccessCallback(SystemInfoDeviceOrientation) {
			Ti.API.debug('Device orientation info: ' + JSON.stringify(SystemInfoDeviceOrientation));
			
			valueOf(testRun, SystemInfoDeviceOrientation).shouldBe('[object TiTizenSystemInfoSystemInfoDeviceOrientation]');
			
			if (SystemInfoDeviceOrientation){
				valueOf(testRun, SystemInfoDeviceOrientation.status).shouldBeString();
			}

			finish(testRun);
		}

		function onErrorCallback(error) {
			Ti.API.info('An error occurred on "DeviceOrientation" property:' + error.message);
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			finish(testRun);
		}

		valueOf(testRun, Ti.Tizen.SystemInfo.getPropertyValue).shouldBeFunction();
		Ti.Tizen.SystemInfo.getPropertyValue(Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_DEVICE_ORIENTATION, onSuccessCallback, onErrorCallback);
	}

	this.testListenersBattery = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_BATTERY, testRun: testRun, optionsParameter: { lowThreshold : 0.2, highThreshold: 0.8 } });
	}

	this.testListenersCpu = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_CPU, testRun: testRun, optionsParameter:{}} );
	}

	this.testListenersStorage = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_STORAGE, testRun: testRun, optionsParameter:{}} );
	}

	this.testListenersDisplay = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_DISPLAY, testRun: testRun, optionsParameter:{}} );
	}

	this.testListenersDevice = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_BUILD,testRun: testRun, optionsParameter:{} });
	}

	this.testListenersNetwork = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_NETWORK, testRun: testRun, optionsParameter:{} });
	}

	this.testListenersWifiNetwork = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_WIFI_NETWORK, testRun: testRun, optionsParameter:{} });
	}

	this.testListenersCellularNetwork = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_CELLULAR_NETWORK, testRun: testRun, optionsParameter:{} });
	}

	this.testListenersEthernetNetwork = function(testRun) {
		checkCallbackMethod( {propertyName: 'EthernetNetwork', testRun: testRun, optionsParameter:{} });
	}

	this.testListenersSIM = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_SIM, testRun: testRun, optionsParameter:{} });
	}

	this.testListenersDeviceOrientation = function(testRun) {
		checkCallbackMethod( {propertyName: Ti.Tizen.SystemInfo.SYSTEM_INFO_PROPERTY_ID_DEVICE_ORIENTATION, testRun: testRun, optionsParameter:{} });
	};

	// helper that allows to test addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions
	// will be completed in 2 sec in any case.
	function checkCallbackMethodFunction (data) {
		Ti.API.debug('Running listener check for: ' + (data?data.propertyName:'[Wrong parameter!]'));
		var id,
			testRun = data.testRun,
			waitTimeout;

		// removes current listener. Must be completed to accept valid test.
		function removeListener() {
			valueOf(testRun, id).shouldNotBeNull();
			Ti.API.debug('removing listener with ID: ' + id);
			if (id != null) {
				try{
					valueOf(testRun, Ti.Tizen.SystemInfo.removePropertyValueChangeListener).shouldBeFunction();
					Ti.Tizen.SystemInfo.removePropertyValueChangeListener(id);
				} catch(e) {
					reportError(testRun, JSON.stringify(e));
				}
			}
		}

		// If can accept test as on success callback as without it
		function onSuccessCallback(dataObject) {
			Ti.API.debug('Test completed by success callback with parameter: ' + JSON.stringify(dataObject|''));
			valueOf(testRun, dataObject).shouldBe('[object TiTizenSystemInfoSystemInfoProperty]');
			clearFakeTimeout();  // cancel fake timer call

			valueOf(testRun, dataObject).shouldNotBeNull();
			removeListener();
			finish(testRun);
		}

		// If called with not null - test failed!
		function onErrorCallback(error) {
			Ti.API.info('Test completed by error callback - ' + JSON.stringify(error));
			valueOf(testRun, error).shouldBe('[object TiTizenWebAPIError]');
			clearFakeTimeout(); // cancel fake timer call
			reportError(testRun, JSON.stringify(error));
		}

		//clears timeout if it was set before.
		function clearFakeTimeout() {
			if (waitTimeout) {
				// cancel fake call if any
				clearTimeout(waitTimeout); 
			}
		}

		// we don't need to wait for real callbacks from device,
		// as generally we are testing that we can subscribe and unsubscribe
		waitTimeout=setTimeout(function() {
			Ti.API.debug('Test completed by timeout!');
			removeListener();
			finish(testRun);
		}, 2000);

		try {
			// According to documentation:
			// 'Tizen Web App Programming' => 'Programming Guide' => 'Device' => 'Obtain Details on Basic Supported Properties'
			// devices MAY not support all properties. Some properties vary from device to device
			valueOf(testRun, Ti.Tizen.SystemInfo.addPropertyValueChangeListener).shouldBeFunction();
			
			id = Ti.Tizen.SystemInfo.addPropertyValueChangeListener(data.propertyName, onSuccessCallback, onErrorCallback, data.optionsParameter);
			valueOf(testRun, id).shouldBeGreaterThanEqual(0);
			if (id < 0) {
				clearFakeTimeout();
				Ti.API.warn('Property ' + data.propertyName + ' did not accepted listener. This may depends on device.');
				finish(testRun);
			}
		} catch(e) {
			clearFakeTimeout();
			reportError(testRun, JSON.stringify(e));
		}
	}
}
