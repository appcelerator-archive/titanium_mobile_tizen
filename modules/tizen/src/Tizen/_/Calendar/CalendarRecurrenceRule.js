// Wraps Tizen interface "CalendarRecurrence" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Calendar/helper'], function(declare, Evented, helper) {

	var calendarRecurrenceRule = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				// There are several Tizen constructors for this object.
				// Deduce the correct parameters to the corresponding Tizen constructor, based on the types of
				// the members of args, and invoke the constructor.
				//
				// Note that Tizen calls distinguish between passing an undefined parameter and not passing 
				// any parameter at all, so the count of the parameters must also be correct.

				// Check if the required parameters are present (do not check for the optional ones).
				if ('frequency' in args) {

					var initDict = args,
						untilDate = args.ruleInitDict && args.ruleInitDict.untilDate,
						exceptions = args.ruleInitDict && args.ruleInitDict.exceptions,
						i = 0,
						len = exceptions && exceptions.length,
						exceptionsTmp = [];

					untilDate && (initDict.ruleInitDict.untilDate = helper.createTZDate(untilDate));

					if (exceptions) {
						for (; i < len; i++) {
							exceptionsTmp.push(helper.createTZDate(exceptions[i]));
						}
						initDict.ruleInitDict.exceptions = exceptionsTmp;
					}

					this._obj = new tizen.CalendarRecurrenceRule(initDict.frequency, initDict.ruleInitDict);

				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
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
						i = 0,
						len = exceptions.length;

					for (; i < len; i++) {
						res.push(helper.createDate(exceptions[i]));
					}
					return res;
				},
				set: function(value) {
					var res = [],
						exceptions = value,
						i = 0,
						len = exceptions.length;

					for (; i < len; i++) {
						res.push(helper.createTZDate(exceptions[i]));
					}
					this._obj.exceptions = res;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	calendarRecurrenceRule.prototype.declaredClass = 'Tizen.Calendar.CalendarRecurrenceRule';
	return calendarRecurrenceRule;
});
