define(['Ti/_/declare', 'Ti/Tizen/_/calendar_helper'], function(declare, calendar_helper) {
	return declare('Ti.Tizen.Calendar.CalendarRecurrenceRule', null, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarRecurrenceRule]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('frequency')) {

					var initDict = args,
						untilDate = args.ruleInitDict && args.ruleInitDict.untilDate,
						exceptions = args.ruleInitDict && args.ruleInitDict.exceptions,
						i=0,
						len = exceptions && exceptions.length,
						exceptionsTmp = [];

					if(untilDate) {
						args.ruleInitDict.hasOwnProperty('untilDate') && (initDict.ruleInitDict.untilDate = calendar_helper.createTZDate(untilDate));
					}
					if(exceptions) {
						for(; i<len; i++) {
							exceptionsTmp.push(calendar_helper.createTZDate(exceptions[i]));
						}
						args.ruleInitDict.hasOwnProperty('exceptions') && (initDict.ruleInitDict.exceptions = exceptionsTmp);
					}

					this._obj = new tizen.CalendarRecurrenceRule(initDict.frequency, initDict.ruleInitDict);

				} else {
					Ti.API.error('Constructor with such parameters not found in CalendarRecurrenceRule.');
				}
			}
		},

		properties: {
			frequency: {
				get: function() {
					return this._obj.frequency;
				},
				set: function(value) {
					this._obj.frequency = value;
				}
			},
			interval: {
				get: function() {
					return this._obj.interval;
				},
				set: function(value) {
					this._obj.interval = value;
				}
			},
			untilDate: {
				get: function() {
					var untilDate = this._obj.untilDate;
					return calendar_helper.createDate(untilDate);
				},
				set: function(value) {
					this._obj.untilDate = calendar_helper.createTZDate(value);
				}
			},
			occurrenceCount: {
				get: function() {
					return this._obj.occurrenceCount;
				},
				set: function(value) {
					this._obj.occurrenceCount = value;
				}
			},
			daysOfTheWeek: {
				get: function() {
					return this._obj.daysOfTheWeek;
				},
				set: function(value) {
					this._obj.daysOfTheWeek = value;
				}
			},
			setPositions: {
				get: function() {
					return this._obj.setPositions;
				},
				set: function(value) {
					this._obj.setPositions = value;
				}
			},
			exceptions: {
				get: function() {
					var res = [],
						exceptions = this._obj.exceptions,
						i=0,
						len = exceptions.length;

					for(; i<len; i++) {
						res.push(calendar_helper.createDate(exceptions[i]));
					}
					return res;
				},
				set: function(value) {
					var res = [],
						exceptions = value,
						i=0,
						len = exceptions.length;

					for(; i<len; i++) {
						res.push(calendar_helper.createTZDate(exceptions[i]));
					}
					this._obj.exceptions = res;
				}
			}
		}

	});
});