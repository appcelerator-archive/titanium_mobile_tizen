/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		reportError,
		waitTimeout;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = 'download';
	this.tests = [
		{name: 'checkDownload'},
		{name: 'successDownloadTest'},
		{name: 'successDownloadFlowTest'},
		{name: 'failedDownloadTest'}
	];

	//clears timeout if it was set before.
	function clearFakeTimeout(){
		// cancel fake call if any
		if (waitTimeout){
			clearTimeout(waitTimeout); 
		}
	}

	this.checkDownload  = function(testRun) {
		// Test for Tizen Device API: Download
		Ti.API.debug('Checking Download object availability.');
		valueOf(testRun, tizen).shouldBeObject();
		valueOf(testRun, tizen.download).shouldBeObject();
		valueOf(testRun, tizen.download.start).shouldBeFunction();
		valueOf(testRun, tizen.download.pause).shouldBeFunction();
		valueOf(testRun, tizen.download.abort).shouldBeFunction();
		valueOf(testRun, tizen.download.resume).shouldBeFunction();
		finish(testRun);
	}

	this.successDownloadFlowTest = function(testRun) {
		var localTestRun = testRun,
			downloadId,
			wasResumed = false,
			wasPaused = false;
		
		waitTimeout = null;
		var listener = {
			onprogress: function(id, receivedSize, totalSize) {
				Ti.API.debug('onprogress event. id=' + id + ', receivedSize=' + receivedSize + ', totalSize=' + totalSize);
				if (!wasPaused){
					wasPaused = true;
					tizen.download.pause(downloadId);
				}
				if (wasResumed){
					tizen.download.abort(downloadId);
				}
			},
			onpaused: function(id) {
				Ti.API.debug('onpaused event. id=' +id);
				clearFakeTimeout();
				waitTimeout=setTimeout(function(){
					tizen.download.resume(downloadId);
					wasResumed = true;
				}, 500);
			},
			onaborted: function(id) {
				Ti.API.debug('onaborted event. id=' +id);
				clearFakeTimeout();
				valueOf(localTestRun, id).shouldBeGreaterThanEqual(0);
				finish(localTestRun);
			},
			oncompleted: function(id, fileName) {
				Ti.API.debug('oncompleted event. id=' +id+', fileName=' + fileName);
				clearFakeTimeout();
				valueOf(localTestRun, id).shouldBeGreaterThanEqual(0);
				finish(localTestRun);
			},
			onfailed: function(id, error) {
				Ti.API.debug('onfailed event. id=' +id+', error=' + JSON.stringify(error));
				clearFakeTimeout();
				reportError(localTestRun, JSON.stringify(error));
			}
		};
		// downloading large file to test callbacks.
		var urlDownload = new tizen.URLDownload(
			'http://download.tizen.org/sdk/InstallManager/tizen-sdk-2.0-ubuntu32.bin', 
			'wgt-private-tmp', 
			'tmp' + (new Date().getTime()));
		downloadId = tizen.download.start(urlDownload, listener);
		valueOf(testRun, downloadId).shouldBeGreaterThanEqual(0); //
	}

	this.failedDownloadTest = function(testRun) {
		var localTestRun = testRun;
		var listener = {
			onprogress: function(id, receivedSize, totalSize) {
				reportError(localTestRun, 'onprogress may not be called in this test!');
			},
			onpaused: function(id) {
				reportError(localTestRun, 'onpaused may not be called in this test!');
			},
			onaborted: function(id) {
				reportError(localTestRun, 'onaborted may not be called in this test!');
			},
			oncompleted: function(id, fileName) {
				reportError(localTestRun, 'oncompleted may not be called in this test!');
			},
			onfailed: function(id, error) {
				Ti.API.debug('onfailed event. id=' + id + ', error=' + JSON.stringify(error));
				valueOf(localTestRun, error).shouldNotBeNull(); //
				finish(localTestRun);
			}
		};
		// Start downloading large file to be able to test callbacks.
		var urlDownload = new tizen.URLDownload(
			'http://download.tizen.org/Magic-Sofware-Package-v4.2.bin', 
			'wgt-private-tmp',
			'tmp' + (new Date().getTime())),
			downloadId = tizen.download.start(urlDownload, listener);
		valueOf(testRun, downloadId).shouldBeGreaterThanEqual(0);
	}

	this.successDownloadTest = function(testRun) {
		var localTestRun = testRun,
			wasResumed = false,
			wasPaused = false;
		waitTimeout = null;
		var listener = {
			onprogress: function(id, receivedSize, totalSize) {
				Ti.API.debug('onprogress event. id=' + id + ', receivedSize=' + receivedSize + ', totalSize=' + totalSize);
				valueOf(localTestRun, id).shouldBeGreaterThanEqual(0);
				valueOf(localTestRun, totalSize).shouldBeGreaterThanEqual(0);
			},
			onpaused: function(id) {
				Ti.API.debug('onpaused event. id=' +id);
				valueOf(localTestRun, 'onpaused').shouldBe('oncompleted');
				finish(localTestRun);
			},
			onaborted: function(id) {
				Ti.API.debug('onaborted event. id=' +id);
				valueOf(localTestRun, 'onaborted').shouldBe('oncompleted');
				finish(localTestRun);
			},
			oncompleted: function(id, fileName) {
				Ti.API.debug('oncompleted event. id=' + id + ', fileName=' + fileName);
				valueOf(localTestRun, id).shouldBeGreaterThanEqual(0);
				finish(localTestRun);
			},
			onfailed: function(id, error) {
				Ti.API.debug('onfailed event. id=' + id + ', error=' + JSON.stringify(error));
				reportError(localTestRun, JSON.stringify(error));
			}
		};
		// Start downloading large file to initate callbacks.
		var urlDownload = new tizen.URLDownload(
			'http://download.tizen.org/sdk/1_0-larkspur/pkg_list_windows', 
			'wgt-private-tmp', 
			'tmp' + (new Date().getTime())),
			downloadId = tizen.download.start(urlDownload, listener);
		valueOf(testRun, downloadId).shouldBeGreaterThanEqual(0);
	}
}
