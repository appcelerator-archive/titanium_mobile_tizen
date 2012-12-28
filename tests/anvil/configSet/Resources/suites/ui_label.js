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

	this.name = "ui_label";
	this.tests = [
		{name: "testProperties"},
		{name: "testAutolink"}
	]

	this.testProperties = function(testRun) {
		//create object instance, a parasitic subclass of Observable
		var win = Ti.UI.createWindow({
			backgroundColor: 'white',
			exitOnClose: true,
			fullscreen: false,
			layout: 'vertical',
			title: 'Label Demo'
		});
		
		//create object instance, a parasitic subclass of Observable
		
		var label1 = Ti.UI.createLabel({
			color: '#900',
			font: { fontSize:48 },
			shadowColor: '#aaa',
			shadowOffset: {x:5, y:5},
			text: 'A simple label',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			top: 30,
			width: 'auto', height: 'auto'
		});

		win.add(label1);

		valueOf(testRun, label1.color).shouldBe('#900');
		valueOf(testRun, label1.shadowColor).shouldBe('#aaa');
		valueOf(testRun, label1.top).shouldBe(30);
		valueOf(testRun, label1.textAlign).shouldBe(Ti.UI.TEXT_ALIGNMENT_CENTER);
		valueOf(testRun, label1.text).shouldBe('A simple label');
		valueOf(testRun, label1.font).shouldBeObject();
		valueOf(testRun, label1.font.fontSize).shouldBe('48px');

		win.addEventListener('open', function(){
			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 2000)
		})

		win.open();
     	
	}

	this.testAutolink = function(testRun){
		var win = Ti.UI.createWindow({
			backgroundColor: 'white',
			exitOnClose: true,
			layout: 'vertical',
		});
		
		//create object instance, a parasitic subclass of Observable
		
		var label1 = Ti.UI.createLabel({
			color: '#900',
			font: { fontSize:14 },
			text: 'test@test.com\n 817-555-5555\n http://bit.ly',
			top: 30,
			width: 'auto', height: 'auto'
		});

		win.add(label1);

		win.addEventListener('open', function(){
			/*check kolor of label and memorize it in procent*/
			label1.autoLink = Ti.UI.Tizen.LINKIFY_ALL;
			setTimeout(function(){
				checkAutlink();
			},2000)
		});

		function checkAutlink(){
			/* check label text, it should be blue color*/
			valueOf(testRun, label1.autoLink).shouldBe(Ti.UI.Tizen.LINKIFY_ALL);
			win.close();
			finish(testRun);
		}
		win.open();

	}

}