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
        {name: "powerStateListener"}
    ]

    this.powerStateListener = function(testRun) {
        function onSuccess(){
            Ti.API.info("PowerStateListener is passed via 'onSuccess'.");
            valueOf(testRun, true).shouldBeTrue(); // test passed!
            finish(testRun);
        }

        function onError(){
            Ti.API.info("PowerStateListener failed.");
            valueOf(testRun, false).shouldBeTrue(); // test failed!
            finish(testRun);
        }

        function onChanged(resource, actualState, requestedState) {
            Ti.API.info("Strange, but we got onChanged event inside Anvil. You ary lucky!");
            Ti.API.info("State changed. Resource: " + resource + ", actualState: " + actualStateual + ", requestedState: " + requestedState);
        }

        var stateRequest = new tizen.PowerStateRequest("DISPLAY", "DISPLAY_NORMAL");
        tizen.power.request(stateRequest, onSuccess, onError, onChanged);
    }
}
