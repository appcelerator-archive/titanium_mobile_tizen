module.exports = new function() {
	var valueOf,
		finish,
		reportError;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = 'time';

	this.tests = [
		{name: 'checkDate'},
		{name: 'checkGetDay'},
		{name: 'checkFullYear'},
		{name: 'checkHours'},
		{name: 'checkMilliseconds'},
		{name: 'checkMinutes'},
		{name: 'checkMonth'},
		{name: 'checkSeconds'},
		{name: 'checkGetTimezone'},
		{name: 'checkToTimezone'},
		{name: 'checkToLocalTimezone'},
		{name: 'checkToUTC'},
		{name: 'checkDifference'},
		{name: 'checkEqualsTo'},
		{name: 'checkEarlierAndLater'},
		{name: 'checkAddDuration'},
		{name: 'checkToXXXString'}
	];

	// Check setting and getting day of the month as a number from 1 to 31 (function getDate)
	this.checkDate = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 10,
				day: 20
			}),
			day = new Date().getDate();
		valueOf(testRun, tzDate.getDate()).shouldBe(20);
		tzDate.setDate(day);
		valueOf(testRun, tzDate.getDate()).shouldBe(day);
		finish(testRun);
	}

	// Check getting day of the week as a number from 0 to 6
	this.checkGetDay = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			});
		valueOf(testRun, tzDate.getDay()).shouldBe(5);
		finish(testRun);
	}

	// Check getting and setting full year as 4-digits number
	this.checkFullYear = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			}),
			newYear = 2010;
		valueOf(testRun, tzDate.getFullYear()).shouldBe(2012);
		tzDate.setFullYear(newYear);
		valueOf(testRun, tzDate.getFullYear()).shouldBe(newYear);
		finish(testRun);
	}

	// Check getting and setting hours
	this.checkHours = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21,
				hours: 12
			}),
			newHours = 16;
		valueOf(testRun, tzDate.getHours()).shouldBe(12);
		tzDate.setHours(newHours);
		valueOf(testRun, tzDate.getHours()).shouldBe(newHours);
		finish(testRun);
	}

	// Check getting and setting milliseconds
	this.checkMilliseconds = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21,
				milliseconds: 100
			}),
			newMilliseconds = 777;
		valueOf(testRun, tzDate.getMilliseconds()).shouldBe(100);
		tzDate.setMilliseconds(newMilliseconds);
		valueOf(testRun, tzDate.getMilliseconds()).shouldBe(newMilliseconds);
		finish(testRun);
	}

	// Check getting and setting minutes
	this.checkMinutes = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21,
				minutes: 20
			}),
			newMinutes = 40;
		valueOf(testRun, tzDate.getMinutes()).shouldBe(20);
		tzDate.setMinutes(newMinutes);
		valueOf(testRun, tzDate.getMinutes()).shouldBe(newMinutes);
		finish(testRun);
	}

	// Check getting and setting month as a number from 0 to 11
	this.checkMonth = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			}),
			newMonth = 5;
		valueOf(testRun, tzDate.getMonth()).shouldBe(11);
		tzDate.setMonth(newMonth);
		valueOf(testRun, tzDate.getMonth()).shouldBe(newMonth);
		finish(testRun);
	}

	// Check getting and setting seconds
	this.checkSeconds = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21,
				seconds: 25
			}),
			newSeconds = 45;
		valueOf(testRun, tzDate.getSeconds()).shouldBe(25);
		tzDate.setSeconds(newSeconds);
		valueOf(testRun, tzDate.getSeconds()).shouldBe(45);
		finish(testRun);
	}

	// Check getting timezone. It only checks if getTimazone() method returns not empty string
	this.checkGetTimezone = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			});
		valueOf(testRun, tzDate.getTimezone().length).shouldBeGreaterThan(0);
		finish(testRun);
	}

	// Check toTimezone() method. It should return TZDate object
	this.checkToTimezone = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			}),
			timezone = tzDate.getTimezone();
		valueOf(testRun, tzDate.toTimezone(timezone) instanceof Ti.Tizen.Time.TZDate).shouldBe(true);
		finish(testRun);
	}

	// Check toLocalTimezone() method. It should return TZDate object
	this.checkToLocalTimezone = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			});
		valueOf(testRun, tzDate.toLocalTimezone() instanceof Ti.Tizen.Time.TZDate).shouldBe(true);
		finish(testRun);
	}

	// Check toUTC() method. It should return TZDate object
	this.checkToUTC = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			});
		valueOf(testRun, tzDate.toUTC() instanceof Ti.Tizen.Time.TZDate).shouldBe(true);
		finish(testRun);
	}

	// Check difference() method. It should return TimeDuration object
	this.checkDifference = function(testRun) {
		var tzDate1 = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			}),
			tzDate2 = Ti.Tizen.Time.createTZDate({
				year: 2011,
				month: 10,
				day: 23
			});
		valueOf(testRun, tzDate1.difference(tzDate2) instanceof Ti.Tizen.Time.TimeDuration).shouldBe(true);
		finish(testRun);
	}

	// Check equalsTo function
	this.checkEqualsTo = function(testRun) {
		var tzDate1 = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			}),
			tzDate2 = tzDate1.toLocalTimezone();
		valueOf(testRun, tzDate1.equalsTo(tzDate2)).shouldBe(true);
		finish(testRun);
	}

	// Check earlierThan() and laterThan() methods
	this.checkEarlierAndLater = function(testRun) {
		var tzDate1 = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			}),
			tzDate2 = Ti.Tizen.Time.createTZDate({
				year: 2011,
				month: 10,
				day: 23
			});
		valueOf(testRun, tzDate1.earlierThan(tzDate2)).shouldBe(false);
		valueOf(testRun, tzDate1.laterThan(tzDate2)).shouldBe(true);
		valueOf(testRun, tzDate2.earlierThan(tzDate1)).shouldBe(true);
		valueOf(testRun, tzDate2.laterThan(tzDate1)).shouldBe(false);
		finish(testRun);
	}

	// Check addDuration() method
	this.checkAddDuration = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			}),
			duration = Ti.Tizen.Time.createTimeDuration({
				length: 3,
				unit: Ti.Tizen.Time.TIME_DURATION_UNIT_DAYS
			});
		tzDate = tzDate.addDuration(duration);
		valueOf(testRun, tzDate.getDate()).shouldBe(24);
		finish(testRun);
	}

	// Check toXXXString() methods - toLocaleDateString(), toLocalTimeString(), toLocaleString(), toDateString(), toTimeString(), toString()
	this.checkToXXXString = function(testRun) {
		var tzDate = Ti.Tizen.Time.createTZDate({
				year: 2012,
				month: 11,
				day: 21
			});
		valueOf(testRun, tzDate.toLocaleDateString()).shouldBeString();
		valueOf(testRun, tzDate.toLocaleDateString().length).shouldBeGreaterThan(0);
		valueOf(testRun, tzDate.toLocaleTimeString()).shouldBeString();
		valueOf(testRun, tzDate.toLocaleTimeString().length).shouldBeGreaterThan(0);
		valueOf(testRun, tzDate.toLocaleString()).shouldBeString();
		valueOf(testRun, tzDate.toLocaleString().length).shouldBeGreaterThan(0);
		valueOf(testRun, tzDate.toDateString()).shouldBeString();
		valueOf(testRun, tzDate.toDateString().length).shouldBeGreaterThan(0);
		valueOf(testRun, tzDate.toTimeString()).shouldBeString();
		valueOf(testRun, tzDate.toTimeString().length).shouldBeGreaterThan(0);
		valueOf(testRun, tzDate.toString()).shouldBeString();
		valueOf(testRun, tzDate.toString().length).shouldBeGreaterThan(0);
		finish(testRun);
	}
}