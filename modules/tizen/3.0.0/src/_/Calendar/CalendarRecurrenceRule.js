define(['Ti/_/declare', 'Ti/_/Evented', '_/Calendar/helper'], function(declare, Evented, helper) {
	var calendarRecurrenceRule = declare(Evented, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarRecurrenceRule]') {
				this._obj = args;
			} else {
				//The frequency is neccessary parameter
				if (args.hasOwnProperty('frequency')) {

					var initDict = args,
						untilDate = args.ruleInitDict && args.ruleInitDict.untilDate,
						exceptions = args.ruleInitDict && args.ruleInitDict.exceptions,
						i=0,
						len = exceptions && exceptions.length,
						exceptionsTmp = [];


					untilDate && (initDict.ruleInitDict.untilDate = helper.createTZDate(untilDate));

					if(exceptions) {
						for(; i<len; i++) {
							exceptionsTmp.push(helper.createTZDate(exceptions[i]));
						}
						initDict.ruleInitDict.exceptions = exceptionsTmp;
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
					return helper.createDate(untilDate);
				},
				set: function(value) {
					this._obj.untilDate = helper.createTZDate(value);
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
						res.push(helper.createDate(exceptions[i]));
					}
					return res;
				},
				set: function(value) {
					var res = [],
						exceptions = value,
						i=0,
						len = exceptions.length;

					for(; i<len; i++) {
						res.push(helper.createTZDate(exceptions[i]));
					}
					this._obj.exceptions = res;
				}
			}
		}
	});

	calendarRecurrenceRule.prototype.declaredClass = 'Tizen.Calendar.CalendarRecurrenceRule';

	return calendarRecurrenceRule;
});