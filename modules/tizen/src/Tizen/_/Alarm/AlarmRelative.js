// Wraps Tizen interface "AlarmRelative" that resides in Tizen module "Alarm".

define(['Ti/_/declare', 'Tizen/_/Alarm/Alarm'], function(declare, Alarm) {

	var AlarmRelative = declare(Alarm, {

		constructor: function(args) {
			if (args instanceof tizen.AlarmRelative) {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				this._obj = new tizen.AlarmRelative(args.delay, args.period);
			}
		},

		getRemainingSeconds: function() {
			return this._obj.getRemainingSeconds();
		},

		constants: {
			delay: {
				get: function() {
					return this._obj.delay;
				}
			},
			period: {
				get: function() {
					return this._obj.period;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	AlarmRelative.prototype.declaredClass = 'Tizen.Alarm.AlarmRelative';
	return AlarmRelative;
});
