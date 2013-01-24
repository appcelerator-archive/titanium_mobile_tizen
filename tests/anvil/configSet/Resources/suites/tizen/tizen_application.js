module.exports = new function() {
	var CALC_APP_ID = "org.tizen.calculator";
	var NOT_EXIST_APP_ID = "Not_exist_app_id.asdfs"

	var finish;
	var valueOf;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}	

	this.name = "tizen application";
	this.tests = [
		{name: "apps_info"},
		{name: "app_info", timeout: 5000},		
		{name: "app_info_not_exist", timeout: 5000},
		{name: "apps_contexts", timeout: 5000},
		{name: "apps_contexts_harness", timeout: 5000},
		{name: "apps_contexts_no_params", timeout: 5000},
		{name: "calc_launch", timeout: 5000},
		{name: "launch_not_exist", timeout: 5000},
		{name: "kill_not_exist", timeout: 5000}
		//There are tests but they could launc stand alone.
		//Because this code impact for another tests
		/*,
		{name: "harnes_hide", timeout: 5000},
		{name: "launchService", timeout: 5000}
		*/
	]

	//Test - List of Installed Applications
	this.apps_info = function(testRun) {
		var isCalcAppOnEmulator = false;
		
		var appInstalledCount = 0;
		valueOf(testRun, function() {
		tizen.application.getAppsInfo(function(applications){	
			appInstalledCount = applications.length;				
			for (var i = 0; i <applications.length; i++){
				if(applications[i].id && applications[i].id===CALC_APP_ID){
					isCalcAppOnEmulator = true;					
				}	
				
			}
		});	
		}).shouldNotThrowException();
		setTimeout(function(){
			valueOf(testRun, appInstalledCount).shouldBeGreaterThan(0);	
			valueOf(testRun, isCalcAppOnEmulator).shouldBeTrue();	
			finish(testRun);
		} , 1000);
		
	}
	
	//Test - get Application info with correct info
	this.app_info = function(testRun) {
		var calcAppInfo = tizen.application.getAppInfo(CALC_APP_ID);
		valueOf(testRun, calcAppInfo).shouldNotBeUndefined();
		valueOf(testRun, calcAppInfo.id).shouldBeEqual(CALC_APP_ID);
		valueOf(testRun, calcAppInfo.name).shouldBeEqual("Calculator");	
		valueOf(testRun, calcAppInfo.installDate instanceof Date).shouldBeTrue();
		valueOf(testRun, calcAppInfo.size).shouldBeNumber();
		valueOf(testRun, calcAppInfo.version).shouldBeString();
		valueOf(testRun, calcAppInfo.iconPath).shouldBeString();		
		valueOf(testRun, calcAppInfo.show).shouldBeBoolean();	

		var harnessAppInfo = tizen.application.getAppInfo();	
		valueOf(testRun, harnessAppInfo).shouldNotBeUndefined();
		valueOf(testRun, harnessAppInfo.id).shouldBeString();
		valueOf(testRun, harnessAppInfo.name).shouldBeEqual("test_harness");	
		valueOf(testRun, harnessAppInfo.installDate instanceof Date).shouldBeTrue();
		valueOf(testRun, harnessAppInfo.installDate).shouldNotBeNull();
		valueOf(testRun, harnessAppInfo.size).shouldBeNumber();	
		valueOf(testRun, calcAppInfo.version).shouldBeString();
		valueOf(testRun, calcAppInfo.iconPath).shouldBeString();		
		valueOf(testRun, calcAppInfo.show).shouldBeBoolean();			
		finish(testRun);		 
	}	
	//Test - Negative scenario - get Application info with NOT correct parameters
	this.app_info_not_exist = function(testRun) {		
		valueOf(testRun, function() {
			tizen.application.getAppInfo(NOT_EXIST_APP_ID);
		}).shouldThrowException();
		finish(testRun);		 
	}		
	
	//Test - check does getAppsContext launch
	this.apps_contexts = function(testRun) {		
		var isSucces = false;
		var runingAppArray;
		valueOf(testRun, function() {
			tizen.application.getAppsContext(function(contexts) {isSucces = true;runingAppArray=contexts});
		}).shouldNotThrowException();	
		setTimeout(
			function(){
				valueOf(testRun, isSucces).shouldBeTrue();	
				valueOf(testRun, runingAppArray.length).shouldBeGreaterThan(0);
				valueOf(testRun, runingAppArray[0].id).shouldBeString();
				valueOf(testRun, runingAppArray[0].appId).shouldBeString();
				finish(testRun);
			} 
		, 1000);
	}
	function _runingAppWithId(runingAppArray,appId){
		for (var  i = 0; i < runingAppArray.length; i++) {
			if (runingAppArray[i].appId == appId) {							
				return true;
			}
		};
		return false;
	}	
	
	//Test - check does getAppsContext return harness id
	this.apps_contexts_harness = function(testRun) {	

		var runingAppArray = [];
		var isHarness = false;
		var harnessId = tizen.application.getAppInfo().id;
		
		valueOf(testRun, function() {
			tizen.application.getAppsContext(function (contexts) {runingAppArray = contexts;});
		}).shouldNotThrowException();	
    	setTimeout(
			function(){
				isHarness = _runingAppWithId(runingAppArray,harnessId);
				valueOf(testRun, runingAppArray.length).shouldBeGreaterThan(0);
				valueOf(testRun, isHarness).shouldBeTrue();	
				finish(testRun);
		} 
		, 1000);
	}	
	
	//Test - Negative scenario - Does getAppsContext catch exception with no parameters
	this.apps_contexts_no_params = function(testRun) {	
		
		valueOf(testRun, function() {
			tizen.application.getAppsContext();
		}).shouldThrowException();	
			
		finish(testRun);
	}
	
	//Test - laucn calc application and kill calc application
	this.calc_launch = function(testRun) {	
	
		var isRuningCalc = false;

		//Launch Calculator		
		valueOf(testRun, function() {
			tizen.application.launch(CALC_APP_ID); 
		}).shouldNotThrowException();
	
		//Call getAppsContext for recieving all running application
		setTimeout(function(){
			valueOf(testRun, function() {
				tizen.application.getAppsContext(function (contexts) {runingAppArray = contexts;});
			}).shouldNotThrowException();	
		} , 1000);

		//Check existing calc application in list of running app
		setTimeout(function(){
			isRuningCalc = _runingAppWithId(runingAppArray,CALC_APP_ID);
			valueOf(testRun, isRuningCalc).shouldBeTrue();		
			valueOf(testRun, function() {
				//kill Calc app
				tizen.application.kill(CALC_APP_ID); 
			}).shouldNotThrowException();
			
			//Call getAppsContext for recieving all running application
			valueOf(testRun, function() {
				tizen.application.getAppsContext(function (contexts) {runingAppArray = contexts;});
			}).shouldNotThrowException();	
			finish(testRun);	
		} , 2000);
		
		//Check NOT existing calc application in the list of running app
		setTimeout(function(){
			isRuningCalc = _runingAppWithId(runingAppArray,CALC_APP_ID);
			valueOf(testRun, isRuningCalc).shouldBeFalse();		
			finish(testRun);
		} , 3000);		

	}
	//Test - Negative scenario - try to launch NOT existing app	
	this.launch_not_exist = function(testRun) {	
		var isError = false;
		valueOf(testRun, function() {
			tizen.application.launch(NOT_EXIST_APP_ID,function(){},function(){isError= true;}); 	
		}).shouldNotThrowException();	
		setTimeout(function(){
			valueOf(testRun, isError).shouldBeTrue();		
			finish(testRun);		
		} , 1000);			
	}	
	
	//Test - Negative scenario - try to kill NOT existing app
	this.kill_not_exist = function(testRun) {	
		var isError = false;
		valueOf(testRun, function() {
			tizen.application.kill(NOT_EXIST_APP_ID,function(){},function(){isError= true;}); 	
		}).shouldNotThrowException();	
		setTimeout(function(){
			valueOf(testRun, isError).shouldBeTrue();		
			finish(testRun);		
		} , 1000);			
	}
	
	// test - Hide harnes app - MAY HAVE PROBLEM FOR OTHER TESTS
	this.harnes_hide = function(testRun) {	
		valueOf(testRun, function() {
			tizen.application.hide();
		}).shouldNotThrowException();
		finish(testRun);
	};	
	
	
	//Test - launch image from another service
	this.launchService = function(testRun) {
	
		var serviceLaunch = false;
		var isError = false;
		var service;
		valueOf(testRun, function() {
			service = new tizen.ApplicationService("http://tizen.org/appcontrol/operation/pick",null,"IMAGE/*");
		}).shouldNotThrowException();				
    	var serviceReplyCB = { 
    	   // callee now sends a reply 
    	   onsuccess: function(reply) { 
		   
    	      //for (var num = 0; num < reply.data.length; num++) { 
    	         //Ti.API.info("reply.data["+num+"].key = "+ reply.data[num].key); 
    	        // Ti.API.info("reply.data["+num+"].value = "+ reply.data[num].value); 
    	      //} 
			  
    	   } ,
    	   // Something went wrong 
    	   onfail: function() { 
    	      //Ti.API.info('Launch service failed'); 
    	   } 
    	};
		valueOf(testRun, function() {
			tizen.application.launchService(
				service,
				null,
				function() { serviceLaunch = true; }, 
				function(e) { isError = true; }, 
				serviceReplyCB ); 
		}).shouldNotThrowException();	
		setTimeout(function(){
			valueOf(testRun, serviceLaunch).shouldBeTrue();		
			valueOf(testRun, isError).shouldBeFalse();		
			finish(testRun);
		} , 1000);		
	};
	
	
}