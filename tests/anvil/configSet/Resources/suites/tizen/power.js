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
		var stateRequest = null;
		function onSuccess(){
			Ti.API.debug('PowerStateListener is set.');
			waitTimeout = setTimeout(function() {
				Ti.API.debug('Test completed by timeout!');
				valueOf(testRun, true).shouldBeTrue();
				try{
					Ti.Tizen.Power.release('DISPLAY');
				}catch (e){
					reportError(testRun, JSON.stringify(e));
				}
				finish(testRun);
			}, 2000);
		}

		function onError(){
			Ti.API.info('PowerStateListener failed.');
			valueOf(testRun, false).shouldBeTrue();
			finish(testRun);
		}

		function onChanged(resource, actualState, requestedState) {
			Ti.API.debug('Strange, but we got onChanged event inside Anvil. You ary lucky!');
			Ti.API.debug('State changed. Resource: ' + resource + ', actualState: ' + actualStateual + ', requestedState: ' + requestedState);
		}

		stateRequest = Ti.Tizen.Power.createPowerStateRequest({
			resource: 'DISPLAY',
			state: 'DISPLAY_NORMAL'
		});
		Ti.Tizen.Power.request(stateRequest, onSuccess, onError, onChanged);
	}
}
