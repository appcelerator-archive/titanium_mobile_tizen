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

    this.name = "power";
    this.tests = [
        {name: "checkPower"},
        {name: "powerStateListener"}
    ]

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Test for Tizen Device API: SystemInfo
    this.checkPower  = function(testRun) {
        Ti.API.debug("Checking 'power' object availability.");
        valueOf(testRun, tizen).shouldBeObject();
        valueOf(testRun, tizen.power).shouldBeObject();
        valueOf(testRun, tizen.power.request).shouldBeFunction();
        valueOf(testRun, tizen.power.release).shouldBeFunction();
        finish(testRun);
    }

    this.powerStateListener = function(testRun) {
        var stateRequest = null;
        function onSuccess(){
            Ti.API.debug("PowerStateListener is set.");
            waitTimeout=setTimeout(function(){
                Ti.API.debug("Test completed by timeout!");
                valueOf(testRun, true).shouldBeTrue(); // test passed!
                try{
                    tizen.power.release("DISPLAY");
                }catch (e){
                    reportError(testRun, JSON.stringify(e));
                }
                finish(testRun);
            },2000);
        }

        function onError(){
            Ti.API.info("PowerStateListener failed.");
            valueOf(testRun, false).shouldBeTrue(); // test failed!
            finish(testRun);
        }

        function onChanged(resource, actualState, requestedState) {
            Ti.API.debug("Strange, but we got onChanged event inside Anvil. You ary lucky!");
            Ti.API.debug("State changed. Resource: " + resource + ", actualState: " + actualStateual + ", requestedState: " + requestedState);
            // we are finishing test with onSuccess\onError. So we don't need anything related to anvil here.
        }

        stateRequest = new tizen.PowerStateRequest("DISPLAY", "DISPLAY_NORMAL");
        tizen.power.request(stateRequest, onSuccess, onError, onChanged);
    }
}