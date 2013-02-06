/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf;
	
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
		var buttons = ['Confirm', 'Cancel', 'Help'],
			dialog = Ti.UI.createAlertDialog({
				message: 'Would you like to delete the file?',
				title: 'Delete'
			});

		dialog.buttonNames = buttons;
		var gottenButtons = dialog.getButtonNames();
		for(var i = 0; i < gottenButtons.length; i++){
			buttons[i] && valueOf(testRun, gottenButtons[i]).shouldBe(buttons[i]);
		}
		finish(testRun);
	}

	this.testCancel = function(testRun) {
		var cancel = 1,
			dialog = Ti.UI.createAlertDialog({
				buttonNames: ['Confirm', 'Cancel', 'Help'],
				message: 'Would you like to delete the file?',
				title: 'Delete'
			});

		dialog.cancel = cancel;
		var gotten_cancel = dialog.getCancel();
		valueOf(testRun, dialog.getCancel()).shouldBe(cancel);
		finish(testRun);
	}

	this.testOk = function(testRun) {
		var ok = 'Delete',
				dialog = Ti.UI.createAlertDialog({
					buttonNames: ['Confirm', 'Cancel', 'Help'],
					message: 'Would you like to delete the file?',
					title: 'Delete'
			});
		
		dialog.ok = ok;
		var gottenOk = dialog.getOk();
		valueOf(testRun, gottenOk).shouldBe(ok);
		finish(testRun);
	}

	this.testMessage = function(testRun) {
		var message = "my message",
			dialog = Ti.UI.createAlertDialog({
				cancel: 1,
				buttonNames: ['Confirm', 'Cancel', 'Help'],
				title: 'Delete'
			});

		dialog.message = message;
		var gottenMessage = dialog.getMessage();
		valueOf(testRun, gottenMessage).shouldBe(message);
		finish(testRun);
	}

	this.testTitle = function(testRun) {
		var title = 'ALERT',
			dialog = Ti.UI.createAlertDialog({
				cancel: 1,
				buttonNames: ['Confirm', 'Cancel', 'Help'],
				message: 'Would you like to delete the file?',
			});

		dialog.title = title;
		var gottenTitle = dialog.getTitle();
		valueOf(testRun, gottenTitle).shouldBe(title);
		finish(testRun);
	}

}