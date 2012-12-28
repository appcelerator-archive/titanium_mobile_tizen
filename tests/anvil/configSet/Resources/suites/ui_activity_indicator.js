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

	this.name = "ui_activity_indicator.js";
	this.tests = [
		{name: "testProperties"},
		{name: "testProgress"}
	]

	this.testProperties = function(testRun) {
		//create object instance, a parasitic subclass of Observable
		var wind = Ti.UI.createWindow();
		
		//create object instance, a parasitic subclass of Observable
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
		//create object instance, a parasitic subclass of Observable
		var wind = Ti.UI.createWindow();
		
		//create object instance, a parasitic subclass of Observable
		
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

		function progress(){
			activityIndicator.show();
			setTimeout(function(){
				checkValue();
			},6000);		
		};

		function checkValue(){
			wind.close();
		};

		wind.addEventListener('open', progress);

		wind.open();

		finish(testRun); 
	}

}