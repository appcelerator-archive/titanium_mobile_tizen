define(['Ti/_/declare', 'Calendar/CalendarItem', '_/calendarHelper'], function(declare, CalendarItem, calendarHelper) {
	var calendarEvent = declare(CalendarItem, {
		constructor: function(args) {
			if (args.toString() === '[object CalendarEvent]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('stringRepresentation') && args.hasOwnProperty('format')) {
					this._obj = new tizen.CalendarEvent(args.stringRepresentation, args.format);
				} else {
					var eventInitDict = args,
						startDate = args.startDate,
						endDate = args.endDate,
						duration = args.duration;

					startDate && (eventInitDict.startDate = calendarHelper.createTZDate(startDate));
					endDate && (eventInitDict.endDate = calendarHelper.createTZDate(endDate));
					duration && (eventInitDict.duration = calendarHelper.createTimeDuration(duration));
					this._obj = new tizen.CalendarEvent(eventInitDict);
				}
			}
		},

		constants: {
			isDetached: {
				get: function() {
					return this._obj.isDetached;
				}
			}
		},

		properties: {
			endDate: {
				get: function() {
					var endDate = this._obj.endDate;
					return calendarHelper.createDate(endDate);
				},
				set: function(value) {
					this._obj.endDate = calendarHelper.createTZDate(value);
				}
			},
			availability: {
				get: function() {
					return this._obj.availability;
				},
				set: function(value) {
					this._obj.availability = value;
				}
			},
			recurrenceRule: {
				get: function() {
					return this._obj.recurrenceRule;
				},
				set: function(value) {
					this._obj.recurrenceRule = value;
				}
			}
		},

		expandRecurrence: function(startDate /*Date*/, endDate /*Date*/, successCallback /*CalendarEventArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var startDateTizen = new tizen.TZDate(startDate.getUTCFullYear(), startDate.getUTCMonth(), startDate.getUTCDate(), startDate.getUTCHours(), startDate.getUTCMinutes()),
				endDateTizen = new tizen.TZDate(endDate.getUTCFullYear(), endDate.getMonth(), endDate.getUTCDate(), endDate.getHours(), endDate.getUTCMinutes());

			return this._obj.expandRecurrence(startDateTizen, endDateTizen, successCallback, errorCallback);
		}
	});

	calendarEvent.prototype.declaredClass = 'Tizen.Calendar.CalendarEvent';

	return calendarEvent;
});