define(['Ti/_/declare', 'Ti/Tizen/Calendar/CalendarItem', 'Ti/Tizen/_/calendar_helper'], function(declare, CalendarItem, calendar_helper) {
	return declare('Ti.Tizen.Calendar.CalendarTask', CalendarItem, {
		constructor: function(args) {
			if (args.toString() === '[object CalendarTask]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('stringRepresentation') && args.hasOwnProperty('format')) {
					this._obj = new tizen.CalendarTask(args.stringRepresentation, args.format);
				} else {
					var taskInitDict = args,
						startDate = args.startDate,
						dueDate = args.dueDate,
						completedDate = args.completedDate;

					args.hasOwnProperty('startDate') && (taskInitDict.startDate = calendar_helper.createTZDate(startDate));
					args.hasOwnProperty('dueDate') && (taskInitDict.dueDate = calendar_helper.createTZDate(dueDate));
					args.hasOwnProperty('completedDate') && (taskInitDict.startDate = calendar_helper.createTZDate(startDate));

					args.hasOwnProperty('duration') && (taskInitDict.duration = args.duration._obj);

					this._obj = new tizen.CalendarTask(taskInitDict);
				}
			}
		},

		properties: {
			dueDate: {
				get: function() {
					var dueDate = this._obj.dueDate;
					return createDate(dueDate);
				},
				set: function(value) {
					this._obj.dueDate = calendar_helper.createTZDate(value);
				}
			},
			completedDate: {
				get: function() {
					var completedDate = this._obj.completedDate;
					return createDate(completedDate);
				},
				set: function(value) {
					this._obj.completedDate = calendar_helper.createTZDate(value);
				}
			},
			progress: {
				get: function() {
					return this._obj.progress;
				},
				set: function(value) {
					this._obj.progress = value;
				}
			}
		}

	});
});