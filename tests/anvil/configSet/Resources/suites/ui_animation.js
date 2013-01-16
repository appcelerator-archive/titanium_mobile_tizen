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
	var reportError;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = "ui_animation";
	this.tests = (function(){
		var arr = [
			
		]
		if(Ti.Platform.osname === 'tizen' || Ti.Platform.osname === 'mobileweb') {
			arr.push({name: "backgroundColor_test"});
			arr.push({name: "autoreverse_test"});
			arr.push({name: "bottom_test", timeout: 5000});
			arr.push({name: "top_test"});
			arr.push({name: "repeat_test", timeout: 5000});
			arr.push({name: "left_test"});
			arr.push({name: "right_test", timeout: 5000});
			arr.push({name: "color_test"});
			arr.push({name: "height_test"});
			arr.push({name: "width_test"});
			arr.push({name: "visible_test", timeout: 5000});
			arr.push({name: "zIndex_test", timeout: 5000});
			arr.push({name: "opacity_test"});
			arr.push({name: "delay_test"});
			arr.push({name: "duration_test"});
			arr.push({name: "transform_test"});
		}
		return arr;
	}())

	this.backgroundColor_test = function(testRun) {

		var wind = Ti.UI.createWindow();
		var view = Titanium.UI.createView({
			  backgroundColor:'red'
		});
		var cp = new CountPixels();
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.backgroundColor = 'black';
		animation.duration = 1000;
			
		var animationHandler = (function(){
				var repeat = true;
				return	function() {
					if(repeat){		
						repeat = false;
						animation.backgroundColor = '#00ff00';
						view.animate(animation);
					} else {
						cp.countPixelsPercentage([0, 255, 0], 
							wind, 
							function(count){
								valueOf(testRun, count).shouldBe(100);	
								wind.close();
								finish(testRun);
							}
						);
					}
				}
		})();
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
				view.animate(animation);
		})

		wind.open()
	}

	this.autoreverse_test = function(testRun) {

		var wind = Ti.UI.createWindow();
		var view = Titanium.UI.createView({
			  backgroundColor:'#ff0000'
		});
		var cp = new CountPixels();
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.backgroundColor = '#000000';
		animation.duration = 1000;
		animation.autoreverse = true;
			
		var animationHandler = (function(){
				var repeat = true;
				return	function() {
					if(repeat){		
						repeat = false;
						animation.backgroundColor = '#00ff00';
						view.animate(animation);
					} else {
						cp.countPixelsPercentage([255, 0, 0], 
							wind, 
							function(count){
								valueOf(testRun, count).shouldBe(100);	
								wind.close();
								finish(testRun);
							}
						);
					}
				}
		})();
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
				view.animate(animation);
		})

		wind.open()
	}	


	this.bottom_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange'
		});
		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			bottom : 10
		});
		var cp = new CountPixels();
		var width, height;
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.bottom = 50;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width* (height - 50));	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
				width = wind.width;
				height = wind.height;
				view.animate(animation);
		})

		wind.open()
	}	

	this.top_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange'
		});
		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			top : 10
		});
		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.top = 50;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width* (height - 50));	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}

	this.left_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange'
		});
		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			left : 10
		});
		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.left = 50;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe((width - 50) * height);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}

	this.right_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange'
		});
		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			right : 10
		});
		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.right = 50;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe((width - 50) * height);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}

	this.color_test = function(testRun) {

		var wind = Ti.UI.createWindow();
		var view = Titanium.UI.createView({
			  color:'red'
		});
		var cp = new CountPixels();
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.color = 'black';
		animation.duration = 1000;
			
		var animationHandler = (function(){
				var repeat = true;
				return	function() {
					if(repeat){		
						repeat = false;
						animation.color = '#00ff00';
						view.animate(animation);
					} else {
						cp.countPixelsPercentage([0, 255, 0], 
							wind, 
							function(count){
								valueOf(testRun, count).shouldBe(100);	
								//wind.close();
								finish(testRun);
							}
						);
					}
				}
		})();
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
				view.animate(animation);
		})

		wind.open()
	}

	this.repeat_test = function(testRun) {

		var wind = Ti.UI.createWindow();
		var view = Titanium.UI.createView({
			  backgroundColor:'#ff0000'
		});
		var cp = new CountPixels();
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.backgroundColor = '#000000';
		animation.duration = 1000;
		animation.repeat = 4;
			
		var animationHandler = function(){
			cp.countPixelsPercentage([255, 0, 0], 
				wind, 
				function(count){
					//valueOf(testRun, count).shouldBe(100);	
					//wind.close();
					//finish(testRun);
				}
			);
		};
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
				view.animate(animation);
		})

		wind.open()
	}

	this.height_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange'
		});

		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			height : height
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.height = height - 50;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width * (height - 50));	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}	

	this.width_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange'
		});

		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			width : width
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.width = width - 50;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe((width - 50) * height);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}

	this.visible_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange'
		});

		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.visible = false;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(0);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}

	this.zIndex_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: 'orange',
			zIndex: 1000
		});

		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			zIndex: 2000
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.zIndex = 100;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width * height);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}

	this.opacity_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510
		});

		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			width: width,
			height: height
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.opacity = 0.5;
		animation.duration = 1000;

		function animationHandler(){
			cp.countPixels([127, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width * height);	
					//wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}	


	this.delay_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510
		});

		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			width: width,
			height: height
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.delay = 3000;
		animation.backgroundColor = "#00ff00";
		animation.duration = 1000;

		setTimeout(function(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width * height);
				}
			);			
		}, 1000);

		function animationHandler(){
			cp.countPixels([0, 255, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width * height);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}

	this.duration_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510
		});

		var cp = new CountPixels();
		var width = wind.width, 
			height = wind.height;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			width: width,
			height: height
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		animation.backgroundColor = "#00ff00";
		animation.duration = 4000;

		setTimeout(function(){
			cp.countPixels([255, 0, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(0);
				}
			);			
		}, 1000);

		function animationHandler(){
			cp.countPixels([0, 255, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width * height);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}	

	this.transform_test = function(testRun) {

		var wind = Ti.UI.createWindow({
			width: 320,
			height: 510,
			backgroundColor: "#000000"
		});

		var cp = new CountPixels();
		var width = 40, 
			height = 40;

		var view = Titanium.UI.createView({
			backgroundColor:'#ff0000',
			width: width,
			height: height
		});
			
		wind.add(view);

		var animation = Titanium.UI.createAnimation();
		var matrix = Ti.UI.create2DMatrix();
		matrix = matrix.scale(2, 2);
		animation.backgroundColor = "#00ff00";
		animation.transform = matrix;
		animation.repeat = 4;
		animation.duration = 4000;


		function animationHandler(){
			cp.countPixels([0, 255, 0], 
				wind, 
				function(count){
					valueOf(testRun, count).shouldBe(width * height * 4);	
					wind.close();
					finish(testRun);
				}
			);
		}
			
		animation.addEventListener('complete',animationHandler);
		view.addEventListener('postlayout',function(){
			view.animate(animation);
		})

		wind.open()
	}	

}