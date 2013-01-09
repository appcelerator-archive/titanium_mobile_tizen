/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
    var finish;
    var valueOf;
    var reportError;
    this.init = function(testUtils) {
        finish = testUtils.finish;
        valueOf = testUtils.valueOf;
        reportError = testUtils.reportError;
    }

    this.name = "gesture";
    this.tests = [
        {name: "gestureBasic"},
        {name: "gestureEventOrientationChange"},
        {name: "gestureEventShake"}
    ]

    this.gestureBasic = function(testRun) {
        valueOf(testRun, Ti.Accelerometer).shouldBeObject();
        if (Ti.Accelerometer){
            valueOf(testRun, Ti.Gesture.addEventListener).shouldBeFunction();
            valueOf(testRun, Ti.Gesture.removeEventListener).shouldBeFunction();
            valueOf(testRun, Ti.Gesture.fireEvent).shouldBeFunction();

            valueOf(testRun, Ti.Gesture.landscape).shouldBeBoolean();
            valueOf(testRun, Ti.Gesture.portrait).shouldBeBoolean();
            valueOf(testRun, Ti.Gesture.orientation).shouldBeNumber();
        }
        finish(testRun);
    }

    this.gestureEventOrientationChange = function(testRun) {
        var gestureTestCallback = function(e) {
            valueOf(testRun, e).shouldBeObject();
            valueOf(testRun, e.orientation).shouldBe(1);

            setTimeout(function(){
                try{
                    Ti.Gesture.removeEventListener('orientationchange', gestureTestCallback);
                }catch (e){
                    reportError(testRun, JSON.stringify(e));
                }
                finish(testRun);
            },1000);
        };

        Ti.Gesture.addEventListener('orientationchange', gestureTestCallback);
        Ti.Gesture.fireEvent("orientationchange", { orientation: 1 });
    }

    this.gestureEventShake = function(testRun) {
        var gestureTestCallback = function(e) {
            valueOf(testRun, e).shouldBeObject();
            valueOf(testRun, e.timestamp).shouldBe(0);
            valueOf(testRun, e.x).shouldBe(1);
            valueOf(testRun, e.y).shouldBe(2);
            valueOf(testRun, e.z).shouldBe(3);

            setTimeout(function(){
                try{
                    Ti.Gesture.removeEventListener('shake', gestureTestCallback);
                }catch (e){
                    reportError(testRun, JSON.stringify(e));
                }
                finish(testRun);
            },1000);
        };

        Ti.Gesture.addEventListener('shake', gestureTestCallback);
        Ti.Gesture.fireEvent("shake", { x: 1, y: 2, z: 3, source: this, timestamp: 0});
    }

}
