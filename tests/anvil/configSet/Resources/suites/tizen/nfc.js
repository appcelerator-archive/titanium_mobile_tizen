/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
/**
 Check tizen.nfc avalability
 tizen.nfc.getDefaultAdapter

*/

module.exports = new function() {
	var finish;
	var valueOf;
	var adapter;// = tizen.bluetooth.getDefaultAdapter();
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		adapter = tizen.nfc.getDefaultAdapter();
	}

	this.name = "nfc";
	this.tests = [
		{name: "testObjectsAndInitialization"},
		{name: "test2", timeout: 5000},
		{name: "test3", timeout: 2000}
	]

	this.testObjectsAndInitialization = function(testRun) {
		valueOf(testRun, tizen.nfc).shouldBeObject();
		valueOf(testRun, adapter).shouldBeObject();
		finish(testRun);
	}
	
	this.test2 = function(testRun) {
		valueOf(testRun, tizen.nfc).shouldBeObject();
		finish(testRun);
	}
	
	this.test3 = function(testRun) {
		valueOf(testRun, tizen.nfc).shouldBeObject();
		finish(testRun);
	}
}