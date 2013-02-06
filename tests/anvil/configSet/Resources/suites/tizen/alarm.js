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

	this.name = "alarm";
	this.tests = [
		{name: "alarmAdd"},
		{name: "alarmGet"},
		{name: "alarmRemove"},
		{name: "alarmRelative"},
		{name: "alarmAbsolute"}
	]

	this.alarmAdd = function(testRun) {
		var alarm,
			tizenArr,
			date = new Date(2012, 12, 21, 8, 0);

		tizen.alarm.removeAll();
		
		//Alarm in 10 seconds (relative)
		alarm = new tizen.AlarmRelative(10);
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		
		// Set an alarm on December 21st 2012 08:00
		alarm = new tizen.AlarmAbsolute(date);
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		
		tizenArr = tizen.alarm.getAll();
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

		tizen.alarm.removeAll();		
		//Alarm in 10 seconds (relative)
		alarm = new tizen.AlarmRelative(10);
		// Set an alarm on December 21st 2012 08:00
		alarm1 = new tizen.AlarmAbsolute(date);
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		tizen.alarm.add(alarm1, "http://tizen.org/alarm-clock");
		
		relative_id = alarm.id,
		absolute_id = alarm1.id;

		valueOf(testRun, function(){
			alarm2 = tizen.alarm.get(relative_id);
			alarm3 = tizen.alarm.get(absolute_id);
		}).shouldNotThrowException();

		valueOf(testRun, alarm2 instanceof tizen.AlarmRelative).shouldBeTrue();
		valueOf(testRun, alarm3 instanceof tizen.AlarmAbsolute).shouldBeTrue();

		tizen.alarm.removeAll()

		valueOf(testRun, function(){
			var alarmTmp = tizen.alarm.get(absolute_id);
			alarmTmp = tizen.alarm.get(relative_id);
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
		
		tizen.alarm.removeAll();
		alarmArr = tizen.alarm.getAll();
		valueOf(testRun, alarmArr.length).shouldBe(0);

		//Alarm in 10 seconds (relative)
		alarm = new tizen.AlarmRelative(10);
		alarm1 = new tizen.AlarmAbsolute(date);
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		tizen.alarm.add(alarm1, "http://tizen.org/alarm-clock");
		relative_id = alarm.id;
		absolute_id = alarm1.id;

		valueOf(testRun, function(){
			tizen.alarm.remove(absolute_id);	
		}).shouldNotThrowException();

		valueOf(testRun, function(){
			tizen.alarm.remove(absolute_id);
		}).shouldThrowException();

		finish(testRun);
	}

	this.alarmRelative = function(testRun) {
		var alarm,
			alarmId,
			delay = 2 * tizen.alarm.PERIOD_MINUTE,
			period = tizen.alarm.PERIOD_HOUR;

		tizen.alarm.removeAll();
		alarm = new tizen.AlarmRelative(delay, period);
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		alarmId = alarm.id;
		valueOf(testRun, function(){
			var remaining = alarm.getRemainingSeconds();
		}).shouldNotThrowException();
		valueOf(testRun, alarm.delay).shouldBe(delay);

		alarm = tizen.alarm.get(alarmId);
		valueOf(testRun, function(){
			var	fromReaming = alarm.getRemainingSeconds();
		});
		valueOf(testRun, alarm.delay).shouldBe(delay);

		finish(testRun);
	}

	this.alarmAbsolute = function(testRun) {
		tizen.alarm.removeAll();
		var alarm,
			alarmId,
			remaining,
			alarmFrom,
			fromReaming,
			date = new Date(),
			time = date.getTime() + 60000,
			period = tizen.alarm.PERIOD_HOUR;
		
		date.setTime(time);
		alarm = new tizen.AlarmAbsolute(date, period);		
		tizen.alarm.add(alarm, "http://tizen.org/alarm-clock");
		alarmId = alarm.id;
		remaining = alarm.getNextScheduledDate();
		valueOf(testRun, remaining.toDateString()).shouldBe(alarm.date.toDateString());

		alarmFrom = tizen.alarm.get(alarmId),
		fromReaming = alarmFrom.getNextScheduledDate();
		valueOf(testRun, fromReaming.toDateString()).shouldBe(date.toDateString());

		tizen.alarm.removeAll();
		finish(testRun);
	}
}