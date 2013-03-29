define(['Ti/_/declare', 'Ti/_/Evented', '_/Calendar/helper'], function(declare, Evented, helper) {
	var calendarAlarm = declare(Evented, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarAlarm]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('before') && args.hasOwnProperty('method')) {
					var before = args.before;

					before && (before = helper.createTimeDuration(before));
					this._obj = new tizen.CalendarAlarm(before, args.method, args.description);

				} else if (args.hasOwnProperty('absoluteDate') && args.hasOwnProperty('method')) {
					var absoluteDate = args.absoluteDate;

					absoluteDate && (absoluteDate = helper.createTZDate(absoluteDate));
					this._obj = new tizen.CalendarAlarm(absoluteDate, args.method, args.description);

				} else {
					Ti.API.error('Constructor with such parameters does not exist in CalendarAlarm.');
				}
			}
		},

		properties: {
			absoluteDate: {
				get: function() {
					return helper.createDate(this._obj.absoluteDate);
				},
				set: function(value) {
					this._obj.absoluteDate = helper.createTZDate(value);
				}
			},
			before: {
				set: function(value) {
					this._obj.before = helper.createTimeDuration(value);
				},
				get: function() {
					return helper.toMsec(this._obj.before);
				}
			},
			method: {
				get: function() {
					return this._obj.method;
				},
				set: function(value) {
					this._obj.method = value;
				}
			},
			description: {
				get: function() {
					return this._obj.description;
				},
				set: function(value) {
					this._obj.description = value;
				}
			}
		}
	});

	calendarAlarm.prototype.declaredClass = 'Tizen.Calendar.CalendarAlarm';

	return calendarAlarm;
});