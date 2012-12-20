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

	this.name = "media content";
	this.tests = [
		{name: "test1"},
		{name: "test2", timeout: 5000},
		{name: "test3", timeout: 2000}
	]

	this.test1 = function(testRun) {
		valueOf(testRun, 1).shouldBeNumber();
		finish(testRun);
	}
	
	this.test2 = function(testRun) {
		valueOf(testRun, 2).shouldBeNumber();
		finish(testRun);
	}
	
	this.test3 = function(testRun) {
		valueOf(testRun, 3).shouldBeNumber();
		finish(testRun);
	}
}