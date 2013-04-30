// Wraps Tizen interface "CalendarAlarm" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Calendar/helper'], function(declare, Evented, helper) {

	var calendarAlarm = declare(Evented, {

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
				
				// Check if the required parameters are present (do not check for the optional ones).
				if ('before' in args && 'method' in args) {
					this._obj = new tizen.CalendarAlarm(helper.createTimeDuration(args.before), args.method, args.description);
				} else if ('absoluteDate' in args && 'method' in args) {
					this._obj = new tizen.CalendarAlarm(helper.createTZDate(args.absoluteDate), args.method, args.description);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
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
