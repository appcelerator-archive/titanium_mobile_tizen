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

	this.name = "ui_progress_bar";
	this.tests = [
		{name: "testProperties"},
		{name: "testProgress"}
	]

	this.testProperties = function(testRun) {
		//create object instance, a parasitic subclass of Observable
		var wind = Ti.UI.createWindow();
		
		//create object instance, a parasitic subclass of Observable
		
		var pb=Titanium.UI.createProgressBar({
		    top:10,
		    width:250,
		    height:'auto',
		    min:0,
		    max:10,
		    value:0,
		    color:'#fff',
		    message:'Downloading 0 of 10',
		    font:{fontSize:14, fontWeight:'bold'},
		   
		});
		wind.add(pb);

		pb.show();

		valueOf(testRun, pb.color).shouldBe('#fff');
		valueOf(testRun, pb.max).shouldBe(10);
		valueOf(testRun, pb.min).shouldBe(0);
		valueOf(testRun, pb.value).shouldBe(0);
		valueOf(testRun, pb.message).shouldBe('Downloading 0 of 10');
		valueOf(testRun, pb.font).shouldBeObject();
		valueOf(testRun, pb.font.fontSize).shouldBe('14px');
		valueOf(testRun, pb.font.fontWeight).shouldBe('bold');

      	finish(testRun);
	}

	this.testProgress = function(testRun){
		//create object instance, a parasitic subclass of Observable
		var wind = Ti.UI.createWindow();
		
		//create object instance, a parasitic subclass of Observable
		
		var pb=Titanium.UI.createProgressBar({
		    top:10,
		    width:250,
		    height:'auto',
		    min:0,
		    max:100,
		    value:0,
		    color:'#fff',
		    message:'Downloading 0 of 10',
		    font:{fontSize:14, fontWeight:'bold'},
		   
		});
		wind.add(pb);

		pb.show();

		valueOf(testRun, pb.value).shouldBe(0);

		function progress(){
			if(pb.value < pb.max){
				pb.value++;
				console.log(pb.value);
				setTimeout(function(){
					progress();
				},50);
			} else {
				checkValue();
			} 
			
		};

		function checkValue(){
			console.log('>>>>>>>>>>>>' + pb.value);
			valueOf(testRun, pb.value).shouldBe(pb.max);
			wind.close();
		};

		wind.addEventListener('postlayout', progress);

		wind.open();

		finish(testRun); 
	}

}