define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var calendarEventId = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object CalendarEventId]') {
				this._obj = args;
			} else {
				if (args.uid) {
					this._obj = new tizen.CalendarEventId(args.uid, args.rid);
				} else {
					Ti.API.error('Constructor with such parameters not found in CalendarEventId.');
				}
			}
		},

		properties: {
			uid: {
				get: function() {
					return this._obj.uid;
				},
				set: function(value) {
					this._obj.uid = value;
				}
			},
			rid: {
				get: function() {
					return this._obj.rid;
				},
				set: function(value) {
					this._obj.rid = value;
				}
			}
		}
	});

	calendarEventId.prototype.declaredClass = 'Tizen.Calendar.CalendarEventId';
	return calendarEventId;
});