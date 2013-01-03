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

	this.name = "ui_activity_indicator.js";
	this.tests = (function(){
			var arr = [
			{name: "testProperties"},
		]
		if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb') {
			arr.push({name: "testProgress"});
		}
		return arr;
	}())

	this.testProperties = function(testRun) {
	
		var wind = Ti.UI.createWindow({
			backgroundColor :'#660000'
		});
		
	
		var style = Ti.UI.ActivityIndicatorStyle.DARK;
		if (Ti.Platform.name === 'iPhone OS'){
		  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
		}
		var activityIndicator = Ti.UI.createActivityIndicator({
		  color: 'green',
		  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
		  message: 'Loading...',
		  style:style,
		  top:10,
		  left:10,
		  height:Ti.UI.SIZE,
		  width:Ti.UI.SIZE
		});
		
		wind.add(activityIndicator);

		activityIndicator.show();

		valueOf(testRun, activityIndicator.color).shouldBe('green');
		valueOf(testRun, activityIndicator.left).shouldBe(10);
		valueOf(testRun, activityIndicator.top).shouldBe(10);
		valueOf(testRun, activityIndicator.height).shouldBe(Ti.UI.SIZE);
		valueOf(testRun, activityIndicator.width).shouldBe(Ti.UI.SIZE);
		valueOf(testRun, activityIndicator.message).shouldBe('Loading...');
		valueOf(testRun, activityIndicator.font).shouldBeObject();
		valueOf(testRun, activityIndicator.font.fontSize).shouldBe('26px');
		valueOf(testRun, activityIndicator.font.fontWeight).shouldBe('bold');

      	finish(testRun);
	}

	this.testProgress = function(testRun){

		// Verify that the activity indicator indeed appears
		
		var wind = Ti.UI.createWindow();
		
		var cp = new CountPixels();

		var style = Ti.UI.ActivityIndicatorStyle.DARK;
		if (Ti.Platform.name === 'iPhone OS'){
		  style = Ti.UI.iPhone.ActivityIndicatorStyle.DARK;
		}
		var activityIndicator = Ti.UI.createActivityIndicator({
		  color: '#00ff00',		// color value will be checked later
		  backgroundColor: '#00ffff',
		  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
		  message: 'Loading...',
		  style:style,
		  top:10,
		  left:10,
		  height:Ti.UI.SIZE,
		  width:Ti.UI.SIZE
		});

		activityIndicator.addEventListener('postlayout', function(){
			// The activity indicator should now be drawn. Check if it is
			// (criteria: there must be enough pixels of the foreground color)
			cp.countPixels([0, 255, 0], wind, checkFontColor);
		});

		function checkFontColor(count){
			console.log(count);
			valueOf(testRun, count).shouldBeGreaterThan(250);
			cp.countPixels([0, 255, 255], wind, checkBackColor);
		}
		
		function checkBackColor(count){
			console.log(count);
			valueOf(testRun, count).shouldBeGreaterThan(2000);
			wind.close();
			finish(testRun);
		}

		function progress(){
			activityIndicator.show();
		};


		wind.add(activityIndicator);

		wind.addEventListener('postlayout', progress);

		wind.open();
		 
	}

}