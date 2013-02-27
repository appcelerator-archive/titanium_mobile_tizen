define(['Ti/_/lang', 'Ti/Tizen/Time/TimeDuration'], function(lang, TimeDuration) {
	return lang.setObject('Ti.Tizen.Time', {

		constants: {
			TIME_DURATION_UNIT_MSECS: 'MSECS',
			TIME_DURATION_UNIT_SECS: 'SECS',
			TIME_DURATION_UNIT_MINS: 'MINS',
			TIME_DURATION_UNIT_HOURS: 'HOURS',
			TIME_DURATION_UNIT_DAYS: 'DAYS',
		},

		getCurrentDateTime: function() {
			return new (require('Ti/Tizen/Time/TZDate'))(tizen.time.getCurrentDateTime());
		},

		setCurrentDateTime: function(dt /*TZDate*/) {
			return tizen.time.setCurrentDateTime(dt._obj);
		},

		getLocalTimezone: function() {
			return tizen.time.getLocalTimezone();
		},

		getAvailableTimezones: function() {
			return tizen.time.getAvailableTimezones();
		},

		getDateFormat: function(shortformat /*boolean*/) {
			return tizen.time.getDateFormat(shortformat);
		},

		getTimeFormat: function() {
			return tizen.time.getTimeFormat();
		},

		isLeapYear: function(year /*long*/) {
			return tizen.time.isLeapYear(year);
		},

		createTZDate: function(args) {
			return new (require('Ti/Tizen/Time/TZDate'))(args);
		},

		createTimeDuration: function(args) {
			return new TimeDuration(args);
		},
	});
});