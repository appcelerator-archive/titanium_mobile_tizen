define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Calendar.CalendarAlarm', null, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarAlarm]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('before') && args.hasOwnProperty('method') && args.hasOwnProperty('description')) {
					this._obj = new tizen.CalendarAlarm(args.before, args.method, args.description);
				} else if (args.hasOwnProperty('absoluteDate') && args.hasOwnProperty('method') && args.hasOwnProperty('description')) {
					this._obj = new tizen.CalendarAlarm(args.absoluteDate, args.method, args.description);
				} else {
					Ti.API.error('Constructor with such parameters does not exist in CalendarAlarm.');
				}
			}
		},

		properties: {
			absoluteDate: {
				get: function() {
					return this._obj.absoluteDate;
				},
				set: function(value) {
					this._obj.absoluteDate = value;
				}
			},
			before: {
				get: function() {
					return this._obj.before;
				},
				set: function(value) {
					this._obj.before = value;
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
			},
		},

	});
});