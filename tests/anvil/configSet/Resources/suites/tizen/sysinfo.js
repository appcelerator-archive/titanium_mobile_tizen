/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
    var finish;
    var valueOf;
    this.init = function(testUtils) {
        finish = testUtils.finish;
        valueOf = testUtils.valueOf;
        reportError = testUtils.reportError;
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
        {name: "getDeviceOrientationProperty"}
    ];

    // Test for Tizen Device API: SystemInfo
    this.checkSystemInfo  = function(testRun) {
        Ti.API.info("Checking 'SystemInfo' object availability.");
        valueOf(testRun, tizen).shouldBeObject();
        valueOf(testRun, tizen.systeminfo).shouldBeObject();
        finish(testRun);
    }

    // Test for Tizen Device API: do all documented properties are supported?
    this.allPropertiesSupported = function(testRun) {
        var listOfAllProperties = ["Power", "Cpu", "Storage", "Display", "Device", "Network", "WifiNetwork", "CellularNetwork", "EthernetNetwork", "SIM", "DeviceOrientation"];

        for (var i = 0; i < listOfAllProperties.length; i++) {
            var current  = listOfAllProperties[i];
            var isSupported = tizen.systeminfo.isSupported(current);

            valueOf(testRun, isSupported).shouldBeTrue(); // test passed only if all properties are supported!

            if (isSupported) {
                Ti.API.info("'"+current+"' property is supported.");
            } else {
                Ti.API.info("'"+current+"' property is not supported.");
            }
        }

        finish(testRun);
    }


    // Test for Tizen Device API: SystemInfoPower
    this.getPowerProperty = function(testRun) {
        function onSuccessCallback(power) {
            Ti.API.info("The power object:"+JSON.stringify(power));
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

    // Test for Tizen Device API: SystemInfoCpu
    this.getCpuProperty = function(testRun) {
        function onSuccessCallback(cpuData) {
            Ti.API.info("The power CPU load level is "+cpuData.load);

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


    // Test for Tizen Device API: SystemInfoStorage and SystemInfoStorageUnit
    this.getStorageProperty = function(testRun) {
        function onSuccessCallback(systemInfoStorage) {
            Ti.API.info("Storage info: " + JSON.stringify(systemInfoStorage));
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

    // Test for Tizen Device API: SystemInfoDisplay
    this.getDisplayProperty = function(testRun) {
        function onSuccessCallback(systemInfoDisplay) {
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

    // Test for Tizen Device API: SystemInfoDevice
    this.getDeviceProperty = function(testRun) {
        function onSuccessCallback(systemInfoDevice) {
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

    // Test for Tizen Device API: SystemInfoNetwork
    this.getNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoNetwork) {
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


    // Test for Tizen Device API: SystemInfoWifiNetwork
    this.getWifiNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoWifiNetwork) {
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


    // Test for Tizen Device API: SystemInfoCellularNetwork
    this.getCellularNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoCellularNetwork) {
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


    // Test for Tizen Device API: SystemInfoEthernetNetwork
    this.getEthernetNetworkProperty = function(testRun) {
        function onSuccessCallback(systemInfoEthernetNetwork) {
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

    // Test for Tizen Device API: SystemInfoSIM
    this.getSimProperty = function(testRun) {
        function onSuccessCallback(systemInfoSIM) {
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

    // Test for Tizen Device API: SystemInfoDeviceOrientation
    this.getDeviceOrientationProperty = function(testRun) {
        function onSuccessCallback(SystemInfoDeviceOrientation) {
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
}
