define(['Ti/_/declare', 'Ti/Tizen/Calendar/CalendarItem'], function(declare, CalendarItem) {
	return declare('Ti.Tizen.Calendar.CalendarTask', CalendarItem, {
		constructor: function(args) {
			if (args.toString() === '[object CalendarTask]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('stringRepresentation') && args.hasOwnProperty('format')) {
					this._obj = new tizen.CalendarTask(
						args.stringRepresentation,
						args.format
					);
				} else {
					var eventInitDict = args;

					args.hasOwnProperty('startDate') && (eventInitDict.startDate = args.startDate._obj);
					args.hasOwnProperty('duration') && (eventInitDict.duration = args.duration._obj);

					this._obj = new tizen.CalendarTask(
						args ? eventInitDict : null
					);
				}
			}
		},

		properties: {
			dueDate: {
				get: function() {
					return this._obj.dueDate;
				},
				set: function(value) {
					this._obj.dueDate = value;
				}
			},
			completedDate: {
				get: function() {
					return this._obj.completedDate;
				},
				set: function(value) {
					this._obj.completedDate = value;
				}
			},
			progress: {
				get: function() {
					return this._obj.progress;
				},
				set: function(value) {
					this._obj.progress = value;
				}
			},
		},

	});
});