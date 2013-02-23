define(['Ti/_/declare', 'Ti/Tizen/Alarm/Alarm'], function(declare, Alarm){
	return declare('Ti.Tizen.Alarm.AlarmAbsolute', Alarm, {
		constructor: function(args) {
			if(args.toString() === '[object AlarmAbsolute]') {
				this._obj = args;
			} else {
				if ('date' in args && 'period' in args){
					this._obj = new tizen.AlarmAbsolute(args.date, args.period);
				} else if ('date' in args && 'daysOfTheWeek' in args){
					this._obj = new tizen.AlarmAbsolute(args.date, args.daysOfTheWeek);
				} else if ('date' in args){
					this._obj = new tizen.AlarmAbsolute(args.date);
				} else {
					Ti.API.error('Constructor with given parameters doesn\'t exists');
				}
			}
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
			},
		},

		getNextScheduledDate: function() {
			return this._obj.getNextScheduledDate();
		}
	});
});