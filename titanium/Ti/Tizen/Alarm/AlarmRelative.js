define(['Ti/_/declare', 'Ti/Tizen/Alarm/Alarm'], function(declare, Alarm){
	return declare('Ti.Tizen.Alarm.AlarmRelative', Alarm, {
		constructor: function(args) {
			if(args.toString() === '[object AlarmRelative]') {
				this._obj = args;
			} else {
				this._obj = new tizen.AlarmRelative(args.delay, args.period);
			}
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
		},

		getRemainingSeconds: function() {
			return this._obj.getRemainingSeconds();
		}
	});
});