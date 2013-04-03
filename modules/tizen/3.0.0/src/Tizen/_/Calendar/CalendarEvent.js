define(['Ti/_/declare', 'Tizen/_/Calendar/CalendarItem', 'Tizen/_/Calendar/helper', 'Tizen/_/WebAPIError'], function(declare, CalendarItem, helper, WebAPIError) {

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

					startDate && (eventInitDict.startDate = helper.createTZDate(startDate));
					endDate && (eventInitDict.endDate = helper.createTZDate(endDate));
					duration && (eventInitDict.duration = helper.createTimeDuration(duration));
					this._obj = new tizen.CalendarEvent(eventInitDict);
				}
			}
		},

		expandRecurrence: function(startDate /*Date*/, endDate /*Date*/, successCallback /*CalendarEventArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			return this._obj.expandRecurrence(helper.createTZDate(startDate), helper.createTZDate(endDate), successCallback, errorCallback && wrappedErrorCallback);
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
					return helper.createDate(endDate);
				},
				set: function(value) {
					this._obj.endDate = helper.createTZDate(value);
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
		}

	});

	calendarEvent.prototype.declaredClass = 'Tizen.Calendar.CalendarEvent';
	return calendarEvent;
});