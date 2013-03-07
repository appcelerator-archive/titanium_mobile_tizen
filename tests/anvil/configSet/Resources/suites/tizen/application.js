module.exports = new function() {
	var CALC_APP_ID = 'tlp6xwqzos.Calculator',
		NOT_EXIST_APP_ID = 'Not_exist_app_id.asdfs',
		finish,
		valueOf;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
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
		{name: 'calc_launch'},
		{name: 'launchAppControl'},
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
			Ti.Tizen.Application.getAppsInfo(function(applications) {
				appInstalledCount = applications.length;
				Ti.API.info("appInstalledCount: " + appInstalledCount);

				valueOf(testRun, appInstalledCount).shouldBeGreaterThan(0);			

				for (var i = 0, len = appInstalledCount; i < len; i++) {
					valueOf(testRun, applications[i]).shouldNotBeUndefined();
					valueOf(testRun, applications[i]).shouldBeObject();
					valueOf(testRun, applications[i].toString()).shouldBe('[object TiTizenApplicationApplicationInformation]');

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

		calcAppInfo = Ti.Tizen.Application.getAppInfo(CALC_APP_ID),
		harnessAppInfo = Ti.Tizen.Application.getAppInfo();

		valueOf(testRun, calcAppInfo).shouldBe('[object TiTizenApplicationApplicationInformation]');
		valueOf(testRun, calcAppInfo).shouldNotBeUndefined();
		valueOf(testRun, calcAppInfo.id).shouldBeEqual(CALC_APP_ID);
		valueOf(testRun, calcAppInfo.name).shouldBeEqual('Calculator-Ref');
		valueOf(testRun, calcAppInfo.installDate instanceof Date).shouldBeTrue();
		valueOf(testRun, calcAppInfo.size).shouldBeNumber();
		valueOf(testRun, calcAppInfo.version).shouldBeString();
		valueOf(testRun, calcAppInfo.iconPath).shouldBeString();
		valueOf(testRun, calcAppInfo.show).shouldBeBoolean();

		valueOf(testRun, harnessAppInfo).shouldBe('[object TiTizenApplicationApplicationInformation]');
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
			Ti.Tizen.Application.getAppInfo(NOT_EXIST_APP_ID);
		}).shouldThrowException();

		finish(testRun);
	}

	this.apps_contexts = function(testRun) {
		var isSuccess,
			runingAppArray;

		valueOf(testRun, function() {
			Ti.Tizen.Application.getAppsContext(function(contexts) {
				var i = 0,
					contextsCount = contexts.length;

				Ti.API.info("contextsCount: " + contextsCount);

				for (; i < contextsCount; i++) {
					valueOf(testRun, contexts[i].toString()).shouldBe('[object TiTizenApplicationApplicationContext]');
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
			harness = Ti.Tizen.Application.getAppInfo();

		valueOf(testRun, harness).shouldBe('[object TiTizenApplicationApplicationInformation]');
		valueOf(testRun, harness.id).shouldNotBeUndefined();
		valueOf(testRun, function() {
			Ti.Tizen.Application.getAppsContext(function(contexts) {
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
			Ti.Tizen.Application.getAppsContext();
		}).shouldThrowException();

		finish(testRun);
	}

	// Test - laucn calc application and kill calc application
	this.calc_launch = function(testRun) {
		// Launch Calculator
		valueOf(testRun, function() {
			Ti.Tizen.Application.launch(CALC_APP_ID); 
		}).shouldNotThrowException();

		// Call getAppsContext for recieving all running application
		valueOf(testRun, function() {
			Ti.Tizen.Application.getAppsContext(function(contexts) {
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
			Ti.Tizen.Application.launch(
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

		currApp = Titanium.Tizen.Application.getCurrentApplication();
		appId = currApp.appInfo.id;

		valueOf(testRun, currApp).shouldBe('[object TiTizenApplicationApplication]');
		valueOf(testRun, currApp.appInfo).shouldBe('[object TiTizenApplicationApplicationInformation]');
		valueOf(testRun, appId).shouldNotBeUndefined();
		valueOf(testRun, function() {
			Ti.API.info('hide');

			currApp.hide();
		}).shouldNotThrowException();

		Ti.Tizen.Application.launch(appId);

		finish(testRun);
	};

	// Test - launch image from another appControl
	this.launchAppControl = function(testRun) {
		var serviceLaunched,
			isError,
			appControl,
			appControlReplyCallback = { 
				// Callee sent a reply
				onsuccess: function(data) {
					Ti.API.info('success');
					valueOf(testRun, data).shouldBe('[object TiTizenApplicationApplicationControlData]');

					for (var i = 0; i < data.length; i++) {
						Ti.API.info("#" + i + " key:" + data[i].key);
						
						for (var j = 0; j < data[i].value.length; j++) {
							Ti.API.info("   value#" + j + ":" + data[i].value[j]);
						}
					}
				},
				// Something went wrong
				onfailure: function() {
				   Ti.API.info('The launch application control failed');
				}
			};

		valueOf(testRun, function() {
			appControl = Ti.Tizen.Application.createApplicationControl({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpeg',
				category: null
			});
		}).shouldNotThrowException();
		valueOf(testRun, appControl).shouldBe('[object TiTizenApplicationApplicationControl]');
		valueOf(testRun, function() {
			 Ti.Tizen.Application.launchAppControl(
				appControl, 
				null,
				function() { 
					Ti.API.info("Launch application control succeed.");

					serviceLaunched = true;
				},
				function(e) {
					Ti.API.info("Launch application control failed. reason: " + e.message);

					isError = true;
				},
				appControlReplyCallback
			);
		}).shouldNotThrowException();

		setTimeout(function() {
			valueOf(testRun, serviceLaunched).shouldBeTrue();
			valueOf(testRun, isError).shouldBeFalse();

			finish(testRun);
		}, 5000);
	};
}
