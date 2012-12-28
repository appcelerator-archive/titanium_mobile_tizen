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

    this.name = "accelerometer";
    this.tests = [
        {name: "accelerometerBasic"},
        {name: "accelerometerEvent"}
    ]

    this.accelerometerBasic = function(testRun) {
        valueOf(testRun, Ti.Accelerometer).shouldBeObject();
        if (Ti.Accelerometer){
            valueOf(testRun, Ti.Accelerometer.addEventListener).shouldBeFunction();
            valueOf(testRun, Ti.Accelerometer.removeEventListener).shouldBeFunction();
            valueOf(testRun, Ti.Accelerometer.fireEvent).shouldBeFunction();
        }
        finish(testRun);
    }

    this.accelerometerEvent = function(testRun) {
        var accelerometerTestCallback = function(e) {
            valueOf(testRun, e).shouldBeObject();
            valueOf(testRun, e.timestamp).shouldBe(0);
            valueOf(testRun, e.x).shouldBe(1);
            valueOf(testRun, e.y).shouldBe(2);
            valueOf(testRun, e.z).shouldBe(3);

            setTimeout(function(){
                try{
                    Ti.Accelerometer.removeEventListener('update', accelerometerTestCallback);
                }catch (e){
                    reportError(testRun, JSON.stringify(e));
                }
                finish(testRun);
            },1000);
        };

        Ti.Accelerometer.addEventListener('update', accelerometerTestCallback);
        Ti.Accelerometer.fireEvent("update", { x: 1, y: 2, z: 3, source: this, timestamp: 0});
    }
}
