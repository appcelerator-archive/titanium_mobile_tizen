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

	this.name = "notifications";
	this.tests = [
		{name: "test1"}
	]

	this.test1 = function(testRun) {
		console.log('Kto zakomital notification and call testy v app.js no ne dobavil eti files? Iz-za vas ves suit padal');
		valueOf(testRun, 1).shouldBeNumber();
		finish(testRun);
	}
}

