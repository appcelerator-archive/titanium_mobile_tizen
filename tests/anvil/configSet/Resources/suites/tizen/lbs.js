/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish;
	var valueOf;
	var reportError;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = "local-based service";
	this.tests = [
		{name: "providers"},
		{name: "geocode"},
		{name: "options"}
	]

	this.providers = function(testRun) {
		var Geocoder = tizen.lbs.geocoder,
			defaultProvider = null,
			providers = null;

		valueOf(testRun, Geocoder).shouldBeObject();
		valueOf(testRun, function() { defaultProvider = Geocoder.getDefaultProvider(); }).shouldNotThrowException();
		valueOf(testRun, defaultProvider).shouldBeObject();
		valueOf(testRun, defaultProvider.name).shouldBeString();
		valueOf(testRun, defaultProvider.metaData).shouldBeObject();
		valueOf(testRun, defaultProvider.geocode).shouldBeFunction();
		valueOf(testRun, defaultProvider.connectivity).shouldBeString();
		valueOf(testRun, defaultProvider.reverseGeocode).shouldBeFunction();
		valueOf(testRun, function() { providers = Geocoder.getProviders() }).shouldNotThrowException();
		valueOf(testRun, providers).shouldNotBeUndefined();
		valueOf(testRun, providers).shouldBeArray();
		valueOf(testRun, providers[0]).shouldBeObject();
		valueOf(testRun, providers.length).shouldBeGreaterThan(0);
		valueOf(testRun, defaultProvider).shouldBeOneOf(providers);

		finish(testRun);
	}


	// This tests fails on Anvil because geocode() and reverseGeocode() function doesn't work on emulator and on device.
	// The code below has been tested on simulator - it works correct.
	// Functions like valueOf, shouldBeGreaterThan, shouldBe() didn't tested but they should work because theirs input parameters are correct.
	// https://bugs.tizen.org/jira/browse/TDIST-133
	this.geocode = function(testRun) {
		var defaultProvider = tizen.lbs.geocoder.getDefaultProvider(),
			inLatitude = 37.5665,
    		inLongitude = 126.9779,
    		coordinates = new tizen.SimpleCoordinates(inLatitude, inLongitude), // Seoul, South Korea
	    	options = {
	    		resultType: 'STRUCTURED'
	    	},
	    	address = 'Seoul, South Korea';

		valueOf(testRun, defaultProvider).shouldBeObject();
		valueOf(testRun, coordinates).shouldBeObject();
    	valueOf(testRun, defaultProvider.geocode).shouldBeFunction();
    	valueOf(testRun, defaultProvider.reverseGeocode).shouldBeFunction();

    	// invokes when error
    	function errorCB(e) {
    		reportError(testRun, 'The following error occurred: ' +  e.message);

    		finish(testRun);
		}

    	// Get the position
	    function getPositionCB(results) {
	    	var isLatitudeEqual = false,
	    		isLongitudeEqual = false,
				geoJSON = results[0].toGeoJSON();

	    	isLatitudeEqual = parseInt(inLatitude, 0) == parseInt(results[0].coordinates.latitude, 0);
			isLongitudeEqual = parseInt(inLongitude, 0) == parseInt(results[0].coordinates.longitude, 0);

			valueOf(testRun, isLatitudeEqual).shouldBeTrue();
			valueOf(testRun, isLongitudeEqual).shouldBeTrue();
			valueOf(testRun, geoJSON).shouldBeString();

			finish(testRun);
	    }
		
		defaultProvider.geocode(address, getPositionCB, errorCB);

		// get address by coordinates
		function getAddressCB(results) {
			valueOf(testRun, results).shouldBeArray();
			valueOf(testRun, results.length).shouldBeGreaterThan(0);
        	valueOf(testRun, results[0].region).shouldBeString();
        	valueOf(testRun, results[0].region).shouldBe('Seoul');
	    }
	    
	    defaultProvider.reverseGeocode(coordinates, getAddressCB, errorCB, options);
	}


	this.options = function(testRun) {
		var defaultProvider = null,
			option = {
	          "ID": "Your registered ID",
	          "PASSWORD": "Your registered password"
	        };
		
		valueOf(testRun, function() { defaultProvider = tizen.lbs.geocoder.getDefaultProvider(); }).shouldNotThrowException();
		valueOf(testRun, defaultProvider.supportedOptions).shouldBeObject();
		valueOf(testRun, defaultProvider.supportedOptions).shouldBeArray();

		for (var i in defaultProvider.supportedOptions) {
			valueOf(testRun, typeof(defaultProvider.supportedOptions[i]) == 'string').shouldBeTrue();
		}

	  	function successCB(result) {
	  		valueOf(testRun, result).shouldNotBeNull();
	  		valueOf(testRun, result).shouldNotBeUndefined();
	  		valueOf(testRun, result).shouldBeObject();

	  		finish(testRun);
		}

  		function errorCB(e) {
  			reportError(testRun, 'The following error occurred: ' + e.message);

  			finish(testRun);
  		}

		valueOf(testRun, defaultProvider.setOptions).shouldNotBeUndefined();
		valueOf(testRun, defaultProvider.setOptions).shouldBeFunction();
		valueOf(testRun, function() { defaultProvider.setOptions(option, successCB, errorCB); }).shouldNotThrowException();
	}
}