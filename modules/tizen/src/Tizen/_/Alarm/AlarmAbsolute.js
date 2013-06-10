// Wraps Tizen interface "AlarmAbsolute" that resides in Tizen module "Alarm".

define(['Ti/_/declare', 'Tizen/_/Alarm/Alarm'], function(declare, Alarm) {

	var AlarmAbsolute = declare(Alarm, {

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

				if ('date' in args && 'period' in args) {
					this._obj = new tizen.AlarmAbsolute(args.date, args.period);
				} else if ('date' in args && 'daysOfTheWeek' in args) {
					this._obj = new tizen.AlarmAbsolute(args.date, args.daysOfTheWeek);
				} else if ('date' in args) {
					this._obj = new tizen.AlarmAbsolute(args.date);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
			}
		},

		getNextScheduledDate: function() {
			return this._obj.getNextScheduledDate();
		},

		constants: {
			date: {
				get: function() {
					return this._obj.date;
				}
			},
			period: {
				get: function() {
					return this._obj.period;
				}
			},
			daysOfTheWeek: {
				get: function() {
					return this._obj.daysOfTheWeek;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	AlarmAbsolute.prototype.declaredClass = 'Tizen.Alarm.AlarmAbsolute';
	return AlarmAbsolute;
});
