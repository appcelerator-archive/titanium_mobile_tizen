/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		alarmObj;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		alarmObj = require('Ti/Tizen/Alarm');
	}

	this.name = 'alarm';
	this.tests = [
		{name: 'alarmAdd'},
		{name: 'alarmGet'},
		{name: 'alarmRemove'},
		{name: 'alarmRelative'},
		{name: 'alarmAbsolute'}
	]

	this.alarmAdd = function(testRun) {
		var alarm,
			tizenArr,
			date = new Date(2012, 12, 21, 8, 0);

		alarmObj.removeAll();

		// Alarm in 10 seconds (relative)
		alarm = alarmObj.createAlarmRelative({
			delay: 10
		});

		valueOf(testRun, alarm instanceof Tizen.Alarm.AlarmRelative).shouldBeTrue();

		alarmObj.add(alarm, 'http://tizen.org/alarm-clock');

		// Set an alarm on December 21st 2012 08:00
		alarm = alarmObj.createAlarmAbsolute({ 
			date: date
		});

		valueOf(testRun, alarm instanceof Tizen.Alarm.AlarmAbsolute).shouldBeTrue();

		alarmObj.add(alarm, 'http://tizen.org/alarm-clock');

		tizenArr = alarmObj.getAll();

		valueOf(testRun, (tizenArr[0] instanceof Tizen.Alarm.AlarmAbsolute || tizenArr[0] instanceof Tizen.Alarm.AlarmRelative)).shouldBeTrue();

		valueOf(testRun, tizenArr.length).shouldBe(2);

		finish(testRun);
	}
	
	this.alarmGet = function(testRun) {	
		var alarm,
			alarm1,
			alarm2, 
			alarm3,
			relative_id,
			absolute_id,
			date = new Date(2012, 12, 21, 8, 0);

		alarmObj.removeAll();

		// Alarm in 10 seconds (relative)
		alarm = alarmObj.createAlarmRelative({
			delay: 10
		});

		// Set an alarm on December 21st 2012 08:00
		alarm1 = alarmObj.createAlarmAbsolute({ 
			date: date
		});

		alarmObj.add(alarm, 'http://tizen.org/alarm-clock');
		alarmObj.add(alarm1, 'http://tizen.org/alarm-clock');

		relative_id = alarm.id;
		absolute_id = alarm1.id;

		valueOf(testRun, function() {
			alarm2 = alarmObj.get(relative_id);
			alarm3 = alarmObj.get(absolute_id);
		}).shouldNotThrowException();

		valueOf(testRun, alarm2 instanceof Tizen.Alarm.AlarmRelative).shouldBeTrue();
		valueOf(testRun, alarm3 instanceof Tizen.Alarm.AlarmAbsolute).shouldBeTrue();

		alarmObj.removeAll();

		valueOf(testRun, function() {
			var alarmTmp = alarmObj.get(absolute_id);
			valueOf(testRun, alarm instanceof Tizen.Alarm.AlarmAbsolute).shouldBeTrue();
			
			alarmTmp = alarmObj.get(relative_id);
		}).shouldThrowException();

		finish(testRun);
	}
	
	this.alarmRemove = function(testRun) {
		var alarm,
			alarm1,
			relative_id,
			alarmArr,
			absolute_id,
			date = new Date(2012, 12, 21, 8, 0);
		
		alarmObj.removeAll();
		alarmArr = alarmObj.getAll();
		valueOf(testRun, alarmArr.length).shouldBe(0);

		//Alarm in 10 seconds (relative)
		alarm = alarmObj.createAlarmRelative({
			delay: 10
		});
		alarm1 = alarmObj.createAlarmAbsolute({ 
			date: date
		});
		alarmObj.add(alarm, 'http://tizen.org/alarm-clock');
		alarmObj.add(alarm1, 'http://tizen.org/alarm-clock');
		relative_id = alarm.id;
		absolute_id = alarm1.id;

		valueOf(testRun, function() {
			alarmObj.remove(absolute_id);
		}).shouldNotThrowException();

		valueOf(testRun, function() {
			alarmObj.remove(absolute_id);
		}).shouldThrowException();

		finish(testRun);
	}

	this.alarmRelative = function(testRun) {
		var alarm,
			alarmId,
			delay = 2 * alarmObj.PERIOD_MINUTE,
			period = alarmObj.PERIOD_HOUR;

		alarmObj.removeAll();
		alarm = alarmObj.createAlarmRelative({
			delay: delay,
			period: period
		});
		alarmObj.add(alarm, 'http://tizen.org/alarm-clock');
		alarmId = alarm.id;

		valueOf(testRun, function() {
			var remaining = alarm.getRemainingSeconds();
		}).shouldNotThrowException();
		valueOf(testRun, alarm.delay).shouldBe(delay);

		alarm = alarmObj.get(alarmId);

		valueOf(testRun, function() {
			var fromReaming = alarm.getRemainingSeconds();
		});
		valueOf(testRun, alarm.delay).shouldBe(delay);

		finish(testRun);
	}

	this.alarmAbsolute = function(testRun) {
		alarmObj.removeAll();

		var alarm,
			alarmId,
			remaining,
			alarmFrom,
			fromReaming,
			date = new Date(),
			time = date.getTime() + 60000,
			period = alarmObj.PERIOD_HOUR;

		date.setTime(time);
		alarm = alarmObj.createAlarmAbsolute({
			date: date, period: period
		});
		alarmObj.add(alarm, 'http://tizen.org/alarm-clock');
		alarmId = alarm.id;
		remaining = alarm.getNextScheduledDate();

		valueOf(testRun, remaining.toDateString()).shouldBe(alarm.date.toDateString());

		alarmFrom = alarmObj.get(alarmId),
		fromReaming = alarmFrom.getNextScheduledDate();

		valueOf(testRun, fromReaming.toDateString()).shouldBe(date.toDateString());

		alarmObj.removeAll();
		finish(testRun);
	}
}