// Wraps Tizen interface "CalendarTask" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Tizen/_/Calendar/CalendarItem', 'Tizen/_/Calendar/helper'], function(declare, CalendarItem, helper) {

	var calendarTask = declare(CalendarItem, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				// There are several Tizen constructors for this object.
				// Deduce the correct parameters to the corresponding Tizen constructor, based on the types of
				// the members of args, and invoke the constructor.
				//
				// Note that Tizen calls distinguish between passing an undefined parameter and not passing 
				// any parameter at all, so the count of the parameters must also be correct.

				if ('stringRepresentation' in args && 'format' in args) {
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
					return helper.createDate(this._obj.dueDate);
				},
				set: function(value) {
					this._obj.dueDate = helper.createTZDate(value);
				}
			},
			completedDate: {
				get: function() {
					return helper.createDate(this._obj.completedDate);
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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	calendarTask.prototype.declaredClass = 'Tizen.Calendar.CalendarTask';
	return calendarTask;
});
