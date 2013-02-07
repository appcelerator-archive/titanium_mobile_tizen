/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		reportError,
		adapter;
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = "bluetooth";
	this.tests = [
		{name: "testObjectsAndInitialization"},
		{name: "powerOn", timeout: 5000},
		{name: "discoverDevices", timeout: 15000},
		{name: "bluetoothFindDevice", timeout: 10000},
		{name: "PowerOff", timeout: 4000}
	]

	this.testObjectsAndInitialization = function(testRun) {
		valueOf(testRun, tizen.bluetooth).shouldBeObject();		
		adapter = tizen.bluetooth.getDefaultAdapter();		
		valueOf(testRun, adapter).shouldBeObject();
		finish(testRun);
	}
	
	this.powerOn = function(testRun) {
		valueOf(testRun, adapter).shouldBeObject();

		var onBluetoothError = function(e) {
			reportError(testRun, 'Error in powerOn test: ' + e.message);
		}

		try {
			adapter.setPowered(true,			
				function() {
					finish(testRun);
				}, 
				onBluetoothError
			);
		} catch (exc) {
			reportError(testRun, 'Exception in powerOn setPowered(): ' + exc.message);
		}
	}

	this.discoverDevices = function(testRun){
		var onBluetoothError = function(e) {
				reportError(testRun, 'Error in discoverDevices test: ' + e.message);
			},		
			onStartedReceived = false, //test should receiVe callback "Discovery started" always
			discoverDevicesWatcher = {
				onstarted: function() {
					//Device discovery started.
					onStartedReceived = true;
				},
				ondevicefound: function(device) {
					//We found something, unit tests really does not expect to have 
					// any devices available, but it is possible situation
					//when there is some device nearby
					valueOf(testRun, device.name).shouldBeObject();
					valueOf(testRun, device.address).shouldBeObject();
					valueOf(testRun, onStartedReceived).shouldBeTrue();
					try {
						adapter.stopDiscovery(
							function() {
								//Device discovery stopped 
								finish(testRun);
							},
							onBluetoothError);
					} catch (exc) {
						reportError(testRun, 'Exception in stop ondevicefound after stopDiscovery:' + exc.message);
					}
				},
				ondevicedisappeared: function(address) {
					//Device disappeared
					valueOf(testRun, onStartedReceived).shouldBeTrue();
					finish(testRun);
				},
				onfinished: function(devices) {
					//Info: device not found
					valueOf(testRun, onStartedReceived).shouldBeTrue();
					finish(testRun);
				}
			};
		//check is adapter available and powered on
		valueOf(testRun, adapter).shouldBeObject();
		valueOf(testRun, adapter.powered).shouldBeTrue();
		try {
			adapter.discoverDevices(discoverDevicesWatcher, onBluetoothError);
		} catch (exc) {
			reportError(testRun, 'Exception in stop discoverDevices after discoverDevices:' + exc.message);
		}
	}

	this.bluetoothFindDevice = function(testRun) {
		var onBluetoothError = function(e) {
			reportError(testRun, 'Error in bluetoothFindDevice test: ' + e.message);
		};
		valueOf(testRun, adapter).shouldBeObject();
		valueOf(testRun, adapter.powered).shouldBeTrue();
		try {
			adapter.getKnownDevices(
				function(devices){
					for (var i = 0; i < devices.length; i++) {
						valueOf(testRun, devices[i]).shouldBeObject();
					}
					finish(testRun);
				}, 
				onBluetoothError);
		} catch (exc) {
			reportError(testRun, 'Exception in stop ondevicefound after stopDiscovery:' + exc.message);
		}
	}

	this.PowerOff = function(testRun) {
		var onBluetoothError = function(e) {
			reportError(testRun, 'Error in powerOn test: ' + e.message);
		}
		valueOf(testRun, adapter).shouldBeObject();
		valueOf(testRun, adapter.powered).shouldBeTrue();
		try {
			adapter.setPowered(false,			
				function() {
					finish(testRun);
				}, 
				onBluetoothError
			);
		} catch (exc) {
			reportError(testRun, 'Exception in powerOn setPowered(): ' + exc.message);
		}
	}
}
