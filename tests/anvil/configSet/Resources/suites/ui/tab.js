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
	var MIN_PERCENT = 3;
	
	var RED_RGB_ARRAY = [255, 0, 0];
	var GREEN_RGB_ARRAY = [0, 255, 0 ];
	var YELLOW_RGB_ARRAY = [255, 255, 0];
	
	var RED_RGB = '#ff0000';
	var GREEN_RGB = '#00ff00';
	var YELLOW_RGB = '#ffff00';	
	var BLACK_RGB = '#ffffff';
	
	var TITLE = 'base_ui_title';
	
	var cp;	

	this.init = function(testUtils) {
		cp = new CountPixels();
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "tab";
	this.tests = [
		{name: "base_no_pix"},
		{name: "base"},		
		{name: "open"},
		{name: "open_close"},
		{name: "deactivate_tab"},
		{name: "activate_tab"},
		{name: "deactivate_activate_tab"},
		{name: "active_no_pix"}
	]	
	
	//Helper function for creating tab group with Ti.UI.Windows as parameters
	function _createTabGroupWithWindow() {		
	
		//Create TabGroup and set two tab with a windows
		var tabGroup = Titanium.UI.createTabGroup();
	
		for(var i=0;i < arguments.length;i++){
			var baseUITab = Ti.UI.createTab({
				title: i==0?TITLE:"title-"+ i,
				window: arguments[i]
			});
			tabGroup.addTab(baseUITab);
		};
		
		return tabGroup;
	}
	
	//Helper function for creating tab group standard for this test
	function _createTabGroup() {	
		var redWindow = Titanium.UI.createWindow({ backgroundColor: RED_RGB});
		var greenWindow = Titanium.UI.createWindow({ backgroundColor: GREEN_RGB});		
		return _createTabGroupWithWindow(redWindow,greenWindow);
	};	
	
	// Test base functionality WITHOUT pixel checking	
	this.base_no_pix = function(testRun) {	
		
		//Create main window
		var wind = Titanium.UI.createWindow();

		//Create tab group with two windows 
		var redWin = Titanium.UI.createWindow({ backgroundColor: RED_RGB});
		var greenWin = Titanium.UI.createWindow({ backgroundColor: GREEN_RGB});		
		var tabGroup =  _createTabGroupWithWindow(redWin,greenWin);
		
		//Add tab group on window		
		wind.add(tabGroup);
		wind.open();
		
		wind.addEventListener('postlayout',  function (){

			var tab = tabGroup.tabs[0];
			//Check existing first tab in TabGroup
			valueOf(testRun, tab).shouldNotBeUndefined();
			valueOf(testRun, tab instanceof Ti.UI.Tab).shouldBeTrue();
			
			//Check properties title , active, window for the first tab
			valueOf(testRun, tab.title).shouldBeEqual(TITLE);
			valueOf(testRun, tab.active).shouldBeTrue();
			valueOf(testRun, tab.window).shouldBeExactly(redWin);		
			
			//Check existing second tab in TabGroup
			var tab2 = tabGroup.tabs[1];
			valueOf(testRun, tab2).shouldNotBeUndefined();
			valueOf(testRun, tab2 instanceof Ti.UI.Tab).shouldBeTrue();
			//Check properties active and window for the first tab			
			valueOf(testRun, tab2.active).shouldBeFalse();	
			valueOf(testRun, tab2.window).shouldBeExactly(greenWin);	
			
			// Close main window
			wind.close();

			finish(testRun);
		});		
	}	

	// Test base functionality WITH pixel checking	
	this.base = function(testRun) {	
		
		//Create main window
		var wind = Titanium.UI.createWindow();
		
		//Create standard tab group and add it into the main window
		var tabGroup = _createTabGroup();	
		wind.add(tabGroup);
		wind.open();	
		
		//Check that red color exists (the first tab window is red)
		wind.addEventListener('postlayout', function (){			
			cp.countPixelsPercentage(RED_RGB_ARRAY, document.body,function(count){
				valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);	
				//Check NOT existing yellow color on the screen
				// (yellow color is used in subsequent tests)
				cp.countPixelsPercentage(YELLOW_RGB_ARRAY, document.body,function(count){ 
					valueOf(testRun, count).shouldBeZero();	
					finish(testRun);	
					
					//Close main window
					wind.close();
				});
			});					
		});		
	}	
	
	// Test open function with pixels calculating
	this.open = function(testRun) {			
		
		//Create main window
		var wind = Titanium.UI.createWindow();
		
		//Create standard tab group and add it into the main window
		var tabGroup = _createTabGroup();
		wind.add(tabGroup);
		wind.open();
		
		var firstTab = tabGroup.tabs[0];
		
		//Create new window
		var yellowWin = Titanium.UI.createWindow({ backgroundColor: YELLOW_RGB});
		//Open new window in current tab
		valueOf(testRun, function(){firstTab.open(yellowWin)}).shouldNotThrowException();
		
		wind.addEventListener('postlayout', function (){			
			cp.countPixelsPercentage(RED_RGB_ARRAY, document.body,function(count){ 
				valueOf(testRun, count).shouldBeZero();
				cp.countPixelsPercentage(YELLOW_RGB_ARRAY, document.body,function(count){ 
					valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);
					//Close main window
					wind.close();					
					finish(testRun);						
				});
			});
		});				

	}
	
	// Test open window in the tab and close it(with pixels calculating)
	this.open_close = function(testRun) {			
		
		//Create main window
		var wind = Titanium.UI.createWindow({ backgroundColor: BLACK_RGB});
		
		var tabGroup = _createTabGroup();
		
		//Add tab group on window		
		wind.add(tabGroup);
		wind.open();
		
		var firstTab = tabGroup.tabs[0];
		//Create new window
		var yellowWin = Titanium.UI.createWindow({ backgroundColor: YELLOW_RGB});		
			
		wind.addEventListener('postlayout', function (){	
			//open yellow window to the first tab
			firstTab.open(yellowWin);
		});	
		setTimeout(function() {		
			//close yellow window to the first tab
			valueOf(testRun, function(){firstTab.close(yellowWin)}).shouldNotThrowException();
		}, 1000);		
		
		setTimeout(function() {
		//Red window should appeare
			cp.countPixelsPercentage(RED_RGB_ARRAY, document.body,function(count){ 
				valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);				
				cp.countPixelsPercentage(YELLOW_RGB_ARRAY, document.body,function(count){ 
					valueOf(testRun, count).shouldBeZero();
					finish(testRun);
					wind.close();						
				});
			});	
				
			
		}, 2000);
	
	}
	
	//Test setting active property(with pixels calculating)
	this.deactivate_tab = function(testRun) {
		
		//Create main window
		var wind = Titanium.UI.createWindow({ backgroundColor: YELLOW_RGB});
		
		var tabGroup = _createTabGroup();
		
		//Add tab group on window		
		wind.add(tabGroup);
		wind.open();
		
		var firstTab = tabGroup.tabs[0];
		
		wind.addEventListener('postlayout', function (){
			//Curent active tab set active to false			
			firstTab.active = false;	
			//firstTab.setActive(false);			
		});			

		setTimeout(function() {
			//Red color should not appear because we set active property of first tab(with red color window) to false
			cp.countPixelsPercentage(RED_RGB_ARRAY, document.body, function(count){
				valueOf(testRun, count).shouldBeZero();
				//Main window background color(yellow) should appear instead of tab window color(red)
				cp.countPixelsPercentage(YELLOW_RGB_ARRAY, document.body, function(count){
					valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);		
				});
				finish(testRun);
				//close the window
				wind.close();					
			});					
		}, 1000);	
	}

	//Test active functionality with pixels calculating
	this.activate_tab = function(testRun) {
		
		//Create main window
		var wind = Titanium.UI.createWindow();
		
		//Create standard tab group and add it into the main window
		var tabGroup = _createTabGroup();
		wind.add(tabGroup);
		wind.open();
		
		var firstTab = tabGroup.tabs[0];
		var secondTab = tabGroup.tabs[1];
		//Set second (not active) tab in active state
		secondTab.active = true;		
		
		wind.addEventListener('postlayout', function (){
		
			//Check if color of second tab(green) is setted on the screen
			cp.countPixelsPercentage(GREEN_RGB_ARRAY, document.body, function(count){
					valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);
					finish(testRun);
					//close the window
					wind.close();	
				});				
		});			
	
	}	
	//Test setting active property(with pixels calculating)
	this.deactivate_activate_tab = function(testRun) {
		
		//Create main window
		var wind = Titanium.UI.createWindow({ backgroundColor: YELLOW_RGB});
		
		var tabGroup = _createTabGroup();
		
		//Add tab group on window		
		wind.add(tabGroup);
		wind.open();		
		
		var firstTab = tabGroup.tabs[0];
		firstTab.active = false;
		setTimeout(function() {
			firstTab.active = true;
		}, 1000);			
		setTimeout(function() {
			//Red color should appear because we set active property of first tab(with red color window) to true
			cp.countPixelsPercentage(RED_RGB_ARRAY, document.body, function(count){
				valueOf(testRun, count).shouldBeGreaterThan(MIN_WIND_PERCENT);	
				finish(testRun);
				//close the window
				wind.close();					
			});					
		}, 2000);	
		
	}	
	
	//Failed because https://jira.appcelerator.org/browse/TC-1740
	this.active_no_pix = function(testRun) {
		//Create main window
		var wind = Titanium.UI.createWindow();
		
		//Create standard tab group and add it into the main window
		var tabGroup = _createTabGroup();
		wind.add(tabGroup);
		wind.open();
		
		var firstTab = tabGroup.tabs[0];
		var secondTab = tabGroup.tabs[1];		
		
		secondTab.active = true;
		
		//Check correct values of active tab
		valueOf(testRun, firstTab.active).shouldBeFalse();
		valueOf(testRun, secondTab.active).shouldBeTrue();	
		finish(testRun);
		//close the window
		wind.close();	
	};

}
