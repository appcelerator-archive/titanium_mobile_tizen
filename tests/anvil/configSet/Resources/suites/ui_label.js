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
			{name: "testProperties"}
		]

		if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb') {
			arr.push({name: "testShow"});
			arr.push({name: "testEllipsizePx"});
			arr.push({name: "testEllipsizeMultilinePx"}); //https://jira.appcelerator.org/browse/TIMOB-10144
			arr.push({name: "testHtmlPx"});

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
			backgroundColor: '00ffff'
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
			layout: 'vertical'
		});

		var label1 = Ti.UI.createLabel({
			color: '#900',
			font: { fontSize:14 },
			text: 'test@test.com\n 817-555-5555\n http://bit.ly',
			top: 30,
			width: 'auto',
			height: 'auto',
			autoLink: Ti.UI.LINKIFY_NONE
		});

		win.add(label1);
		win.addEventListener('postlayout', checkAutolinkBefore);
		win.open();

		//check that our label with flag LINKIFY_NONE has no links inside
		function checkAutolinkBefore(){
			var anchors = label1.domNode.getElementsByTagName('a');
			valueOf(testRun, anchors.length).shouldBe(0);

			label1.autoLink = Ti.UI.LINKIFY_ALL;
			checkAutolinkAfter();
		}

		function checkAutolinkAfter(){
			valueOf(testRun, label1.autoLink).shouldBe(Ti.UI.LINKIFY_ALL);

			var label = label1.domNode,
				anchors = label.getElementsByTagName('a');

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

	this.testEllipsizePx = function(testRun){
		// Create a label and checks ellipsize property is functioning
		var cp = new CountPixels(),
			noEllipsizeBackgroundPixelCount = 0,
		//pixelsPosition = {left:0,top:0, width:40, height:40},
			win = Ti.UI.createWindow({
				backgroundColor:'#FF0000',
				exitOnClose: true,
				layout: 'vertical'}),

			label = Ti.UI.createLabel({
				backgroundColor:'#FF0000',
				color:'#00FF00',
				ellipsize:false,
				wordWrap: false, //required for ellipsize according to unresolved bug !
				text:'This is demo!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
				height:40,
				width:40,
				left:1,
				top:1
			});

		win.addEventListener('postlayout', function(){
			cp.countPixels([255, 0, 0], label, onNoEllipsizePixelCounted);
		});

		win.add(label);
		win.open();

		// Counting label's pixels with ellipsize property is set to false
		function onNoEllipsizePixelCounted (count){
			valueOf(testRun, count).shouldBeGreaterThan(0);
			noEllipsizeBackgroundPixelCount = count;
			console.log("noEllipsizeBackgroundPixelCount = "+noEllipsizeBackgroundPixelCount);
			label.ellipsize = true;
			//TODO: BUG IN COUNT PIXELS?!?!?!  ellipsized and notellipsized ARE THE SAME in CountPixels and different on screen!
			//allow it to be fully repainted ever it is slow
			setTimeout(function(){
				cp.countPixels([255, 0, 0], label, onEllipsisPixelCounted);
			},1000);
		}

		// Counting label's pixels with ellipsize property is set to true. now we should have less pixels in label
		function onEllipsisPixelCounted(count){
			console.log("count = "+count);
			valueOf(testRun, count).shouldBeGreaterThan(noEllipsizeBackgroundPixelCount);
			win.close();
			finish(testRun);
		}
	}

	//test will fail due unfixed https://jira.appcelerator.org/browse/TIMOB-10144
	this.testEllipsizeMultilinePx = function(testRun){
		// Create a label and checks ellipsize property for multi-line
		var cp = new CountPixels(),
			noEllipsizeBackgroundPixelCount = 0,
			win = Ti.UI.createWindow({
				backgroundColor: 'black',
				exitOnClose: true,
				layout: 'vertical'}),

			label = Ti.UI.createLabel({
				backgroundColor:'black',
				color:'white',
				ellipsize:false,
				text:'This is demo of multi-line label that don\'t support ellipsize due not fixed bug',
				height:30,
				width:150,
				top : 80
			});

		label.addEventListener('postlayout', function(){
			cp.countPixels([0, 0, 0], win, onNoEllipsizePixelCounted);
		});

		win.add(label);
		win.open();

		// Counting background's pixels with ellipsize property is set to false
		function onNoEllipsizePixelCounted (count){
			valueOf(testRun, count).shouldBeGreaterThan(0);
			noEllipsizeBackgroundPixelCount = count;
			label.ellipsize = true;

			//allow it to be fully repainted ever it is slow
			setTimeout(function(){cp.countPixels([0, 0, 0], win, onEllipsisPixelCounted);},100);
		}

		// Counting background's pixels with ellipsize property is set to true. now we should have less pixels in label
		function onEllipsisPixelCounted(count){
			// due unfixed https://jira.appcelerator.org/browse/TIMOB-10144 we'll fail here
			valueOf(testRun, count).shouldBeGreaterThan(noEllipsizeBackgroundPixelCount);
			win.close();
			finish(testRun);
		}
	}

	this.testHtmlPx = function(testRun){
		// Create a label and checks html property is functioning
		var cp = new CountPixels(),
			backgroundPixelsCount = 0,
			win = Ti.UI.createWindow({backgroundColor: 'black'}),
			label = Ti.UI.createLabel({
				html:'',
				color:'white',
				backgroundColor: 'black',
				height:66,
				width:200
			});

		label.addEventListener('postlayout', function(){
			cp.countPixels([0, 0, 0], win, noTextOnLabelCheck);
		});

		win.add(label);
		win.open();

		// Counting background's pixels count if no visible html value is set
		function noTextOnLabelCheck (count){
			valueOf(testRun, count).shouldBeGreaterThan(0);
			backgroundPixelsCount = count;
			label.html = "|||||||||||||||||||||";
			//allow it to be fully repainted ever it is slow
			setTimeout(function(){cp.countPixels([0, 0, 0], win, applyHtmlTagSmallText);},50);
		}

		// Counting background's pixels count  to be sure some text is displayed
		function applyHtmlTagSmallText (count){
			valueOf(testRun, count).shouldBeLessThan(backgroundPixelsCount);
			backgroundPixelsCount = count;
			label.html = "<sup>|||||||||||||||||||||</sup>";
			//allow it to be fully repainted ever it is slow
			setTimeout(function(){cp.countPixels([0, 0, 0], win, onHtmlTextIsSmaller);},50);
		}

		// Counting background's pixels with <sup> text - now we should have more background pixel and less text.
		function onHtmlTextIsSmaller(count){
			valueOf(testRun, count).shouldBeGreaterThan(backgroundPixelsCount);
			win.close();
			finish(testRun);
		}
	}
}