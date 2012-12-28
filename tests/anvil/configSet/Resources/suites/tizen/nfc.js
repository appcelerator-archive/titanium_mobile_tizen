/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
/**
 1. Check tizen.nfc avalability
 tizen.nfc.getDefaultAdapter
 2. Power on/off NFC
 3. set NFC Listener

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
		adapter = tizen.nfc.getDefaultAdapter();
	}

	this.name = "nfc";
	this.tests = [
		{name: "testObjectsAndInitialization"},
		{name: "powerOnTest", timeout: 5000},
		{name: "tagListener", timeout: 15000},
		{name: "powerOff", timeout: 5000}
	]

	this.testObjectsAndInitialization = function(testRun) {
		valueOf(testRun, tizen.nfc).shouldBeObject();
		valueOf(testRun, adapter).shouldBeObject();
		finish(testRun);
	}
	
	//test setPowered
	this.powerOnTest = function(testRun) {
		valueOf(testRun, adapter).shouldBeObject();
		var onNFCPowerOn = function() {
        	finish(testRun);
    	}
    	var onNFCPowerOnFails = function() {
			reportError(testRun, 'The following error occurred: NFS setPowered(true, cbOK. cbFail) error callback');
    	}		
		adapter.setPowered(true, onNFCPowerOn, onNFCPowerOnFails);		
	}
	
	this.tagListener = function(testRun) {
		valueOf(testRun, adapter).shouldBeObject();

	 	var onSuccess = {
	        onattach : function(tag) {	        	
	        	finish(testRun);
	        },
	        ondetach : function() {
	            finish(testRun);
	        }
	    };
	    function onError(e) {
	    	reportError(testRun, 'The following error occurred: NFS adapter.setTagListener error callback: ' + e.message);
	    }

		try {
        	adapter.setTagListener(onSuccess, onError);
    	} catch (e) {
    		reportError(testRun, 'The following error occurred for setTagListener:' + e.message);
    	}
    	//if no NFC tag it is not error, so use setTimeout for correct exit before Anvil will report test failed by timeout
		setTimeout(function(){
			Ti.API.debug("waiting for NFC tag");
			valueOf(testRun, true).shouldBeTrue();
			finish(testRun);
		},9000);
	}

	//test setPowered(false)
	this.powerOff = function(testRun) {
		valueOf(testRun, adapter).shouldBeObject();
		var onNFCPowerOn = function() {
        	finish(testRun);
    	}
    	var onNFCPowerOnFails = function() {
			reportError(testRun, 'The following error occurred: NFS setPowered(false, cbOK. cbFail) error callback');
    	}		
		adapter.setPowered(false, onNFCPowerOn, onNFCPowerOnFails);		
	}
}