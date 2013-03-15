/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		notificationObj,
		applicationObj;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		notificationObj = require('Ti/Tizen/Notification');
		applicationObj = require('Ti/Tizen/Application');
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
		notificationObj.removeAll();

		// Create app service for notification
		var notificationArr,
			appControl = applicationObj.createApplicationControl({
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
				appControl: appControl
			},
			notification = notificationObj.createStatusNotification({
				statusType: notificationObj.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification',
				notificationInitDict: notificationDict
			});

		// Post created notification to tray               
		valueOf(testRun, function() {
			notificationObj.post(notification);
		}).shouldNotThrowException();

		notificationArr = notificationObj.getAll();
		// Get notification from tray and check is it instance of status notification
		valueOf(testRun, notificationArr[0] instanceof Tizen.Notification.StatusNotification).shouldBeTrue();
		notificationObj.removeAll();

		finish(testRun);
	}
	
	// Fails https://bugs.tizen.org/jira/browse/TDIST-148
	this.notificationGet = function(testRun) {
		// Clear notification tray
		notificationObj.removeAll();

		// Create notification and add it to tray
		var notId,
			notificationFrom,
			appControl = applicationObj.createApplicationControl({
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
				appControl: appControl
			},
			notification = notificationObj.createStatusNotification({
				statusType: notificationObj.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification',
				notificationInitDict: notificationDict
			});
			

		valueOf(testRun, function() {
			notificationObj.post(notification);
		}).shouldNotThrowException();

		// Memorize notification id for use later
		notId = notification.id;
		Ti.API.info(notId);
		// Try to get notification by id
		valueOf(testRun, function() {      
			notificationFrom = notificationObj.get(notId);
		}).shouldNotThrowException();
		// Compare property of gotten notification with coresponding property of posted notification
		valueOf(testRun, notificationFrom.content).shouldBe(notificationDict.content);
		valueOf(testRun, notificationFrom.statusType).shouldBe(notification.statusType);
		valueOf(testRun, notificationFrom.title).shouldBe(notification.title);

		notificationObj.removeAll();

		finish(testRun);
	}

	// Fails https://bugs.tizen.org/jira/browse/TDIST-148
	this.notificationUpdate = function(testRun) {
		// Clear notification tray
		notificationObj.removeAll();

		// Create notification and add it to tray
		var notId,
			notificationFrom,
			appControl = applicationObj.createApplicationControl({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			notificationDict = {
					content: 'This is a simple notificaiton.',
					iconPath: 'images/image1.jpg', 
					vibration: true, 
					appControl: appControl},
			notification = notificationObj.createStatusNotification({
				statusType: notificationObj.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification',
				notificationInitDict: notificationDict
			});

		valueOf(testRun, function() {
			notificationObj.post(notification);
		}).shouldNotThrowException();

		// Memorize notification id for use later
		notId = notification.id;

		// Change notification content and try to update this notification
		notification.content = 'New Content';

		valueOf(testRun, function() {      
			notificationObj.update(notification);
		}).shouldNotThrowException();

		// Get notification by id and compare it content attribute
		valueOf(testRun, function() {      
			notificationFrom = notificationObj.get(notId);
		}).shouldNotThrowException();
		valueOf(testRun, notificationFrom.content).shouldBe(notification.content);

		notificationObj.removeAll();

		finish(testRun);
	}
	
	// Fails https://bugs.tizen.org/jira/browse/TDIST-148
	this.notificationRemove = function(testRun) {
		// Clear notification tray
		notificationObj.removeAll();

		// Create first notification and add it to tray
		var notId,
			notificationFrom,
			notId1,
			notificationFrom1,
			appControl = applicationObj.createApplicationControl({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			notificationDict = {
				content: 'This is a simple notificaiton 1.',
				iconPath: 'images/image1.jpg', 
				vibration: true, 
				appControl: appControl
			},
			notification = notificationObj.createStatusNotification({
				statusType: notificationObj.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification 1',
				notificationInitDict: notificationDict
			}),
			appControl1 = applicationObj.createApplicationControl({
				operation: 'http://tizen.org/appcontrol/operation/create_content',
				uri: null,
				mime: 'image/jpg',
				category: null
			}),
			notificationDict1 = {
				content: 'This is a simple notificaiton 2.',
				iconPath: 'images/image1.jpg',
				vibration: true, 
				appControl: appControl1
			},
			notification1 = notificationObj.createStatusNotification({
				statusType: notificationObj.STATUS_NOTIFICATION_TYPE_SIMPLE,
				title: 'Simple notification 2',
				notificationInitDict: notificationDict
			});


		valueOf(testRun, function() {
			notificationObj.post(notification);
		}).shouldNotThrowException();

		// Memorize id for use later
		notId = notification.id;

		valueOf(testRun, function() {      
			notificationObj.post(notification1);
		}).shouldNotThrowException();

		// Memorize second id 
		notId1 = notification1.id;

		// Try to remove notification by id
		valueOf(testRun, function() {      
			notificationObj.remove(notId);
		}).shouldNotThrowException();

		// Try to get removed notification: it should cause exception
		valueOf(testRun, function() {      
			notificationFrom = notificationObj.get(notId);
		}).shouldThrowException();

		// Try to remove all notification in tray
		valueOf(testRun, function() {      
			notificationObj.removeAll();
		}).shouldNotThrowException();

		//try to get second notification and it should be removed
		valueOf(testRun, function() {      
			notificationFrom1 = notificationObj.get(notId1);
		}).shouldThrowException();

		notificationObj.removeAll();

		finish(testRun);
	}
}
