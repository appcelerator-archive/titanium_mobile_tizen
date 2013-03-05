define(['Ti/_/declare', 'Ti/Tizen/Calendar/CalendarItem'], function(declare, CalendarItem) {
	return declare('Ti.Tizen.Calendar.CalendarEvent', CalendarItem, {
		constructor: function(args) {
			if (args.toString() === '[object CalendarEvent]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('stringRepresentation') && args.hasOwnProperty('format')) {
					this._obj = new tizen.CalendarEvent(args.stringRepresentation, args.format);
				} else {
					var eventInitDict = args;

					args.hasOwnProperty('startDate') && (eventInitDict.startDate = args.startDate._obj);
					args.hasOwnProperty('duration') && (eventInitDict.duration = args.duration._obj);

					this._obj = new tizen.CalendarEvent(eventInitDict);
				}
			}
		},

		constants: {
			isDetached: {
				get: function() {
					return this._obj.isDetached;
				}
			},
		},

		properties: {
			endDate: {
				get: function() {
					return this._obj.endDate;
				},
				set: function(value) {
					this._obj.endDate = value;
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
			},
		},

		expandRecurrence: function(startDate /*TZDate*/, endDate /*TZDate*/, successCallback /*CalendarEventArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.expandRecurrence(startDate._obj, endDate._obj, successCallback, errorCallback);
		}
	});
});