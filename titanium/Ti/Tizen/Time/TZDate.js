define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Time.TZDate', null, {
		constructor: function(args) {
			if(args.toString() === '[object TZDate]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('year') && args.hasOwnProperty('day') && args.hasOwnProperty('month')) {
					this._obj = new tizen.TZDate(
						args.year,
						args.month,
						args.day,
						args.hasOwnProperty('hours') ? args.hours : null,
						args.hasOwnProperty('minutes') ? args.minutes : null,
						args.hasOwnProperty('seconds') ? args.seconds : null,
						args.hasOwnProperty('milliseconds') ? args.milliseconds : null,
						args.hasOwnProperty('timezone') ? args.timezone : null
					);
				} else if (args.hasOwnProperty('datetime') && args.hasOwnProperty('timezone')) {
					this._obj = new tizen.TZDate(
						args.datetime,
						args.timezone
					);
				} else {
					Ti.API.error('TZDate\'s constructor with given parameters doesn\'t exists.');
				}
			}
		},

		getDate: function() {
			return this._obj.getDate();
		},

		setDate: function(date /*long*/) {
			return this._obj.setDate(date);
		},

		getDay: function() {
			return this._obj.getDay();
		},

		getFullYear: function() {
			return this._obj.getFullYear();
		},

		setFullYear: function(year /*long*/) {
			return this._obj.setFullYear(year);
		},

		getHours: function() {
			return this._obj.getHours();
		},

		setHours: function(hours /*long*/) {
			return this._obj.setHours(hours);
		},

		getMilliseconds: function() {
			return this._obj.getMilliseconds();
		},

		setMilliseconds: function(ms /*long*/) {
			return this._obj.setMilliseconds(ms);
		},

		getMinutes: function() {
			return this._obj.getMinutes();
		},

		setMinutes: function(minutes /*long*/) {
			return this._obj.setMinutes(minutes);
		},

		getMonth: function() {
			return this._obj.getMonth();
		},

		setMonth: function(month /*long*/) {
			return this._obj.setMonth(month);
		},

		getSeconds: function() {
			return this._obj.getSeconds();
		},

		setSeconds: function(seconds /*long*/) {
			return this._obj.setSeconds(seconds);
		},

		getUTCDate: function() {
			return this._obj.getUTCDate();
		},

		setUTCDate: function(date /*long*/) {
			return this._obj.setUTCDate(date);
		},

		getUTCDay: function() {
			return this._obj.getUTCDay();
		},

		getUTCFullYear: function() {
			return this._obj.getUTCFullYear();
		},

		setUTCFullYear: function(year /*long*/) {
			return this._obj.setUTCFullYear(year);
		},

		getUTCHours: function() {
			return this._obj.getUTCHours();
		},

		setUTCHours: function(hours /*long*/) {
			return this._obj.setUTCHours(hours);
		},

		getUTCMilliseconds: function() {
			return this._obj.getUTCMilliseconds();
		},

		setUTCMilliseconds: function(ms /*long*/) {
			return this._obj.setUTCMilliseconds(ms);
		},

		getUTCMinutes: function() {
			return this._obj.getUTCMinutes();
		},

		setUTCMinutes: function(minutes /*long*/) {
			return this._obj.setUTCMinutes(minutes);
		},

		getUTCMonth: function() {
			return this._obj.getUTCMonth();
		},

		setUTCMonth: function(month /*long*/) {
			return this._obj.setUTCMonth(month);
		},

		getUTCSeconds: function() {
			return this._obj.getUTCSeconds();
		},

		setUTCSeconds: function(seconds /*long*/) {
			return this._obj.setUTCSeconds(seconds);
		},

		getTimezone: function() {
			return this._obj.getTimezone();
		},

		toTimezone: function(tzid /*DOMString*/) {
			return this._obj.toTimezone(tzid);
		},

		toLocalTimezone: function() {
			return this._obj.toLocalTimezone();
		},

		toUTC: function() {
			return this._obj.toUTC();
		},

		difference: function(other /*TZDate*/) {
			return this._obj.difference(other._obj);
		},

		equalsTo: function(other /*TZDate*/) {
			return this._obj.equalsTo(other._obj);
		},

		earlierThan: function(other /*TZDate*/) {
			return this._obj.earlierThan(other._obj);
		},

		laterThan: function(other /*TZDate*/) {
			return this._obj.laterThan(other._obj);
		},

		addDuration: function(duration /*TimeDuration*/) {
			return this._obj.addDuration(duration._obj);
		},

		toLocaleDateString: function() {
			return this._obj.toLocaleDateString();
		},

		toLocaleTimeString: function() {
			return this._obj.toLocaleTimeString();
		},

		toLocaleString: function() {
			return this._obj.toLocaleString();
		},

		toDateString: function() {
			return this._obj.toDateString();
		},

		toTimeString: function() {
			return this._obj.toTimeString();
		},

		toString: function() {
			return this._obj.toString();
		},

		getTimezoneAbbreviation: function() {
			return this._obj.getTimezoneAbbreviation();
		},

		secondsFromUTC: function() {
			return this._obj.secondsFromUTC();
		},

		isDST: function() {
			return this._obj.isDST();
		},

		getPreviousDSTTransition: function() {
			return this._obj.getPreviousDSTTransition();
		},

		getNextDSTTransition: function() {
			return this._obj.getNextDSTTransition();
		}
	});
});