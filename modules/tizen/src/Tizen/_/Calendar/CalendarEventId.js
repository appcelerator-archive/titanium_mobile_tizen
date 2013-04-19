// Wraps Tizen interface "CalendarEventId" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var calendarEventId = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object CalendarEventId]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				if (args.uid) {
					this._obj = new tizen.CalendarEventId(args.uid, args.rid);
				} else {
					console.error('Constructor with such parameters not found in CalendarEventId.');
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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	calendarEventId.prototype.declaredClass = 'Tizen.Calendar.CalendarEventId';
	return calendarEventId;
});
