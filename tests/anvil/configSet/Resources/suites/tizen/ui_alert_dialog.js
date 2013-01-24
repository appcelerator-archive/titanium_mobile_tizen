/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */


module.exports = new function() {
	var finish;
	var valueOf;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "notification";
	this.tests = [
		{name: "showHide"},
		{name: "testButtons"},
		{name: "testCancel"},
		{name: "testOk"},
		{name: "testMessage"},
		{name: "testTitle"}
	]

	this.showHide = function(testRun) {
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Confirm', 'Cancel', 'Help'],
		    message: 'Would you like to delete the file?',
		    title: 'Delete'
		});

		Ti.API.info(dialog.message);

		valueOf(testRun, function(){
			dialog.show();
		}).shouldNotThrowException();
		valueOf(testRun, function(){
			dialog.hide();
		}).shouldNotThrowException();
		
      	finish(testRun);
	}

	this.testButtons = function(testRun) {
		var dialog = Ti.UI.createAlertDialog({
		    message: 'Would you like to delete the file?',
		    title: 'Delete'
		});

		var buttons = ['Confirm', 'Cancel', 'Help'];
		dialog.buttonNames = buttons;

		var gotten_buttons = dialog.getButtonNames();

		for(var i = 0; i < gotten_buttons.length; i++){
			buttons[i] && valueOf(testRun, gotten_buttons[i]).shouldBe(buttons[i]);
		}
		
      	finish(testRun);
	}

	this.testCancel = function(testRun) {
		var dialog = Ti.UI.createAlertDialog({
		    buttonNames: ['Confirm', 'Cancel', 'Help'],
		    message: 'Would you like to delete the file?',
		    title: 'Delete'
		});

		var cancel = 1;

		dialog.cancel = cancel;

		var gotten_cancel = dialog.getCancel();
		
		valueOf(testRun, gotten_cancel).shouldBe(cancel);

      	finish(testRun);
	}

	this.testOk = function(testRun) {
		var dialog = Ti.UI.createAlertDialog({
		    buttonNames: ['Confirm', 'Cancel', 'Help'],
		    message: 'Would you like to delete the file?',
		    title: 'Delete'
		});

		var ok = 'Delete';

		dialog.ok = ok;

		var gotten_ok = dialog.getOk();

		valueOf(testRun, gotten_ok).shouldBe(ok);

      	finish(testRun);
	}

	this.testMessage = function(testRun) {
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Confirm', 'Cancel', 'Help'],
		    title: 'Delete'
		});

		var message = "my message";

		dialog.message = message;

		var gotten_message = dialog.getMessage();

		valueOf(testRun, gotten_message).shouldBe(message);

      	finish(testRun);
	}

	this.testTitle = function(testRun) {
		var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Confirm', 'Cancel', 'Help'],
		    message: 'Would you like to delete the file?',
		});

		var title = 'ALERT';

		dialog.title = title;

		var gotten_title = dialog.getTitle();
		
		valueOf(testRun, gotten_title).shouldBe(title);

      	finish(testRun);
	}

}