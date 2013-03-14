define(['Ti/_/declare', 'Ti/Tizen/Calendar/CalendarItem'], function(declare, CalendarItem) {

	function createTZDate(dateObj) {
		return new tizen.TZDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes())
	}
	function createDate(tzDateObj){
		return new Date(tzDateObj.getUTCFullYear(), tzDateObj.getUTCMonth(), tzDateObj.getUTCDate(), tzDateObj.getUTCHours(), tzDateObj.getUTCMinutes());
	}

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

					args.hasOwnProperty('startDate') && (taskInitDict.startDate = createTZDate(startDate));
					args.hasOwnProperty('dueDate') && (taskInitDict.dueDate = createTZDate(dueDate));
					args.hasOwnProperty('completedDate') && (taskInitDict.startDate = createTZDate(startDate));

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
					this._obj.dueDate = createTZDate(value);
				}
			},
			completedDate: {
				get: function() {
					var completedDate = this._obj.completedDate;
					return createDate(completedDate);
				},
				set: function(value) {
					this._obj.completedDate = createTZDate(value);
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