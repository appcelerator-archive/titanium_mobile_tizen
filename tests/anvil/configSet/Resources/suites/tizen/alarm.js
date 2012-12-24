/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish;
	var valueOf;
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "alarm";
	this.tests = [
		{name: "alarmAdd"},
		{name: "alarmGet"},
		{name: "alarmRemove"},
		{name: "alarmRelative"},
		{name: "alarmAbsolute"}
	]

	this.alarmAdd = function(testRun) {
		tizen.alarm.removeAll();
		//Alarm in 10 seconds (relative)
		var alarm = new tizen.AlarmRelative(10);
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");

		var date = new Date(2012, 11, 21, 8, 0);
		// Set an alarm on December 21st 2012 08:00
		var alarm1 = new tizen.AlarmAbsolute(date);
		tizen.alarm.add(alarm1, "http://tizen.org/alarm-clock");
		var tizenArr = tizen.alarm.getAll();

		valueOf(testRun, tizenArr.length).shouldBe(2);

		finish(testRun);
	}
	
	this.alarmGet = function(testRun) {
		tizen.alarm.removeAll();
		//Alarm in 10 seconds (relative)
		var alarm = new tizen.AlarmRelative(10),
		
		// Set an alarm on December 21st 2012 08:00
			date = new Date(2012, 11, 21, 8, 0),			

			alarm1 = new tizen.AlarmAbsolute(date);

		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		tizen.alarm.add(alarm1, "http://tizen.org/alarm-clock");
		var relative_id = alarm.id,
			absolute_id = alarm1.id;

			var alarm2, alarm3;

		valueOf(testRun, function(){
			alarm2 = tizen.alarm.get(relative_id);
			alarm3 = tizen.alarm.get(absolute_id);
		}).shouldNotThrowException();

		valueOf(testRun, alarm2 instanceof tizen.AlarmRelative).shouldBeTrue();
		valueOf(testRun, alarm3 instanceof tizen.AlarmAbsolute).shouldBeTrue();

		tizen.alarm.removeAll()

		valueOf(testRun, function(){
			var alarm2 = tizen.alarm.get(absolute_id);
			var alarm3 = tizen.alarm.get(relative_id);
		}).shouldThrowException();

		finish(testRun);
	}
	
	this.alarmRemove = function(testRun) {
		tizen.alarm.removeAll();
		//Alarm in 10 seconds (relative)
		var alarm = new tizen.AlarmRelative(10),
		
			// Set an alarm on December 21st 2012 08:00
			date = new Date(2012, 11, 21, 8, 0),		

			alarm1 = new tizen.AlarmAbsolute(date);

		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		tizen.alarm.add(alarm1, "http://tizen.org/alarm-clock");
		var relative_id = alarm.id,
			absolute_id = alarm1.id;
		valueOf(testRun, function(){
			tizen.alarm.remove(absolute_id);	
		}).shouldNotThrowException();

		valueOf(testRun, function(){
			tizen.alarm.remove(absolute_id);
		}).shouldThrowException();

		tizen.alarm.removeAll();

		var alarm_arr = tizen.alarm.getAll();
		valueOf(testRun, alarm_arr.length).shouldBe(0);

		finish(testRun);
	}

	this.alarmRelative = function(testRun) {
		tizen.alarm.removeAll();
		var delay = 2 * tizen.alarm.PERIOD_MINUTE,
			period = tizen.alarm.PERIOD_HOUR,
			alarm = new tizen.AlarmRelative(delay, period);
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		alarmId = alarm.id;
		valueOf(testRun, function(){
			var remaining = alarm.getRemainingSeconds();
		}).shouldNotThrowException()
		
		valueOf(testRun, alarm.delay).shouldBe(delay);

		var alarm_from = tizen.alarm.get(alarmId);
		valueOf(testRun, function(){
			var	from_reaming = alarm_from.getRemainingSeconds();
		});
			

		valueOf(testRun, alarm_from.delay).shouldBe(delay);

		finish(testRun);
	}

	this.alarmAbsolute = function(testRun) {
		tizen.alarm.removeAll();
		var date = new Date(),
			time = date.getTime() + 60000,
			period = tizen.alarm.PERIOD_HOUR;
		date.setTime(time);		
		var	alarm1 = new tizen.AlarmAbsolute(date, period);
		
		tizen.alarm.add(alarm1, "http://tizen.org/alarm-clock");
		var alarmId = alarm1.id;

		var remaining = alarm1.getNextScheduledDate();
		valueOf(testRun, remaining.toDateString()).shouldBe(alarm1.date.toDateString());

		var alarm_from = tizen.alarm.get(alarmId),
			from_reaming = alarm_from.getNextScheduledDate();

		valueOf(testRun, from_reaming.toDateString()).shouldBe(date.toDateString());

		tizen.alarm.removeAll();

		finish(testRun);
	}
}