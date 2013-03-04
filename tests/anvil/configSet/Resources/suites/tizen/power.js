/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = 'power';
	this.tests = [
		{name: 'checkPower'},
		{name: 'powerStateListener'}
	]

	this.checkPower  = function(testRun) {
		Ti.API.debug('Checking power object availability.');
		valueOf(testRun, Ti.Tizen).shouldBeObject();
		valueOf(testRun, Ti.Tizen.Power).shouldBeObject();
		valueOf(testRun, Ti.Tizen.Power.request).shouldBeFunction();
		valueOf(testRun, Ti.Tizen.Power.release).shouldBeFunction();
		finish(testRun);
	}
	

	this.powerStateListener = function(testRun) {

		function onScreenStateChanged(previousState, changedState) {
			Ti.API.info("Screen state changed from " + previousState + " to " + changedState);
			Ti.Tizen.Power.turnScreenOn();
			finish(testRun);
		}

		valueOf(testRun, function() {
			Ti.Tizen.Power.request(Ti.Tizen.Power.POWER_RESOURCE_SCREEN, Ti.Tizen.Power.POWER_SCREEN_STATE_SCREEN_NORMAL);
		}).shouldNotThrowException();

		valueOf(testRun, function() {
			Ti.Tizen.Power.turnScreenOn();
		}).shouldNotThrowException();

		valueOf(testRun, function() {
			Ti.Tizen.Power.setScreenStateChangeListener(onScreenStateChanged);
		}).shouldNotThrowException();

		valueOf(testRun, function() {
			Ti.Tizen.Power.turnScreenOff();
		}).shouldNotThrowException();
	}
}
