module.exports = new function() {
	var CALC_APP_ID = 'tlp6xwqzos.Calculator',
		NOT_EXIST_APP_ID = 'Not_exist_app_id.asdfs',
		finish,
		valueOf,
		reportError,
		applicationObj;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
		applicationObj = require('Ti/Tizen/Application');
	}

	this.name = 'application';
	this.tests = [
		{name: 'apps_info'},
		{name: 'app_info'},
		{name: 'app_info_not_exist'},
		{name: 'apps_contexts'},
		{name: 'apps_contexts_harness'},
		{name: 'apps_contexts_no_params'},
		{name: 'launch_not_exist'},
		{name: 'launchAppControl'},
		{name: 'calc_launch'},
		// This test impact to another and can not be launched with others
		// {name: 'harness_hide'}
	];

	function _runingAppWithId(runingAppArray, appId) {
		for (var i = 0, len = runingAppArray.length; i < len; i++) {
			if (runingAppArray[i].appId == appId) {
				return true;
			}
		};

		return false;
	}

	// Fails
	// Test - List of Installed Applications
	this.apps_info = function(testRun) {
		var isCalcAppOnEmulator,
			appInstalledCount = 0;

		valueOf(testRun, function() {
			applicationObj.getAppsInfo(function(applications) {
				appInstalledCount = applications.length;
				Ti.API.info("appInstalledCount: " + appInstalledCount);

				valueOf(testRun, appInstalledCount).shouldBeGreaterThan(0);			

				for (var i = 0, len = appInstalledCount; i < len; i++) {
					valueOf(testRun, applications[i]).shouldNotBeUndefined();
					valueOf(testRun, applications[i]).shouldBeObject();
					valueOf(testRun, applications[i].toString()).shouldBe('[object TizenApplicationApplicationInformation]');

					if (applications[i].id && applications[i].id === CALC_APP_ID) {
						isCalcAppOnEmulator = true;
					}
				}

				valueOf(testRun, isCalcAppOnEmulator).shouldBeTrue();

				finish(testRun);
			});
		}).shouldNotThrowException();
	}

	// Fails
	// Test - get Application info with correct info
	this.app_info = function(testRun) {
		var calcAppInfo,
			harnessAppInfo;

		calcAppInfo = applicationObj.getAppInfo(CALC_APP_ID),
		harnessAppInfo = applicationObj.getAppInfo();

		valueOf(testRun, calcAppInfo).shouldBe('[object TizenApplicationApplicationInformation]');
		valueOf(testRun, calcAppInfo).shouldNotBeUndefined();
		valueOf(testRun, calcAppInfo.id).shouldBeEqual(CALC_APP_ID);
		valueOf(testRun, calcAppInfo.name).shouldBeEqual('Calculator-Ref');
		valueOf(testRun, calcAppInfo.installDate instanceof Date).shouldBeTrue();
		valueOf(testRun, calcAppInfo.size).shouldBeNumber();
		valueOf(testRun, calcAppInfo.version).shouldBeString();
		valueOf(testRun, calcAppInfo.iconPath).shouldBeString();
		valueOf(testRun, calcAppInfo.show).shouldBeBoolean();

		valueOf(testRun, harnessAppInfo).shouldBe('[object TizenApplicationApplicationInformation]');
		valueOf(testRun, harnessAppInfo).shouldNotBeUndefined();
		valueOf(testRun, harnessAppInfo.id).shouldBeString();
		valueOf(testRun, harnessAppInfo.name).shouldBeEqual('test_harness');
		valueOf(testRun, harnessAppInfo.installDate instanceof Date).shouldBeTrue();
		valueOf(testRun, harnessAppInfo.installDate).shouldNotBeNull();
		valueOf(testRun, harnessAppInfo.size).shouldBeNumber();
		valueOf(testRun, calcAppInfo.version).shouldBeString();
		valueOf(testRun, calcAppInfo.iconPath).shouldBeString();
		valueOf(testRun, calcAppInfo.show).shouldBeBoolean();

		finish(testRun);
	}

	// Test - Negative scenario - get Application info with NOT correct parameters
	this.app_info_not_exist = function(testRun) {
		valueOf(testRun, function() {
			applicationObj.getAppInfo(NOT_EXIST_APP_ID);
		}).shouldThrowException();

		finish(testRun);
	}

	this.apps_contexts = function(testRun) {
		var isSuccess,
			runingAppArray;

		valueOf(testRun, function() {
			applicationObj.getAppsContext(function(contexts) {
				var i = 0,
					contextsCount = contexts.length;

				Ti.API.info("contextsCount: " + contextsCount);

				for (; i < contextsCount; i++) {
					valueOf(testRun, contexts[i].toString()).shouldBe('[object TizenApplicationApplicationContext]');
				}

				isSuccess = true; 
				runingAppArray = contexts;
			});
		}).shouldNotThrowException();

		setTimeout(function() {
			valueOf(testRun, isSuccess).shouldBeTrue();
			valueOf(testRun, runingAppArray.length).shouldBeGreaterThan(0);

			for (var i = 0, len = runingAppArray.length; i < len; i++) {
				valueOf(testRun, runingAppArray[i].id).shouldNotBeUndefined();
				valueOf(testRun, runingAppArray[i].id).shouldBeString();
				valueOf(testRun, runingAppArray[i].appId).shouldBeString();	
			}

			finish(testRun);
		}, 2000);
	}

	// Test - check does getAppsContext return harness id
	this.apps_contexts_harness = function(testRun) {
		Ti.API.info('Start apps_contexts_harness');

		var runingAppArray = [],
			isHarness,
			harness = applicationObj.getAppInfo();

		valueOf(testRun, harness).shouldBe('[object TizenApplicationApplicationInformation]');
		valueOf(testRun, harness.id).shouldNotBeUndefined();
		valueOf(testRun, function() {
			applicationObj.getAppsContext(function(contexts) {
				runingAppArray = contexts;
			});
		}).shouldNotThrowException();

		finish(testRun);

		setTimeout(function() {
			isHarness = _runingAppWithId(runingAppArray, harness.id);

			valueOf(testRun, runingAppArray.length).shouldBeGreaterThan(0);
			valueOf(testRun, isHarness).shouldBeTrue();
			
			finish(testRun);
		}, 1000);
	}

	// Test - Negative scenario - Does getAppsContext catch exception with no parameters
	this.apps_contexts_no_params = function(testRun) {
		valueOf(testRun, function() {
			applicationObj.getAppsContext();
		}).shouldThrowException();

		finish(testRun);
	}

	// Test - laucn calc application and kill calc application
	this.calc_launch = function(testRun) {
		// Launch Calculator
		valueOf(testRun, function() {
			applicationObj.launch(CALC_APP_ID); 
		}).shouldNotThrowException();

		// Call getAppsContext for recieving all running application
		valueOf(testRun, function() {
			applicationObj.getAppsContext(function(contexts) {
				isRuningCalc = _runingAppWithId(contexts, CALC_APP_ID);

				valueOf(testRun, contexts.length).shouldBeGreaterThan(0);
				valueOf(testRun, isRuningCalc).shouldBeTrue();

				finish(testRun);
			});
		}).shouldNotThrowException();
	}

	// Test - Negative scenario - try to launch NOT existing app	
	this.launch_not_exist = function(testRun) {
		var isError;

		valueOf(testRun, function() {
			applicationObj.launch(
				NOT_EXIST_APP_ID,
				function() {
					Ti.APi.info('Launched success.');
				}, 
				function(error) {
					Ti.API.error("Error: " + error.message);

					isError = true;
				}
			);
		}).shouldNotThrowException();

		setTimeout(function() {
			valueOf(testRun, isError).shouldBeTrue();

			finish(testRun);
		}, 2000);
	}

	// Hides harnes app - MAY HAVE PROBLEM FOR OTHER TESTS
	this.harness_hide = function(testRun) {
		var currApp,
			appId;

		currApp = applicationObj.getCurrentApplication();
		appId = currApp.appInfo.id;

		valueOf(testRun, currApp).shouldBe('[object TizenApplicationApplication]');
		valueOf(testRun, currApp.appInfo).shouldBe('[object TizenApplicationApplicationInformation]');
		valueOf(testRun, appId).shouldNotBeUndefined();
		valueOf(testRun, function() {
			Ti.API.info('hide');

			currApp.hide();
		}).shouldNotThrowException();

		applicationObj.launch(appId);

		finish(testRun);
	};

	// Test - launch image from another appControl
	this.launchAppControl = function(testRun) {
		var serviceLaunched,
			isError = false,
			appControl,
			appControlReplyCallback = { 
				// Callee sent a reply
				onsuccess: function(data) {
					Ti.API.info('Success reply.');

					for (var i = 0; i < data.length; i++) {
						valueOf(testRun, data[i]).shouldBe('[object TizenApplicationApplicationControlData]');
					}
				},
				// Something went wrong
				onfailure: function() {
				   Ti.API.info('The launch application control failed.');

				   reportError(testRun, 'The following error occurred: ' + e.message);
				}
			};

		valueOf(testRun, function() {
			appControl = applicationObj.createApplicationControl({
				operation: "http://tizen.org/appcontrol/operation/create_content"
				, uri: null
				, mime: "image/jpeg"
				, category: null
			});
		}).shouldNotThrowException();
		valueOf(testRun, appControl).shouldBe('[object TizenApplicationApplicationControl]');
		valueOf(testRun, function() {
			applicationObj.launchAppControl(appControl, null,
				function() {
					serviceLaunched = true;

					Ti.API.info("launch application control succeed"); 
				},
				function(e) {
					isError = true;

					Ti.API.info("launch application control failed. reason: " + e.message); 
					reportError(testRun, 'The following error occurred: ' + e.message);
				},
				appControlReplyCallback
			);
		}).shouldNotThrowException();

		setTimeout(function() {
			valueOf(testRun, serviceLaunched).shouldBeTrue();
			valueOf(testRun, isError).shouldBeFalse();

			finish(testRun);
		}, 5000);
	}
}
