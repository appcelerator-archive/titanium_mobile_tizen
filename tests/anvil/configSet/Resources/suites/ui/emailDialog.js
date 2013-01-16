/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */
if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb') {
    Ti.include('countPixels.js');
}
module.exports = new function() {
	var finish;
	var valueOf;
        
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "emailDialog";
	this.tests = [
		{name: "basic", timeout: 10000},
		
	]

	this.basic = function(testRun) {
            console.log('start');
            var emailDialog = Ti.UI.createEmailDialog();
            emailDialog.toRecipients = ['foo@yahoo.com'];
            emailDialog.subject = "Hello from Titanium";
            emailDialog.messageBody = '<b>Appcelerator Titanium Rocks!</b>';
            emailDialog.open();
            
            emailDialog.addEventListener('complete', function(){
                 console.log('end');
                finish(testRun);
            });
        }
}