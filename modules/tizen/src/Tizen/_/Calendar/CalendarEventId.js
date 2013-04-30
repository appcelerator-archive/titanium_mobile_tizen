// Wraps Tizen interface "CalendarEventId" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var calendarEventId = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				// Check if the required parameters are present (do not check for the optional ones).
				if ('uid' in args) {
					this._obj = new tizen.CalendarEventId(args.uid, args.rid);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
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
