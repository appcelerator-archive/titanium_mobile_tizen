define(['Ti/_/declare', '_/Calendar/CalendarItem', '_/Calendar/helper'], function(declare, CalendarItem, helper) {
	var calendarTask = declare(CalendarItem, {
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
						completedDate = args.completedDate,
						duration = args.duration;

					startDate && (taskInitDict.startDate = helper.createTZDate(startDate));
					dueDate && (taskInitDict.dueDate = helper.createTZDate(dueDate));
					completedDate && (taskInitDict.startDate = helper.createTZDate(startDate));
					duration && (taskInitDict.duration = helper.createTimeDuration(duration));

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
					this._obj.dueDate = helper.createTZDate(value);
				}
			},
			completedDate: {
				get: function() {
					var completedDate = this._obj.completedDate;
					return createDate(completedDate);
				},
				set: function(value) {
					this._obj.completedDate = helper.createTZDate(value);
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

	calendarTask.prototype.declaredClass = 'Tizen.Calendar.CalendarTask';

	return calendarTask;
});