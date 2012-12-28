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

	this.name = "ui_option_dialog";
	this.tests = [
		{name: "showHide"},
		{name: "testOptions"},
		{name: "testCancel"},
		{name: "testDestructive"},
		{name: "testTizenView"},
		{name: "testTitle"}
	]

	this.showHide = function(testRun) {
		var wind = Ti.UI.createWindow();

		var optionsDialogOpts = {
			options:['Option 1', 'Option 2', 'Option 3', 'Option 4'],
			destructive:1,
			cancel:2,
			title:'I am a title'
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

		wind.addEventListener('open', function(){
			console.log(testRun.resultSet);
			valueOf(testRun, function(){
				dialog.show();
			}).shouldNotThrowException();
			hide();
		});

		wind.open();
		
		function hide(){
			setTimeout(function(){
				valueOf(testRun, function(){
				 	dialog.hide();
				}).shouldNotThrowException();
				wind.close();
				finish(testRun);
			}, 2000);
		}

	}

	this.testOptions = function(testRun) {
		var optionsDialogOpts = {
			destructive:1,
			cancel:2,
			title:'I am a title'
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

		var buttons = ['Option 1', 'Option 2', 'Option 3', 'Option 4'];
		dialog.options = buttons;

		var gotten_options = dialog.getOptions();

		for(var i = 0; i < gotten_options.length; i++){
			buttons[i] && valueOf(testRun, gotten_options[i]).shouldBe(buttons[i]);
		}
		
      	finish(testRun);
	}

	this.testCancel = function(testRun) {
		var optionsDialogOpts = {
			options:['Option 1', 'Option 2', 'Option 3', 'Option 4'],
			destructive:1,
			title:'I am a title'
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

		var cancel = 2;

		dialog.cancel = cancel;

		var gotten_cancel = dialog.getCancel();
		
		valueOf(testRun, gotten_cancel).shouldBe(cancel);

      	finish(testRun);
	}

	this.testDestructive = function(testRun) {
		var optionsDialogOpts = {
			options:['Option 1', 'Option 2', 'Option 3', 'Option 4'],
			cancel:2,
			title:'I am a title'
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

		var destructive = 1;

		dialog.destructive = destructive;

		var gotten_destructive = dialog.getDestructive();

		valueOf(testRun, gotten_destructive).shouldBe(destructive);

      	finish(testRun);
	}

	this.testTizenView = function(testRun) {
		var wind = Ti.UI.createWindow();
				
		var dialog = Titanium.UI.createOptionDialog();

		var root = Ti.UI.createView({
				width : "100%", 
				height : 110
		});
			
		var view = Ti.UI.createView({
				width : 300, height: '100'
		});
		root.add(view);
		var l = Ti.UI.createLabel({
				text : 'I am a label',
				top: 10, left: 10, bottom: 10, right: 10,
				color : 'white',
				borderRadius : 10,
				backgroundColor : 'blue'
		}); 
		view.add(l);
			
		dialog.title = 'Tizen with a View';
		dialog.options = ['OK'];
		dialog.tizenView = root;

		valueOf(testRun, dialog.tizenView).shouldBeObject();
		wind.addEventListener('open', function(){
			dialog.show();
			hide();
		});

		wind.open();

		function hide(){
			setTimeout(function(){
				try{
					dialog.hide();
				} catch (e){ 
					console.log(e.message);
				}
				wind.close();
				finish(testRun);
			}, 2000);
		}
	}

	this.testTitle = function(testRun) {
		var optionsDialogOpts = {
			options:['Option 1', 'Option 2', 'Option 3', 'Option 4'],
			destructive:1,
			cancel:2
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

		var title = 'I am a title';

		dialog.title = title;

		var gotten_title = dialog.getTitle();
		
		valueOf(testRun, gotten_title).shouldBe(title);

      	finish(testRun);
	}

}