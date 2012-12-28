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

	this.name = "ui_searchbar";
	this.tests = [
		{name: "testProperties"},
		{name: "testCancel"},
		{name: "testBlurFocus"}
	]

	this.testProperties = function(testRun) {
		
		var win = Ti.UI.createWindow({
			backgroundColor: 'white'
		});
		
		
		
		var search = Titanium.UI.createSearchBar({
		    barColor:'#000', 
		    hintText: 'hint text', 
		    showCancel:true,
		    height:43,
		    top:0,
		});

		win.add(search);

		valueOf(testRun, search.barColor).shouldBe('#000');
		valueOf(testRun, search.hintText).shouldBe('hint text');
		valueOf(testRun, search.showCancel).shouldBeTrue();

		var domNode = search.domNode,
		button = domNode.getElementsByTagName('button')[0],
		input = domNode.getElementsByTagName('input')[0],
		span = domNode.getElementsByTagName('span')[0]
		console.log(input.value);

		search.value = 'some text';
		
		button.click();
		valueOf(testRun, search.value).shouldBe('');

		search.hintText = 'some new text';

		//console.log(span.innerHTML);

		win.addEventListener('open', function(){
			valueOf(testRun, function(){
				search.blur();
			}).shouldNotThrowException();
			console.log(input.value);
			valueOf(input.value).shouldBe(search.hintText);
			valueOf(testRun, function(){
				search.focus();
			}).shouldNotThrowException();
			console.log(input.value);
			valueOf(input.value).shouldBe('');
			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 2000)
		})

		win.open();
     	
	}

	this.testCancel = function(testRun) {
		
		var win = Ti.UI.createWindow({
			backgroundColor: 'white'
		});
		
		
		
		var search = Titanium.UI.createSearchBar({
		    barColor:'#000', 
		    hintText: 'hint text', 
		    showCancel:true,
		    height:43,
		    top:0,
		});

		win.add(search);

		var domNode = search.domNode,
		button = domNode.getElementsByTagName('button')[0];

		search.value = 'some text';
		
		button.click();
		valueOf(testRun, search.value).shouldBe('');

		win.addEventListener('open', function(){
			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 2000)
		})

		win.open();
     	
	}

	this.testBlurFocus = function(testRun) {
		
		var win = Ti.UI.createWindow({
			backgroundColor: 'white'
		});
		
		
		var search = Titanium.UI.createSearchBar({
		    barColor:'#000', 
		    hintText: 'hint text', 
		    showCancel:true,
		    height:43,
		    top:0,
		});

		win.add(search);

		var domNode = search.domNode,
		input = domNode.getElementsByTagName('input')[0];

		win.addEventListener('open', function(){
			valueOf(testRun, function(){
				search.blur();
			}).shouldNotThrowException();
			valueOf(input.value).shouldBe(search.hintText);
			valueOf(testRun, function(){
				search.focus();
			}).shouldNotThrowException();
			valueOf(input.value).shouldBe('');
			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 2000)
		})

		win.open();
     	
	}

}