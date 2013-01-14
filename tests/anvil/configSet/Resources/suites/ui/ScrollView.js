/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */


// unfinished due to failure of base_no_pix

 
if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb'){
   Ti.include('countPixels.js');
}
 
module.exports = new function() {
	var finish;
	var valueOf;
	
	var MIN_SCROLL_VIEW_EXISTING = 3;

	var GREEN_RGB_ARRAY = [0, 255, 0 ];
	var BLUE_RGB_ARRAY = [0, 0, 255 ];

	var GREEN_RGB = '#00ff00';
	var BLUE_RGB = '#0000ff';
	
	var cp;	

	this.init = function(testUtils) {
		cp = new CountPixels();
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		}

	this.name = "ScrollView";
	this.tests = [
		{name: "base"},
		{name: "base_no_pix" ,timeout: 1000}
	]	
	
	//Helper function create Main window createScrollView and View
	function TestObjects(){
		 win = Ti.UI.createWindow({
		  backgroundColor: 'white',
		  exitOnClose: true,
		  fullscreen: false,
		  title: 'ScrollView Demo',
		  height: 400,
		  width: 200
		});

		var scrollView = Ti.UI.createScrollView({
		  top: 0,
		  left: 0,		
		  backgroundColor: GREEN_RGB,
		  contentWidth: 500,
		  contentHeight: 200,
		  showVerticalScrollIndicator: true,
		  showHorizontalScrollIndicator: true,
		  height: 400,
		  width: 200
		});
		
		var view = Ti.UI.createView({
		  backgroundColor: BLUE_RGB,
		  //borderRadius: 10,
		  top: 0,
		  left: 0,
		  height: 50,
		  width: 200
		});
		scrollView.add(view);

		win.add(scrollView);
		
		this.mainWindow = win;
		this.scrollView = scrollView;
	}
	
	//Test check in appearance of createScrollView on the screen(with pixel calculation)
	this.base = function(testRun) {
		var testObject = new TestObjects();
		//testObject.scrollView.scrollTo(13,14);
		
		testObject.mainWindow.open();
		testObject.mainWindow.addEventListener('postlayout',  function (){
			cp.countPixelsPercentage(BLUE_RGB_ARRAY, document.body, function(count){
				valueOf(testRun, count).shouldBeGreaterThan(MIN_SCROLL_VIEW_EXISTING);
				finish(testRun);
				testObject.mainWindow.close();
			});
		});

	}

	//Test base functionality with NO pixels calculation
	//Failed because https://jira.appcelerator.org/browse/TC-1741
	this.base_no_pix = function(testRun) {
	
		var testObject = new TestObjects();
		//testObject.scrollView.scrollTo(13,14);
		scrollView = testObject.scrollView;	

		var wind = testObject.mainWindow;
		wind.open();	

		wind.addEventListener('postlayout',  function (){
			var properties = "contentHeight,contentOffset,contentWidth,disableBounce,horizontalBounce,scrollingEnabled,showHorizontalScrollIndicator,showVerticalScrollIndicator,verticalBounce";
			properties.split(',').forEach(function(property) {
				//alert(property);
				valueOf(testRun,scrollView[property]).shouldNotBeUndefined()
			});	

			valueOf(testRun,scrollView.scrollTo).shouldBeFunction();
			valueOf(testRun,function(){scrollView.scrollTo(0,0)}).shouldNotThrowException()
				
			finish(testRun);
			wind.close();	
		});
		
	}
		
}
