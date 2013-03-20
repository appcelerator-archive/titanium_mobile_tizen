define(['Ti/_/declare', 'Alarm/Alarm'], function(declare, Alarm){
	var AlarmRelative = declare('Tizen.Alarm.AlarmRelative', Alarm, {
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

	AlarmRelative.prototype.declaredClass = 'Tizen.Alarm.AlarmRelative';
	return AlarmRelative;

});