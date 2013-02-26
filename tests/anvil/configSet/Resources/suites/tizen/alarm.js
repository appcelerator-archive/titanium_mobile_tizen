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

		Ti.Tizen.Alarm.removeAll();
		
		// Alarm in 10 seconds (relative)
		alarm = Ti.Tizen.Alarm.createAlarmRelative({
			delay: 10
		});
		
		valueOf(testRun, alarm instanceof Ti.Tizen.Alarm.AlarmRelative).shouldBeTrue();

		Ti.Tizen.Alarm.add(alarm, 'http://tizen.org/alarm-clock');
		
		// Set an alarm on December 21st 2012 08:00
		alarm = Ti.Tizen.Alarm.createAlarmAbsolute({ 
			date: date
		});
		
		valueOf(testRun, alarm instanceof Ti.Tizen.Alarm.AlarmAbsolute).shouldBeTrue();

		Ti.Tizen.Alarm.add(alarm, 'http://tizen.org/alarm-clock');
		
		tizenArr = Ti.Tizen.Alarm.getAll();
		
		valueOf(testRun, (tizenArr[0] instanceof Ti.Tizen.Alarm.AlarmAbsolute || tizenArr[0] instanceof Ti.Tizen.Alarm.AlarmRelative)).shouldBeTrue();
		
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

		Ti.Tizen.Alarm.removeAll();		

		// Alarm in 10 seconds (relative)
		alarm = Ti.Tizen.Alarm.createAlarmRelative({
			delay: 10
		});

		// Set an alarm on December 21st 2012 08:00
		alarm1 = Ti.Tizen.Alarm.createAlarmAbsolute({ 
			date: date
		});

		Ti.Tizen.Alarm.add(alarm, 'http://tizen.org/alarm-clock');
		Ti.Tizen.Alarm.add(alarm1, 'http://tizen.org/alarm-clock');

		relative_id = alarm.id;
		absolute_id = alarm1.id;

		valueOf(testRun, function() {
			alarm2 = Ti.Tizen.Alarm.get(relative_id);
			alarm3 = Ti.Tizen.Alarm.get(absolute_id);
		}).shouldNotThrowException();

		valueOf(testRun, alarm2 instanceof Ti.Tizen.Alarm.AlarmRelative).shouldBeTrue();
		valueOf(testRun, alarm3 instanceof Ti.Tizen.Alarm.AlarmAbsolute).shouldBeTrue();

		Ti.Tizen.Alarm.removeAll();

		valueOf(testRun, function() {
			var alarmTmp = Ti.Tizen.Alarm.get(absolute_id);
			valueOf(testRun, alarm instanceof Ti.Tizen.Alarm.AlarmAbsolute).shouldBeTrue();
			
			alarmTmp = Ti.Tizen.Alarm.get(relative_id);
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
		
		Ti.Tizen.Alarm.removeAll();
		alarmArr = Ti.Tizen.Alarm.getAll();
		valueOf(testRun, alarmArr.length).shouldBe(0);

		//Alarm in 10 seconds (relative)
		alarm = Ti.Tizen.Alarm.createAlarmRelative({
			delay: 10
		});
		alarm1 = Ti.Tizen.Alarm.createAlarmAbsolute({ 
			date: date
		});
		Ti.Tizen.Alarm.add(alarm, 'http://tizen.org/alarm-clock');
		Ti.Tizen.Alarm.add(alarm1, 'http://tizen.org/alarm-clock');
		relative_id = alarm.id;
		absolute_id = alarm1.id;

		valueOf(testRun, function() {
			Ti.Tizen.Alarm.remove(absolute_id);	
		}).shouldNotThrowException();

		valueOf(testRun, function() {
			Ti.Tizen.Alarm.remove(absolute_id);
		}).shouldThrowException();

		finish(testRun);
	}

	this.alarmRelative = function(testRun) {
		var alarm,
			alarmId,
			delay = 2 * Ti.Tizen.Alarm.PERIOD_MINUTE,
			period = Ti.Tizen.Alarm.PERIOD_HOUR;

		Ti.Tizen.Alarm.removeAll();
		alarm = Ti.Tizen.Alarm.createAlarmRelative({
			delay: delay,
			period: period
		});
		Ti.Tizen.Alarm.add(alarm, 'http://tizen.org/alarm-clock');
		alarmId = alarm.id;

		valueOf(testRun, function() {
			var remaining = alarm.getRemainingSeconds();
		}).shouldNotThrowException();
		valueOf(testRun, alarm.delay).shouldBe(delay);

		alarm = Ti.Tizen.Alarm.get(alarmId);

		valueOf(testRun, function() {
			var fromReaming = alarm.getRemainingSeconds();
		});
		valueOf(testRun, alarm.delay).shouldBe(delay);

		finish(testRun);
	}

	this.alarmAbsolute = function(testRun) {
		Ti.Tizen.Alarm.removeAll();

		var alarm,
			alarmId,
			remaining,
			alarmFrom,
			fromReaming,
			date = new Date(),
			time = date.getTime() + 60000,
			period = Ti.Tizen.Alarm.PERIOD_HOUR;
		
		date.setTime(time);
		alarm = Ti.Tizen.Alarm.createAlarmAbsolute({
			date: date, period: period
		});		
		Ti.Tizen.Alarm.add(alarm, 'http://tizen.org/alarm-clock');
		alarmId = alarm.id;
		remaining = alarm.getNextScheduledDate();

		valueOf(testRun, remaining.toDateString()).shouldBe(alarm.date.toDateString());

		alarmFrom = Ti.Tizen.Alarm.get(alarmId),
		fromReaming = alarmFrom.getNextScheduledDate();

		valueOf(testRun, fromReaming.toDateString()).shouldBe(date.toDateString());

		Ti.Tizen.Alarm.removeAll();
		finish(testRun);
	}
}