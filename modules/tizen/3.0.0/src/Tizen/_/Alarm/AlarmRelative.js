define(['Ti/_/declare', 'Tizen/_/Alarm/Alarm'], function(declare, Alarm) {

	var AlarmRelative = declare(Alarm, {

		constructor: function(args) {
			if (args.toString() === '[object AlarmRelative]') {
				this._obj = args;
			} else {
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

	AlarmRelative.prototype.declaredClass = 'Tizen.Alarm.AlarmRelative';
	return AlarmRelative;
});