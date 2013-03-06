define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Calendar.CalendarRecurrenceRule', null, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarRecurrenceRule]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('frequency')) {
					this._obj = new tizen.CalendarRecurrenceRule(args.frequency, args.ruleInitDict);
				} else {
					Ti.API.error('Constructor with such parameters not found in CalendarRecurrenceRule.');
				}
			}
		},

		properties: {
			frequency: {
				get: function() {
					return this._obj.frequency;
				},
				set: function(value) {
					this._obj.frequency = value;
				}
			},
			interval: {
				get: function() {
					return this._obj.interval;
				},
				set: function(value) {
					this._obj.interval = value;
				}
			},
			untilDate: {
				get: function() {
					return this._obj.untilDate;
				},
				set: function(value) {
					this._obj.untilDate = value;
				}
			},
			occurrenceCount: {
				get: function() {
					return this._obj.occurrenceCount;
				},
				set: function(value) {
					this._obj.occurrenceCount = value;
				}
			},
			daysOfTheWeek: {
				get: function() {
					return this._obj.daysOfTheWeek;
				},
				set: function(value) {
					this._obj.daysOfTheWeek = value;
				}
			},
			setPositions: {
				get: function() {
					return this._obj.setPositions;
				},
				set: function(value) {
					this._obj.setPositions = value;
				}
			},
			exceptions: {
				get: function() {
					return this._obj.exceptions;
				},
				set: function(value) {
					this._obj.exceptions = value;
				}
			},
		},

	});
});