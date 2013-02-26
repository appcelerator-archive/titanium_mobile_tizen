define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Calendar.CalendarAlarm', null, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarAlarm]') {
				this._obj = args;
			} else {
				if ('before' in args && 'method' in args && 'description' in args) {
					this._obj = new tizen.CalendarAlarm(args.before, args.method, args.description);
				} else if ('absoluteDate' in args && 'method' in args && 'description' in args) {
					this._obj = new tizen.CalendarAlarm(args.absoluteDate, args.method, args.description);
				} else {
					Ti.API.error('Constructor with given parameters doesn\'t exists');
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