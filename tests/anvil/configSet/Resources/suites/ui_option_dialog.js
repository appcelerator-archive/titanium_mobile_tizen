/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb'){
	Ti.include('countPixels.js');
}
module.exports = new function() {
	var finish;
	var valueOf;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "ui_option_dialog";
	this.tests = (function(){
		var arr = [	
			{name: "testOptions"},
			{name: "testCancel"},
			{name: "testDestructive"},
			{name: "testTitle"}
		]
		if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb') {
			arr.push({name: "showHide"});
			if(Ti.Platform.osname === 'tizen'){
				arr.push({name: "testTizenView"});
			}
		}
		return arr;
	}())

	this.showHide = function(testRun) {

		// Show a red full-screen window that will be a test background for the
		// option dialog. Then show the option dialog, and verify the number of
		// background-colored pixels has decreased, as the alert dialog covered them.

		var wind = Ti.UI.createWindow({
			backgroundColor: '#ff0000' //this color will be checked
		});

		var optionsDialogOpts = {
			options:['Option 1', 'Option 2', 'Option 3', 'Option 4'],
			destructive:1,
			cancel:2,
			title:'I am a title'
		};
		
		var dialog = Titanium.UI.createOptionDialog(optionsDialogOpts);

		var showDialog = function(){
			console.log('it work')
			var cp = new CountPixels();

			cp.countPixelsPercentage([255, 0, 0], document.body, callback1);

			function callback1(count){
				valueOf(testRun, function(){
					dialog.show();
				}).shouldNotThrowException();
				setTimeout(function(){
					cp.countPixelsPercentage([255, 0, 0], document.body, callback2);
				}, 500)
			}

			function callback2(count){
				// there are 0 red pixels, because the option dialog dims the surrounding screen,
				// and the pixels become dark-red (different colour).
				valueOf(testRun, count).shouldBe(0);	
				valueOf(testRun, function(){	
					dialog.hide();
				}).shouldNotThrowException();
				setTimeout(function(){
					cp.countPixelsPercentage([255, 0, 0], document.body, callback3);
				}, 500);
			}	

			function callback3(count){
				valueOf(testRun, count).shouldBe(100);
				wind.close();
				
			}

		}

		wind.addEventListener('open', showDialog);

		wind.addEventListener('close', function(){
			finish(testRun);
		})

		wind.open();

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

		//create custom view for option dialog, that will be include label with black background 
		//and then, after dialog show, veryfy the number of black pixels; 

		var wind = Ti.UI.createWindow({
			backgroundColor: '#00ff00'
		});

		var cp = new CountPixels();
				
		var dialog = Titanium.UI.createOptionDialog();

		var root = Ti.UI.createView({
				width : 250, 
				height : 130
		});
			
		
		
		var l = Ti.UI.createLabel({
				//text : 'I am a label',
				top: 10, left: 10, bottom: 10, right: 10,
				color : 'white',
				backgroundColor : '#000000',
				widht : 200,
				heigth : 100
		}); 

		root.add(l);
			
		dialog.title = 'Tizen with a View';
		dialog.options = ['OK'];
		dialog.tizenView = root;

		valueOf(testRun, dialog.tizenView).shouldBeObject();

		wind.addEventListener('open', function(){
			dialog.show();
			setTimeout(function(){
				cp.countPixels([0, 0, 0], document.body, hideDialog);
			}, 500);
		});

		wind.open();

		function hideDialog(count){
				console.log(count)
				valueOf(testRun, count).shouldBeGreaterThan(20000);
				try{
						dialog.hide();
				} catch (e){ 
						console.log(e.message);
				}
				wind.close();
				finish(testRun);
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