/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
    var finish;
    var valueOf;
    var checkCallbackMethod;
    var reportError;
    this.init = function(testUtils) {
        finish = testUtils.finish;
        valueOf = testUtils.valueOf;
        reportError = testUtils.reportError;
        checkCallbackMethod = checkCallbackMethodFunction;
    }

    this.name = "sysinfo";
    this.tests = [
        {name: "checkSystemInfo"},
        {name: "allPropertiesSupported"},
        {name: "getPowerProperty"},
        {name: "getCpuProperty"},
        {name: "getStorageProperty"},
        {name: "getDisplayProperty"},
        {name: "getDeviceProperty"},
        {name: "getNetworkProperty"},
        {name: "getWifiNetworkProperty"},
        {name: "getCellularNetworkProperty"},
        {name: "getEthernetNetworkProperty"},
        {name: "getSimProperty"},
        {name: "getDeviceOrientationProperty"},
        {name: "testListenersPower"},
        {name: "testListenersCpu"},
        {name: "testListenersStorage"},
        {name: "testListenersDisplay"},
        {name: "testListenersDevice"},
        {name: "testListenersDeviceOrientation"},
        {name: "testListenersSIM"},
        {name: "testListenersEthernetNetwork"},
        {name: "testListenersCellularNetwork"},
        {name: "testListenersWifiNetwork"},
        {name: "testListenersNetwork"}
    ];

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfo
    this.checkSystemInfo  = function(testRun) {
        Ti.API.debug("Checking 'SystemInfo' object availability.");
        valueOf(testRun, tizen).shouldBeObject();
        valueOf(testRun, tizen.systeminfo).shouldBeObject();
        finish(testRun);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: do all documented properties are supported?
    this.allPropertiesSupported = function(testRun) {
        // according to "Tizen Web App Programming" => "Programming Guide" => "Device" => "SystemInfo"
        // Basic Supported Properties are: Power, Cpu, Storage, Display, Device, WifiNetwork, CellularNetwork.
        // And "Network", "EthernetNetwork", "SIM", "DeviceOrientation" are NOT "Basic Supported Properties" and depends on device
        var listOfAllProperties = ["Power", "Cpu", "Storage", "Display", "Device", "Network", "WifiNetwork", "CellularNetwork", "EthernetNetwork", "SIM", "DeviceOrientation"];

        for (var i = 0; i < listOfAllProperties.length; i++) {
            var current  = listOfAllProperties[i];
            try{
                var isSupported = tizen.systeminfo.isSupported(current);

                valueOf(testRun, isSupported).shouldBeTrue(); // test passed only if all properties are supported!

                if (isSupported) {
                    Ti.API.debug("'"+current+"' property is supported.");
                } else {
                    Ti.API.debug("'"+current+"' property is not supported.");
                }
            }catch (e) {
                Ti.API.warn("'"+current+"' property cause exception: " + e.message);
                reportError(testRun, JSON.stringify(e));
            }
        }

        finish(testRun);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoPower
    this.getPowerProperty = function(testRun) {
        function onSuccessCallback(power) {
            Ti.API.debug("The power object:"+JSON.stringify(power));
            valueOf(testRun, power.level).shouldBeNumber();
            valueOf(testRun, power.isCharging).shouldBeBoolean();
            finish(testRun);
        }

        function onErrorCallback(error) {
            Ti.API.info("An error occurred on 'Power' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("Power", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoCpu
    this.getCpuProperty = function(testRun) {
        function onSuccessCallback(cpuData) {
            Ti.API.debug("The power CPU load level is "+cpuData.load);

            valueOf(testRun, cpuData.load).shouldBeNumber(); // double!
            finish(testRun);
        }

        function onErrorCallback(error) {
            Ti.API.info("An error occurred on 'Cpu' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("Cpu", onSuccessCallback, onErrorCallback);
    }


    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoStorage and SystemInfoStorageUnit
    this.getStorageProperty = function(testRun) {
        function onSuccessCallback(systemInfoStorage) {
            Ti.API.debug("Storage info: " + JSON.stringify(systemInfoStorage));
            // [ALERT!]
            // Real world's API is STANGE! recheck it later against doc!!!
            // Why there is no systemInfoStorage.units as in doc?!

            //valueOf(testRun, systemInfoStorage.units).shouldBeArray(); // array of SystemInfoStorageUnit[]
            valueOf(testRun, systemInfoStorage).shouldBeArray(); // array of SystemInfoStorageUnit[]

            //if (systemInfoStorage.units){
            if (systemInfoStorage){
                //for (var i = 0; i < systemInfoStorage.units.length; i++) {
                for (var i = 0; i < systemInfoStorage.length; i++) {
                    //var current  = systemInfoStorage.units[i];
                    var current  = systemInfoStorage[i];
                    valueOf(testRun, current).shouldBeObject(); // SystemInfoStorageUnit
                }
            }
            finish(testRun);
        }

        function onErrorCallback(error) {
            Ti.API.info("An error occurred on 'Storage' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("Storage", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoDisplay
    this.getDisplayProperty = function(testRun) {
        function onSuccessCallback(systemInfoDisplay) {
            Ti.API.debug("Display info: " + JSON.stringify(systemInfoDisplay));
            valueOf(testRun, systemInfoDisplay).shouldBeObject();
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
            Ti.API.info("An error occurred on 'Display' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("Display", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoDevice
    this.getDeviceProperty = function(testRun) {
        function onSuccessCallback(systemInfoDevice) {
            Ti.API.debug("Device info: " + JSON.stringify(systemInfoDevice));
            valueOf(testRun, systemInfoDevice).shouldBeObject();
            if (systemInfoDevice){
                valueOf(testRun, systemInfoDevice.imei).shouldBeString();
                valueOf(testRun, systemInfoDevice.model).shouldBeString();
                valueOf(testRun, systemInfoDevice.version).shouldBeString();
                valueOf(testRun, systemInfoDevice.vendor).shouldBeString();
            }
            finish(testRun);
        }

        function onErrorCallback(error) {
            Ti.API.info("An error occurred on 'Device' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("Device", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoNetwork
    this.getNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoNetwork) {
            Ti.API.debug("Network info: " + JSON.stringify(systemInfoNetwork));
            valueOf(testRun, systemInfoNetwork).shouldBeObject();
            if (systemInfoNetwork){
                // enum SystemInfoNetworkType { "NONE", "2G", "2.5G", "3G", "4G", "WIFI", "ETHERNET", "UNKNOWN" };
                valueOf(testRun, systemInfoNetwork.networkType).shouldBeNumber();
            }
            finish(testRun);
        }

        function onErrorCallback(error) {
            Ti.API.info("An error occurred on 'Network' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("Network", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoWifiNetwork
    this.getWifiNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoWifiNetwork) {
            Ti.API.debug("Wifi network info: " + JSON.stringify(systemInfoWifiNetwork));
            valueOf(testRun, systemInfoWifiNetwork).shouldBeObject();
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
            Ti.API.info("An error occurred on 'WifiNetwork' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("WifiNetwork", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoCellularNetwork
    this.getCellularNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoCellularNetwork) {
            Ti.API.debug("Cellular network info: " + JSON.stringify(systemInfoCellularNetwork));
            valueOf(testRun, systemInfoCellularNetwork).shouldBeObject();
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
            Ti.API.info("An error occurred on 'CellularNetwork' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("CellularNetwork", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoEthernetNetwork
    this.getEthernetNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoEthernetNetwork) {
            Ti.API.debug("Ethernet network info: " + JSON.stringify(systemInfoEthernetNetwork));
            valueOf(testRun, systemInfoEthernetNetwork).shouldBeObject();
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
            Ti.API.info("An error occurred on 'EthernetNetwork' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("EthernetNetwork", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoSIM
    this.getSimProperty = function(testRun) {
        function onSuccessCallback(systemInfoSIM) {
            Ti.API.debug("SIM info: " + JSON.stringify(systemInfoSIM));
            valueOf(testRun, systemInfoSIM).shouldBeObject();
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
            Ti.API.info("An error occurred on 'SIM' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("SIM", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfoDeviceOrientation
    this.getDeviceOrientationProperty = function(testRun) {
        function onSuccessCallback(SystemInfoDeviceOrientation) {
            Ti.API.debug("Device orientation info: " + JSON.stringify(SystemInfoDeviceOrientation));
            valueOf(testRun, SystemInfoDeviceOrientation).shouldBeObject();
            if (SystemInfoDeviceOrientation){
                //enum SystemInfosDeviceOrientationStatus { "portrait-primary", "portrait-secondary", "landscape-primary", "landscape-secondary" };
                valueOf(testRun, SystemInfoDeviceOrientation.status).shouldBeNumber();
            }

            finish(testRun);
        }

        function onErrorCallback(error) {
            Ti.API.info("An error occurred on 'DeviceOrientation' property:" + error.message);
            valueOf(testRun, false).shouldBeTrue();
            finish(testRun);
        }

        tizen.systeminfo.getPropertyValue("DeviceOrientation", onSuccessCallback, onErrorCallback);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: power
    this.testListenersPower = function(testRun) {
        checkCallbackMethod({propertyName:"Power",testRun: testRun,optionsParameter:{lowThreshold : 0.2, highThreshold: 0.8}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: Cpu
    this.testListenersCpu = function(testRun) {
        checkCallbackMethod({propertyName:"Cpu",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: Storage
    this.testListenersStorage = function(testRun) {
        checkCallbackMethod({propertyName:"Storage",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: Display
    this.testListenersDisplay = function(testRun) {
        checkCallbackMethod({propertyName:"Display",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: Device
    this.testListenersDevice = function(testRun) {
        checkCallbackMethod({propertyName:"Device",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: Network
    this.testListenersNetwork = function(testRun) {
        checkCallbackMethod({propertyName:"Network",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: WifiNetwork
    this.testListenersWifiNetwork = function(testRun) {
        checkCallbackMethod({propertyName:"WifiNetwork",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: CellularNetwork
    this.testListenersCellularNetwork = function(testRun) {
        checkCallbackMethod({propertyName:"CellularNetwork",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: EthernetNetwork
    this.testListenersEthernetNetwork = function(testRun) {
        checkCallbackMethod({propertyName:"EthernetNetwork",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: SIM
    this.testListenersSIM = function(testRun) {
        checkCallbackMethod({propertyName:"SIM",testRun: testRun,optionsParameter:{}});
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions.
    // testing value: DeviceOrientation
    this.testListenersDeviceOrientation = function(testRun) {
        checkCallbackMethod({propertyName:"DeviceOrientation",testRun: testRun,optionsParameter:{}});
    };

    // function helper.
    // Allows to test addPropertyValueChangeListener, removePropertyValueChangeListener, SystemInfoOptions
    // will be completed in 2 sec in any case.
    function checkCallbackMethodFunction (data) {
        Ti.API.debug("Running listener check for: "+(data?data.propertyName:"[Wrong parameter!]"));

        var id = null;
        var testRun = data.testRun;
        var waitTimeout = null;

        // removes current listener. Must be completed to accept valid test.
        function removeListener(){
            valueOf(testRun, id).shouldNotBeNull();
            Ti.API.debug("removing listener with ID: " + id);
            if (id != null){
                try{
                    tizen.systeminfo.removePropertyValueChangeListener(id);
                } catch(e) {
                    reportError(testRun, JSON.stringify(e));
                }
            }
        }

        // If can accept test as on success callback as without it
        function onSuccessCallback(dataObject) {
            Ti.API.debug("Test completed by success callback with parameter: "+JSON.stringify(dataObject|""));
            clearFakeTimeout();  // cancel fake timer call

            valueOf(testRun, dataObject).shouldNotBeNull();
            removeListener();
            finish(testRun);
        }

        // If called with not null - test failed!
        function onErrorCallback(error) {
            Ti.API.info("Test completed by error callback - "+JSON.stringify(error));
            clearFakeTimeout();  // cancel fake timer call
            reportError(testRun, JSON.stringify(error));
        }

        //clears timeout if it was set before.
        function clearFakeTimeout()
        {
            if (waitTimeout){
                clearTimeout(waitTimeout); // cancel fake call if any
            }
        }

        // we don't need to wait for real callbacks from device,
        // as generally we are testing that we can subscribe and unsubscribe
        waitTimeout=setTimeout(function(){
            Ti.API.debug("Test completed by timeout!");
            removeListener();
            finish(testRun);
        },2000);

        try{
            // According to documentation:
            // "Tizen Web App Programming" => "Programming Guide" => "Device" => "Obtain Details on Basic Supported Properties"
            // devices MAY not support all properties. Some properties vary from device to device
            id = tizen.systeminfo.addPropertyValueChangeListener(data.propertyName, onSuccessCallback, onErrorCallback, data.optionsParameter);

            valueOf(testRun, id).shouldBeGreaterThanEqual(0);
            if (id < 0)
            {
                clearFakeTimeout();
                Ti.API.warn("Property '"+data.propertyName+"' did not accepted listener. This may depends on device.");
                finish(testRun);
            }
        } catch(e) {
            clearFakeTimeout();
            reportError(testRun, JSON.stringify(e));
        }
    }
}
