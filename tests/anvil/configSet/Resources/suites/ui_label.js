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

	this.name = "ui_label";
	this.tests = (function(){
		var arr = [
			{name: "testProperties"},
			
		]
		if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb') {
			arr.push({name: "testShow"});
			if(Ti.Platform.osname === 'tizen'){
				arr.push({name: "testAutolink"});
			}
		}
		return arr;
	}())

	this.testProperties = function(testRun) {
		
		var win = Ti.UI.createWindow({
			backgroundColor: 'white',
			exitOnClose: true,
			fullscreen: false,
			layout: 'vertical',
			title: 'Label Demo'
		});
		
		
		
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
			win.close();
			finish(testRun);
		})

		win.open();
     	
	}

	this.testShow = function(testRun){

		// Create a label and verify its appearance (background, foreground color)
		// by verifying the presence of pixels of these colours on the screen.
		
		var win = Ti.UI.createWindow({
			backgroundColor: '00ffff',
		});

		var cp = new CountPixels();

		var label = Ti.UI.createLabel({
			color: '#ff0000',
			font: { fontSize:48 },
			shadowColor: '#aaaaaa',
			shadowOffset: {x:5, y:5},
			text: 'A simple label',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			top: 30,
			width: 'auto', height: 'auto',
			backgroundColor: '#00ff00'
		});

		label.addEventListener('postlayout', function(){
			cp.countPixels([255, 0, 0], win, checkFontColor);
		});

		win.add(label);

		win.open();

		function checkFontColor (count){
			valueOf(testRun, count).shouldBeGreaterThan(1000);
			cp.countPixels([0, 255, 0], win, checkBackColor);
		}

		function checkBackColor(count){
			valueOf(testRun, count).shouldBeGreaterThan(5000);
			win.close();
			finish(testRun);
		}

		

	}

	this.testAutolink = function(testRun){
		var win = Ti.UI.createWindow({
			backgroundColor: 'white',
			exitOnClose: true,
			layout: 'vertical',
		});
		
		var label1 = Ti.UI.createLabel({
			color: '#900',
			font: { fontSize:14 },
			text: 'test@test.com\n 817-555-5555\n http://bit.ly',
			top: 30,
			width: 'auto', height: 'auto'
		});

		win.add(label1);

		win.addEventListener('open', checkAutlinkBefore);

		win.open();

		label1.autoLink = Ti.UI.Tizen.LINKIFY_ALL;

		

		function checkAutlinkBefore(){
			var label = document.getElementsByClassName('TiUILabel')[0];
			var anchors = label.getElementsByTagName('a');
			valueOf(testRun, anchors.length).shouldBe(0);
			label1.autoLink = Ti.UI.Tizen.LINKIFY_ALL;
			checkAutlinkAfter();

		}

		function checkAutlinkAfter(){
			valueOf(testRun, label1.autoLink).shouldBe(Ti.UI.Tizen.LINKIFY_ALL);
			var label = document.getElementsByClassName('TiUILabel')[0];
			var anchors = label.getElementsByTagName('a');
			valueOf(testRun, anchors.length).shouldBe(3);
			if (anchors.length >= 3){
				var emailAnchor = anchors[0],
					phoneAnchor = anchors[1],
					urlAnchor   = anchors[2];
				valueOf(testRun, emailAnchor.innerHTML).shouldBe("test@test.com");
				valueOf(testRun, emailAnchor.href).shouldBe("mailto:test@test.com");
				valueOf(testRun, phoneAnchor.innerHTML).shouldBe("817-555-5555");
				// Linkifying of phone numbers not implemented in tizen
				//valueOf(testRun, phoneAnchor.href).shouldBe("#");
				valueOf(testRun, urlAnchor.innerHTML).shouldBe("http://bit.ly");
				valueOf(testRun, urlAnchor.href).shouldBe("http://bit.ly/");

			}
			win.close();
			finish(testRun);
		}
		

	}

}