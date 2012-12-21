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
	var adapter;// = tizen.bluetooth.getDefaultAdapter();
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "bluetooth";
	this.tests = [
		{name: "testObjectsAndInitialization"},
		{name: "test2", timeout: 5000},
		{name: "test3", timeout: 2000}
	]

	this.test1 = function(testRun) {
		valueOf(testRun, tizen.bluetooth).shouldBeObject();
		
		adapter = tizen.bluetooth.getDefaultAdapter();
		
		valueOf(testRun, adapter).shouldBeObject();

		finish(testRun);
	}
	
	this.test2 = function(testRun) {
		if(adapter){

		}
		finish(testRun);
	}
	
	this.test3 = function(testRun) {
		if(adapter){
		}
		finish(testRun);
	}
}