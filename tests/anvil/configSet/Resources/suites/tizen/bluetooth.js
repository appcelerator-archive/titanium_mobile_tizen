/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
/**
 Check tizen.bluetooth avalability
 check result for tizen.bluetooth.getDefaultAdapter();

*/

module.exports = new function() {
	var finish;
	var valueOf;
	var reportError;
	var adapter;
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = "bluetooth";
	this.tests = [
		{name: "testObjectsAndInitialization"},
		{name: "powerOn", timeout: 5000},
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

	this.PowerOff = function(testRun) {
		valueOf(testRun, adapter).shouldBeObject();
		valueOf(testRun, adapter.powered).shouldBeTrue();
		var onBluetoothError = function(e) {
			reportError(testRun, 'Error in powerOn test: ' + e.message);
		}

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