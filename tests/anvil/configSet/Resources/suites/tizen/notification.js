/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */



// Most of the tests fail due to the Tizen bug:
// https://bugs.tizen.org/jira/browse/TDIST-148




module.exports = new function() {
	var finish;
	var valueOf;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "notification";
	this.tests = [
		{name: "notificationPost"},
		{name: "notificationGet"},
		{name: "notificationUpdate"},
		{name: "notificationRemove"}
	]

	this.notificationPost = function(testRun) {

		tizen.notification.removeAll(); //clear notification tray

		//create app service for notification

		var appService = new tizen.ApplicationService(
                       "http://tizen.org/appcontrol/operation/create_content",
                       null,
                       "image/jpg",
                       null);

		//create dictionary with parameters for status notification
      	var notificationDict = {
                  content : "This is a simple notificaiton.",
                  iconPath : "images/image1.jpg", 
                  vibration : true, 
                  service : appService};

        //create notification          
       
      	var notification = new tizen.StatusNotification("SIMPLE", 
                  "Simple notification", notificationDict);

        //post created notification to tray               
      	valueOf(testRun, function(){
      		tizen.notification.post(notification);
      	}).shouldNotThrowException();

      	var notification_arr = tizen.notification.getAll();

      	//get notification from tray and check is it instance of status notification

      	valueOf(testRun, notification_arr[0] instanceof tizen.StatusNotification).shouldBeTrue();

        tizen.notification.removeAll();

      	finish(testRun);
	}
	
	this.notificationGet = function(testRun) {

		//clear notification tray
		tizen.notification.removeAll();

		//create notification and add it to tray
		var appService = new tizen.ApplicationService(
                       "http://tizen.org/appcontrol/operation/create_content",
                       null,
                       "image/jpg",
                       null);
      	var notificationDict = {
                  content : "This is a simple notificaiton.",
                  iconPath : "images/image1.jpg",
                  soundPath : undefined, 
                  vibration : true, 
                  service : appService};
       
      	var notification = new tizen.StatusNotification("SIMPLE", 
                  "Simple notification", notificationDict);

                       
      	valueOf(testRun, function(){
      		tizen.notification.post(notification);
      	}).shouldNotThrowException();

      	//memorize notification id for use later
        var notId = notification.content;

        //try to get notification by id
      	valueOf(testRun, function(){      
      			var notification_from = tizen.notification.get(notId);
      	}).shouldNotThrowException();

      	//compare property of gotten notification with coresponding property of posted notification
      	valueOf(testRun, notification_from.content).shouldBe(notificationDict.content);
      	valueOf(testRun, notification_from.statusType).shouldBe(notification.statusType);
      	valueOf(testRun, notification_from.title).shouldBe(notificationDict.title);

        tizen.notification.removeAll();

      	finish(testRun);
	}

	this.notificationUpdate = function(testRun) {
		//clear notification tray
		ttizen.notification.removeAll();

		//create notification and add it to tray

		var appService = new tizen.ApplicationService(
                       "http://tizen.org/appcontrol/operation/create_content",
                       null,
                       "image/jpg",
                       null);
      	var notificationDict = {
                  content : "This is a simple notificaiton.",
                  iconPath : "images/image1.jpg", 
                  vibration : true, 
                  service : appService};
       
      	var notification = new tizen.StatusNotification("SIMPLE", 
                  "Simple notification", notificationDict);
                       
      	valueOf(testRun, function(){
      		tizen.notification.post(notification);
      	}).shouldNotThrowException();

      	//memorize notification id for use later
      	var notId = notification.id;

      	//change notification content and try to update this notification
      	notification.content = "New Content";
      	valueOf(testRun, function(){      
      			tizen.notification.update(notification);
      	}).shouldNotThrowException();

      	//get notification by id and compare it content attribute
      	valueOf(testRun, function(){      
      		var	notification_from = tizen.notification.get(notId);
      	}).shouldNotThrowException();

      	valueOf(testRun, notification_from.content).shouldBe(notification.content);

        tizen.notification.removeAll();

      	finish(testRun);
	}
	
	this.notificationRemove = function(testRun) {
		//clear notification tray
		tizen.notification.removeAll();

		//create first notification and add it to tray
		var appService = new tizen.ApplicationService(
                       "http://tizen.org/appcontrol/operation/create_content",
                       null,
                       "image/jpg",
                       null);
      	var notificationDict = {
                  content : "This is a simple notificaiton 1.",
                  iconPath : "images/image1.jpg", 
                  vibration : true, 
                  service : appService};
       
      	var notification = new tizen.StatusNotification("SIMPLE", 
                  "Simple notification 1", notificationDict);
                       
      	valueOf(testRun, function(){
      		tizen.notification.post(notification);
      	}).shouldNotThrowException();
      	//memorize id for use later
      	var notId = notification.id;

		//create second notification and add it to tray
      	var appService1 = new tizen.ApplicationService(
                       "http://tizen.org/appcontrol/operation/create_content",
                       null,
                       "image/jpg",
                       null);
      	var notificationDict1 = {
                  content : "This is a simple notificaiton 2.",
                  iconPath : "images/image1.jpg",
                  vibration : true, 
                  service : appService1};
       
      	var notification1 = new tizen.StatusNotification("SIMPLE", 
                  "Simple notification 2", notificationDict1);
                       
      	valueOf(testRun, function(){      
      			tizen.notification.post(notification1);
      	}).shouldNotThrowException();
      	//memorize second id 
      	var notId1 = notification1.id;

      	//try to remove notification by id
      	valueOf(testRun, function(){      
      			tizen.notification.remove(notId);
      	}).shouldNotThrowException();

      	//try to get removed notification: it should cause exception
      	valueOf(testRun, function(){      
      		var	notification_from = tizen.notification.get(notId);
      	}).shouldThrowException();

      	//try to remove all notification in tray
      	valueOf(testRun, function(){      
      			tizen.notification.removeAll();
      	}).  ();

      	//try to get second notification and it should be removed
      	valueOf(testRun, function(){      
      		var notification_from1 = tizen.notification.get(notId1);
      	}).shouldThrowException();

        tizen.notification.removeAll();
      	
      	finish(testRun);
	}

}