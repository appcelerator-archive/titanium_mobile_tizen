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
	
	var MIN_WIND_PERCENT = 50;
	var MAX_TAB_BUTTON_PERCENT = 10;
	var MIN_TAB_BUTTON_PERCENT = 3;
	
	var RED_ARRAY = [255, 0, 0];
	var GREEN_ARRAY = [0, 255, 0 ];
	var BLUE_ARRAY = [0, 0, 255 ];
	var YELLOW_ARRAY = [255, 255, 0 ];
	

	var RED_RGB = '#ff0000';
	var GREEN_RGB = '#00ff00';
	var BLUE_RGB = '#0000ff';
	var YELLOW_RGB = '#ffff00';
	//Default tab color
	var BLACK_RGB = '#ffffff';
	var WHITE_RGB = '#000000';
	
	var cp;	

	this.init = function(testUtils) {
		cp = new CountPixels();
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "tabGroup";
	this.tests = [
		{name: "base"},
		{name: "active", timeout: 3000},
		{name: "active_negative", timeout: 3000},
		{name: "base_no_pix" ,timeout: 3000},
		{name: "color_option" ,timeout: 2000},
		{name: "height" ,timeout: 4000}
	]	
	
	//Helper function for creating tab group standart for this tests
	function _createTabGroup() {
		//Create TabGroup with two tabs and assign a window of different colors to each tab
		var tabGroup = Titanium.UI.createTabGroup();
		
		var redWin = Titanium.UI.createWindow({ backgroundColor: RED_RGB});		
		var baseUITab = Ti.UI.createTab({
			title: 'base_ui_title',
			window: redWin
		});
		tabGroup.addTab(baseUITab);
		
		var greenWin = Titanium.UI.createWindow({ backgroundColor: GREEN_RGB});
		var secondUITab = Ti.UI.createTab({
			title: 'second_ui_title',
			window: greenWin 
		});		
		tabGroup.addTab(secondUITab);		
		tabGroup.setTabsBackgroundColor(WHITE_RGB);
		tabGroup.setActiveTabBackgroundColor(BLACK_RGB);
		
		return tabGroup; 
	
	}

	//Test base functionality with pixels calculation
	this.base = function(testRun) {

		//Create main window	
		var wind = Titanium.UI.createWindow();
		
		//Add tab group on window			
		wind.add(_createTabGroup());
		wind.open();
		
		// Check that the tabs really appeared, have reasonable size, and and are properly colored
		wind.addEventListener('postlayout',  function (){
			cp.countPixelsPercentage(RED_ARRAY, document.body, function (count){
				
				valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);
				cp.countPixelsPercentage(GREEN_ARRAY, document.body, function (count){
					valueOf(testRun, count).shouldBeLessThan(MIN_TAB_BUTTON_PERCENT);
					cp.countPixelsPercentage(BLUE_ARRAY, document.body, function (count){
						valueOf(testRun, count).shouldBeLessThan(MIN_TAB_BUTTON_PERCENT);						
						finish(testRun);
						wind.close();
					});	
				});					
			});
			
		});//end of wind.addEventListener
		
	}//end of this.base		
	
	//Test setting active window
	this.active = function(testRun) {

		//Create main window	
		var wind = Titanium.UI.createWindow();
		
		var tabGroup = _createTabGroup();
		//Set second tab as an active
		tabGroup.setActiveTab(1);
		//Add tab group on window			
		wind.add(tabGroup);
		wind.open();			
				
		// Check that the second (green) tab (window) appeared
		wind.addEventListener('postlayout',  function (){
			cp.countPixelsPercentage(GREEN_ARRAY, document.body, function (count){
				valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);
				finish(testRun);
				wind.close();
			});	
		});//end of wind.addEventListener
						
	}//end of this.active
	
	//Test setting active window
	this.active_negative = function(testRun) {

		//Create main window	
		var wind = Titanium.UI.createWindow();
		
		var tabGroup = _createTabGroup();
		//Set NOT existed tab as an active
		tabGroup.setActiveTab(2);
		//Add tab group on window			
		wind.add(tabGroup);
		wind.open();			
				
		// Check that the second (green) tab (window) appeared
		wind.addEventListener('postlayout',  function (){
			cp.countPixelsPercentage(RED_ARRAY, document.body, function (count){
				valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);
				finish(testRun);
				wind.close();
			});	
		});//end of wind.addEventListener
						
	}//end of this.active_negative	
	
	//Test base functionality without pixels calculation
	this.base_no_pix = function(testRun) {

		//Create main window	
		var wind = Titanium.UI.createWindow();
		
		//Create TabGroup with two tabs and assign a window of different colors to each tab
		var tabGroup = Titanium.UI.createTabGroup();
		
		var redWin = Titanium.UI.createWindow({ backgroundColor: RED_RGB});		
		var baseUITab = Ti.UI.createTab({
			title: 'base_ui_title',
			window: redWin
		});
		tabGroup.addTab(baseUITab);
		
		var greenWin = Titanium.UI.createWindow({ backgroundColor: GREEN_RGB});
		var secondUITab = Ti.UI.createTab({
			title: 'second_ui_title',
			window: greenWin 
		});		
		tabGroup.addTab(secondUITab);
		
		//Add tab group on window			
		wind.add(tabGroup);
		wind.open();
		
		//Check properties
		wind.addEventListener('postlayout',  function (){
			//tabs
			valueOf(testRun, tabGroup.tabs).shouldBeArray();
			valueOf(testRun, tabGroup.tabs.length).shouldBeEqual(2);
			valueOf(testRun, tabGroup.getTabs().length).shouldBeEqual(2);
			valueOf(testRun, tabGroup.tabs[0]).shouldBeEqual(baseUITab);
			valueOf(testRun, tabGroup.tabs[1]).shouldBeEqual(secondUITab);
			
			//ActiveTab
			valueOf(testRun, tabGroup.getActiveTab()).shouldBeEqual(baseUITab);
			tabGroup.setActiveTab(1);
			valueOf(testRun, tabGroup.getActiveTab()).shouldBeEqual(secondUITab);
			//ActiveTab negative
			valueOf(testRun, tabGroup.getActiveTab()).shouldBeEqual(baseUITab);
			tabGroup.setActiveTab(2);
			valueOf(testRun, tabGroup.getActiveTab()).shouldBeEqual(secondUITab);			
			
			//remove tab
			tabGroup.removeTab(secondUITab);
			
			valueOf(testRun, tabGroup.tabs.length).shouldBeEqual(1);
			finish(testRun);	
			//close window
			wind.close();
			
		
		});//end of wind.addEventListener

	
	}//end of this.base_no_pix
	
	//Testing diferent color options with pixels calculation
	this.color_option = function(testRun) {
		
		//Create main window	
		var wind = Titanium.UI.createWindow();
		
		var tabGroup = _createTabGroup();
		
		//change function setActiveTabBackgroundColor
		tabGroup.setActiveTabBackgroundColor(BLUE_RGB);
		
		//change function setTabsBackgroundColor
		tabGroup.setTabsBackgroundColor(YELLOW_RGB);
		//Add tab group on window			
		wind.add(tabGroup);
		wind.open();

		wind.addEventListener('postlayout', function (){			
			cp.countPixelsPercentage(BLUE_ARRAY, document.body, function (count){	
				valueOf(testRun, count).shouldBeGreaterThan(MIN_TAB_BUTTON_PERCENT);

				/*cp.countPixelsPercentage(YELLOW_ARRAY, document.body, function (count){
					valueOf(testRun, count).shouldBeGreaterThan(MAX_TAB_BUTTON_PERCENT);
					finish(testRun);
					wind.close();
				});*/			
				
				finish(testRun);
				wind.close();				
			});	
		});			
	
	}//end of this.color_option = function(testRun) {
	
	//Testing height option
	this.height = function(testRun) {
		
		//Create main window	
		var wind = Titanium.UI.createWindow();
		
		var tabGroup = _createTabGroup();
		//Add tab group on window			
		wind.add(tabGroup);
		tabGroup.setActiveTabBackgroundColor(BLUE_RGB);
		
		wind.open();
		
		wind.addEventListener('postlayout',  function (){
		
			cp.countPixelsPercentage(BLUE_ARRAY, document.body, function (count){
				valueOf(testRun, count).shouldBeGreaterThan(MIN_TAB_BUTTON_PERCENT);
				valueOf(testRun, count).shouldBeLessThan(MAX_TAB_BUTTON_PERCENT);
				tabGroup.setTabHeight(600);

			});	
		
		//wind.addEventListener('postlayout',  function (){
		});
		
		//Timeout is necessary because function tabGroup.setTabHeight(600); doesn't have callback
		setTimeout(function() {
			cp.countPixelsPercentage(BLUE_ARRAY, document.body, function (count){					
				valueOf(testRun, count).shouldBeGreaterThan(MAX_TAB_BUTTON_PERCENT);
				finish(testRun);
				wind.close();
			
			});
		
		}, 1000);//end of setTimeout(function() {

	
	}//end of this.height = function(testRun) {		
	
}
