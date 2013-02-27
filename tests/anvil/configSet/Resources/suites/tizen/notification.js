/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	// Most of the tests fail due to the Tizen bug:
	// https://bugs.tizen.org/jira/browse/TDIST-148
	this.name = 'notification';
	this.tests = [
		{name: 'notificationPost'},
		{name: 'notificationGet'},
		{name: 'notificationUpdate'},
		{name: 'notificationRemove'}
	];

	this.notificationPost = function(testRun) {
		// Clear notification tray
		Ti.Tizen.Notification.removeAll();

		// Create app service for notification
		var notificationArr,
			appService = Ti.Tizen.Application.createApplicationService({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			// Create dictionary with parameters for status notification
			notificationDict = {
				content: 'This is a simple notificaiton.',
				iconPath: 'images/image1.jpg', 
				vibration: true, 
				service: appService
			},
			notification = Ti.Tizen.Notification.createStatusNotification({
				statusType: Ti.Tizen.Notification.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification',
				notificationInitDict: notificationDict
			});

		// Post created notification to tray               
		valueOf(testRun, function() {
			Ti.Tizen.Notification.post(notification);
		}).shouldNotThrowException();

		notificationArr = Ti.Tizen.Notification.getAll();
		// Get notification from tray and check is it instance of status notification
		valueOf(testRun, notificationArr[0] instanceof Ti.Tizen.Notification.StatusNotification).shouldBeTrue();
		Ti.Tizen.Notification.removeAll();

		finish(testRun);
	}
	
	// Fails https://bugs.tizen.org/jira/browse/TDIST-148
	this.notificationGet = function(testRun) {
		// Clear notification tray
		Ti.Tizen.Notification.removeAll();

		// Create notification and add it to tray
		var notId,
			appService = Ti.Tizen.Application.createApplicationService({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			notificationDict = {
				content: 'This is a simple notificaiton.',
				iconPath: 'images/image1.jpg',
				soundPath: undefined, 
				vibration: true, 
				service: appService
			},
			notification = Ti.Tizen.Notification.createStatusNotification({
				statusType: Ti.Tizen.Notification.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification',
				notificationInitDict: notificationDict
			});
			

		valueOf(testRun, function() {
			Ti.Tizen.Notification.post(notification);
		}).shouldNotThrowException();

		// Memorize notification id for use later
		notId = notification.content;

		// Try to get notification by id
		valueOf(testRun, function() {      
			var notificationFrom = Ti.Tizen.Notification.get(notId);
		}).shouldNotThrowException();
		// Compare property of gotten notification with coresponding property of posted notification
		valueOf(testRun, notificationFrom.content).shouldBe(notificationDict.content);
		valueOf(testRun, notificationFrom.statusType).shouldBe(notification.statusType);
		valueOf(testRun, notificationFrom.title).shouldBe(notificationDict.title);

		Ti.Tizen.Notification.removeAll();

		finish(testRun);
	}

	// Fails https://bugs.tizen.org/jira/browse/TDIST-148
	this.notificationUpdate = function(testRun) {
		// Clear notification tray
		Ti.Tizen.Notification.removeAll();

		// Create notification and add it to tray
		var notId,
			appService = Ti.Tizen.Application.createApplicationService({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			notificationDict = {
					content: 'This is a simple notificaiton.',
					iconPath: 'images/image1.jpg', 
					vibration: true, 
					service: appService},
			notification = Ti.Tizen.Notification.createStatusNotification({
				statusType: Ti.Tizen.Notification.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification',
				notificationInitDict: notificationDict
			});

		valueOf(testRun, function() {
			Ti.Tizen.Notification.post(notification);
		}).shouldNotThrowException();

		// Memorize notification id for use later
		notId = notification.id;

		// Change notification content and try to update this notification
		notification.content = 'New Content';

		valueOf(testRun, function() {      
			Ti.Tizen.Notification.update(notification);
		}).shouldNotThrowException();

		// Get notification by id and compare it content attribute
		valueOf(testRun, function() {      
			var	notificationFrom = Ti.Tizen.Notification.get(notId);
		}).shouldNotThrowException();
		valueOf(testRun, notificationFrom.content).shouldBe(notification.content);

		Ti.Tizen.Notification.removeAll();

		finish(testRun);
	}
	
	// Fails https://bugs.tizen.org/jira/browse/TDIST-148
	this.notificationRemove = function(testRun) {
		// Clear notification tray
		Ti.Tizen.Notification.removeAll();

		// Create first notification and add it to tray
		var notId,
			notId1,
			appService = Ti.Tizen.Application.createApplicationService({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			notificationDict = {
				content: 'This is a simple notificaiton 1.',
				iconPath: 'images/image1.jpg', 
				vibration: true, 
				service: appService
			},
			notification = Ti.Tizen.Notification.createStatusNotification({
				statusType: Ti.Tizen.Notification.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification 1',
				notificationInitDict: notificationDict
			}),
			appService1 = Ti.Tizen.Application.createApplicationService({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			notificationDict1 = {
				content: 'This is a simple notificaiton 2.',
				iconPath: 'images/image1.jpg',
				vibration: true, 
				service: appService1
			},
			notification1 = Ti.Tizen.Notification.createStatusNotification({
				statusType: Ti.Tizen.Notification.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification 2',
				notificationInitDict: notificationDict
			});


		valueOf(testRun, function() {
			Ti.Tizen.Notification.post(notification);
		}).shouldNotThrowException();

		// Memorize id for use later
		notId = notification.id;

		valueOf(testRun, function() {      
			Ti.Tizen.Notification.post(notification1);
		}).shouldNotThrowException();

		// Memorize second id 
		notId1 = notification1.id;

		// Try to remove notification by id
		valueOf(testRun, function() {      
			Ti.Tizen.Notification.remove(notId);
		}).shouldNotThrowException();

		// Try to get removed notification: it should cause exception
		valueOf(testRun, function() {      
			var	notificationFrom = Ti.Tizen.Notification.get(notId);
		}).shouldThrowException();

		// Try to remove all notification in tray
		valueOf(testRun, function() {      
			Ti.Tizen.Notification.removeAll();
		}).shouldThrowException();

		//try to get second notification and it should be removed
		valueOf(testRun, function() {      
			var notificationFrom1 = Ti.Tizen.Notification.get(notId1);
		}).shouldThrowException();

		Ti.Tizen.Notification.removeAll();

		finish(testRun);
	}
}
