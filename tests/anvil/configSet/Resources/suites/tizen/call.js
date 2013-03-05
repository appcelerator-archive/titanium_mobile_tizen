/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

// This test depends on call history already being present. If call history is empty, the test will
// still succeed, but will not test much. Currently it is not possible to add calls programmatically.
module.exports = new function() {
	var finish,
		valueOf,
		reportError;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = 'call';
	this.tests = [
		{name: 'call_history'},
		{name: 'remove'},
		{name: 'remove_batch'},
		{name: 'remove_all'},
		// {name: 'delete_recording'},
		{name: 'listeners'}
	]

	// Search for history of call
	this.call_history = function(testRun) {
		// Type of call
		var tFilter = Ti.Tizen.createAttributeFilter({
				attributeName: 'type',
				matchFlag: 'EXACTLY',
				matchValue: 'TEL'
			}),
			// Sort output
			sortMode = Ti.Tizen.createSortMode({
				attributeName: 'startTime',
				order: 'DESC'
			}),
			// From number
			numberFilter = Ti.Tizen.createAttributeFilter({
				attributeName: 'remoteParties.remoteParty',
				matchFlag: 'EXACTLY',
				matchValue: '12345678'
			}),
			// Add filters
			iFilter = Ti.Tizen.createCompositeFilter({
				type: 'INTERSECTION', 
				filters: [
					numberFilter,
					tFilter
				]
			}),
			tizenHistory = Ti.Tizen.Callhistory; 

		valueOf(testRun, tizenHistory).shouldBeObject();
		valueOf(testRun, tFilter).shouldBeObject();
		valueOf(testRun, sortMode).shouldBeObject();
		valueOf(testRun, numberFilter).shouldBeObject();
		valueOf(testRun, iFilter).shouldBeObject();

		function onSuccess(results) {
			if(results.length <= 0){
				reportError(testRun, "This test requires at least one call in the phone's call history. Please make several calls and restart the test.");
				finish(testRun);
			}
			valueOf(testRun, results).shouldNotBeUndefined();
			valueOf(testRun, results).shouldBeObject();

			for (var i in results) {
				valueOf(testRun, results[i].uid).shouldBeNumber();
				valueOf(testRun, results[i].remoteParties).shouldBeArray();
				valueOf(testRun, results[i].startTime).shouldBeObject();
				valueOf(testRun, results[i].direction).shouldBeString();
				valueOf(testRun, results[i].type).shouldBeString();
				valueOf(testRun, results[i].toString()).shouldBe('[object TiTizenCallCallHistoryEntry]');
			}
		}

		function onError(error) {
			reportError(testRun, 'The following error occurred: ' +  error.message);
		}

		// Find call history
		valueOf(testRun, function() { tizenHistory.find(onSuccess, onError, tFilter, sortMode);}).shouldNotThrowException();

		setTimeout(
			function() {
				finish(testRun);
			},
			10
		);
	}

	// Remove: deletes a call history entries. 
	this.remove = function(testRun) {
		var tizenHistory = Ti.Tizen.Callhistory;

		function onSuccess(results) {
			valueOf(testRun, results).shouldNotBeUndefined();
			valueOf(testRun, results).shouldBeObject();

			if (results.length > 0) {
				// Delete call from call history
				valueOf(testRun, function() { tizenHistory.remove(results[0]); }).shouldNotThrowException();
			}else{
				reportError(testRun, "This test requires at least one call in the phone's call history. Please make several calls and restart the test.");
				finish(testRun);
			}
		}

		function onError(error) {
			reportError(testRun, 'The following error occurred: ' +  error.message);
		}

		valueOf(testRun, tizenHistory).shouldBeObject();

		// Search for call history
		valueOf(testRun, function() { tizenHistory.find(onSuccess, onError); }).shouldNotThrowException();

		setTimeout(
			function() {
				finish(testRun);
			},
			10
		);
	}

	// Deletes a list of call history entries. 
	this.remove_batch = function(testRun) {
		var tizenHistory = Ti.Tizen.Callhistory;

		function onSuccess(results) {
			valueOf(testRun, results).shouldBeObject();
			// delete found history
			valueOf(testRun, function() { tizenHistory.removeBatch(results, null, onError); }).shouldNotThrowException();
		}

		function onError(error) {
			reportError(testRun, "This test requires at least one call in the phone's call history. Please make several calls and restart the test.");
			reportError(testRun, 'The following error occurred: ' +  error.message);
			finish(testRun);
		}

		valueOf(testRun, tizenHistory).shouldBeObject();

		// Search for call history
		valueOf(testRun, function() { tizenHistory.find(onSuccess, onError); }).shouldNotThrowException();
		
		// Give some time for execution
		setTimeout(
			function() {
				finish(testRun);
			},
			10
		);
	}

	// Deletes all call history. 
	this.remove_all = function(testRun) {
		function onError(error) {
			reportError(testRun, 'The following error occurred: ' +  error.message);
		}

		valueOf(testRun, Ti.Tizen.Callhistory).shouldBeObject();

		// Delete all call history
		valueOf(testRun, function() { Ti.Tizen.Callhistory.removeAll(null, onError); }).shouldNotThrowException();
		
		// Give some time for execution
		setTimeout(
			function() {
				finish(testRun);
			},
			10
		);
	}

	// // Deletes the recorded media associated to the call history item. 
	// this.delete_recording = function(testRun) {
	// 	var tizenHistory = Ti.Tizen.Call.history,
	// 		// Filter for call.video
	// 		filter = Ti.Tizen.createAttributeFilter({
	// 			attributeName: 'tags',
	// 			matchFlag: 'EXACTLY',
	// 			matchValue: 'call.video'
	// 		});

	// 	function onSuccess(results) {
	// 		valueOf(testRun, results).shouldBeObject();
			
	// 		(results.length > 0)  && valueOf(testRun, function() { tizenHistory.deleteRecording(results[0], null, onError); }).shouldNotThrowException();
	// 	}
		
	// 	function onError(error) {
	// 		reportError(testRun, 'The following error occurred: ' +  error.message);
	// 	}

	// 	valueOf(testRun, tizenHistory).shouldBeObject();
	// 	valueOf(testRun, filter).shouldBeObject();
	// 	valueOf(testRun, function() { tizenHistory.find(onSuccess, onError, filter); }).shouldNotThrowException();
		
	// 	// Give some time for execution
	// 	setTimeout(
	// 		function() {
	// 			finish(testRun);
	// 		},
	// 		10
	// 	);
	// }

	// Observing of callHistory changes. 
	this.listeners = function(testRun) {
		var handle,
			tizenHistory = Ti.Tizen.Callhistory,
			onListenerCB = {
				onadded: function(newItems) {
					valueOf(testRun, newItems).shouldBeObject();
				},
				onchanged: function(changedItems) {
					valueOf(testRun, changedItems).shouldBeObject();
				}
			};

		valueOf(testRun, tizenHistory).shouldBeObject();

		try {
			// Add new listener
			valueOf(testRun, function() { handle = tizenHistory.addChangeListener(onListenerCB); }).shouldNotThrowException();
			valueOf(testRun, handle).shouldNotBeNull();
			valueOf(testRun, handle).shouldBeNumber();

			// Remove added listener
			valueOf(testRun, function() { tizenHistory.removeChangeListener(handle); }).shouldNotThrowException();
		} catch (error) {
			reportError(testRun, 'The following error occurred: ' +  error.message);
		}

		// Give some time for execution
		setTimeout(
			function() {
				finish(testRun);
			},
			10
		);
	}
}
