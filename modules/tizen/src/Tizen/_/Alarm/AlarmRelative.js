// Wraps Tizen interface "AlarmRelative" that resides in Tizen module "Alarm".

define(['Ti/_/declare', 'Tizen/_/Alarm/Alarm'], function(declare, Alarm) {

	var AlarmRelative = declare(Alarm, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				if('delay' in args) {
					// args is a dictionary that the user of the wrapper module passed to the creator function.
					this._obj = args.period ? new tizen.AlarmRelative(args.delay, args.period) : new tizen.AlarmRelative(args.delay);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
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
