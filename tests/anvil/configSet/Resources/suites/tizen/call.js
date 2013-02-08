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

	this.name = "call";
	this.tests = [
		{name: "call_history"},
		{name: "remove"},
		{name: "remove_batch"},
		{name: "remove_all"},
		{name: "delete_recording"},
		{name: "listeners"}
	]

	// Search for history of call
	this.call_history = function(testRun) {
	    var tFilter = new tizen.AttributeFilter("callType", "EXACTLY", "tizen.tel"),// type of call
			sortMode = new tizen.SortMode("startTime", "DESC"), // sort output
			numberFilter = new tizen.AttributeFilter("remoteParties.remoteParty", "EXACTLY", "12345678"), //from number
			iFilter = new tizen.CompositeFilter("INTERSECTION", [numberFilter, tFilter]), //add filters
			tizenHistory = tizen.call.history; 

		valueOf(testRun, tizenHistory).shouldBeObject();
		valueOf(testRun, tFilter).shouldBeObject();
		valueOf(testRun, sortMode).shouldBeObject();
		valueOf(testRun, numberFilter).shouldBeObject();
		valueOf(testRun, iFilter).shouldBeObject();

		function onSuccess(results) {
			valueOf(testRun, results).shouldNotBeUndefined();
			valueOf(testRun, results).shouldBeObject();

			for (var i in results) {
				valueOf(testRun, results[i].uid).shouldBeNumber();
				valueOf(testRun, results[i].remoteParties).shouldBeArray();
				valueOf(testRun, results[i].startTime).shouldBeObject();
				valueOf(testRun, results[i].direction).shouldBeString();
				valueOf(testRun, results[i].callType).shouldBeString();				
			}
	    }

	    function onError(error) {
	        reportError(testRun, 'The following error occurred: ' +  error.message);
	    }

	    // find call history
    	valueOf(testRun, function() { tizenHistory.find(onSuccess, onError, tFilter, sortMode);}).shouldNotThrowException();

    	setTimeout(
    		function() {
				finish(testRun);
    		},
    		10
    	);
	}

	//remove: Deletes a call history entries. 
	this.remove = function(testRun) {
		var tizenHistory = tizen.call.history;

		function onSuccess(results) {
	    	valueOf(testRun, results).shouldNotBeUndefined();
			valueOf(testRun, results).shouldBeObject();

	        if (results.length > 0) {
	        	// delete call from call history
	            valueOf(testRun, function() { tizenHistory.remove(results[0]); }).shouldNotThrowException();
	        }
	    }

	    function onError(error) {
	        reportError(testRun, 'The following error occurred: ' +  error.message);
	    }

		valueOf(testRun, tizenHistory).shouldBeObject();
		// search for call history
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
		var tizenHistory = tizen.call.history;

		function onSuccess(results) {
			valueOf(testRun, results).shouldBeObject();
			// delete found history
			valueOf(testRun, function() { tizenHistory.removeBatch(results, null, onError); }).shouldNotThrowException();
		}

	    function onError(error) {
	        reportError(testRun, 'The following error occurred: ' +  error.message);
	    }

		valueOf(testRun, tizenHistory).shouldBeObject();
		// search for call history
	    valueOf(testRun, function() { tizenHistory.find(onSuccess, onError); }).shouldNotThrowException();
		
		//device needs some time for execution
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

		valueOf(testRun, tizen.call.history).shouldBeObject();
		// delete all call history
		valueOf(testRun, function() { tizen.call.history.removeAll(null, onError); }).shouldNotThrowException();
    	
    	//device needs some time for execution
    	setTimeout(
    		function() {
				finish(testRun);
    		},
    		10
    	);
	}

	// Deletes the recorded media associated to the call history item. 
	this.delete_recording = function(testRun) {
		var tizenHistory = tizen.call.history,
			filter = new tizen.AttributeFilter("tags", "EXACTLY", "call.video"); // filter for call.video

		function onSuccess(results) {
			valueOf(testRun, results).shouldBeObject();
			if (results.length > 0) {
				// delete recording for this call
				valueOf(testRun, function() { tizenHistory.deleteRecording(results[0], null, onError); }).shouldNotThrowException();
			}
		}
		
		function onError(error) {
		    reportError(testRun, 'The following error occurred: ' +  error.message);
		}

		valueOf(testRun, tizenHistory).shouldBeObject();
		valueOf(testRun, filter).shouldBeObject();
		valueOf(testRun, function() { tizenHistory.find(onSuccess, onError, filter); }).shouldNotThrowException();
		
		//device needs some time for execution
		setTimeout(
    		function() {
				finish(testRun);
    		},
    		10
    	);
	}

	// Observing of callHistory changes. 
	this.listeners = function(testRun) {
		var handle = null,
			tizenHistory = tizen.call.history,
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
			// add new listener
		    valueOf(testRun, function() { handle = tizenHistory.addListener(onListenerCB); }).shouldNotThrowException();
		    valueOf(testRun, handle).shouldNotBeNull();
		    valueOf(testRun, handle).shouldBeNumber();
		    // remove added listener
		    valueOf(testRun, function() { tizenHistory.removeListener(handle); }).shouldNotThrowException();
		} catch (error) {
		    reportError(testRun, 'The following error occurred: ' +  error.message);
		}

		//device needs some time for execution
		setTimeout(
    		function() {
				finish(testRun);
    		},
    		10
    	);
	}
}
