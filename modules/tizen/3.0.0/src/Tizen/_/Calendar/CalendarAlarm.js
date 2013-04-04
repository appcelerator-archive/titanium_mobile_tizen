// Wraps Tizen interface "CalendarAlarm" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Calendar/helper'], function(declare, Evented, helper) {

	var calendarAlarm = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object CalendarAlarm]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				// There are several Tizen constructors for this object.
				// Deduce the correct parameters to the corresponding Tizen constructor, based on the types of
				// the members of args, and invoke the constructor.
				//
				// Note that Tizen calls distinguish between passing an undefined parameter and not passing 
				// any parameter at all, so the count of the parameters must also be correct.

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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	calendarAlarm.prototype.declaredClass = 'Tizen.Calendar.CalendarAlarm';
	return calendarAlarm;
});
