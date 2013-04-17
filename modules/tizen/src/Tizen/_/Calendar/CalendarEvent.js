// Wraps Tizen interface "CalendarEvent" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Tizen/_/Calendar/CalendarItem', 'Tizen/_/Calendar/helper'], function(declare, CalendarItem, helper) {

	function onError (e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

	var calendarEvent = declare(CalendarItem, {

		constructor: function(args) {
			if (args.toString() === '[object CalendarEvent]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				// There are several Tizen constructors for this object.
				// Deduce the correct parameters to the corresponding Tizen constructor, based on the types of
				// the members of args, and invoke the constructor.
				//
				// Note that Tizen calls distinguish between passing an undefined parameter and not passing 
				// any parameter at all, so the count of the parameters must also be correct.

				if (args.hasOwnProperty('stringRepresentation') && args.hasOwnProperty('format')) {
					this._obj = new tizen.CalendarEvent(args.stringRepresentation, args.format);
				} else {
					var eventInitDict = args,
						startDate = args.startDate,
						endDate = args.endDate,
						duration = args.duration;

					startDate && (eventInitDict.startDate = helper.createTZDate(startDate));
					endDate && (eventInitDict.endDate = helper.createTZDate(endDate));
					duration && (eventInitDict.duration = helper.createTimeDuration(duration));
					this._obj = new tizen.CalendarEvent(eventInitDict);
				}
			}
		},

		expandRecurrence: function(startDate /*Date*/, endDate /*Date*/, callback) {
			return this._obj.expandRecurrence(helper.createTZDate(startDate), helper.createTZDate(endDate), callback && function() {
				callback({
					code: 0,
					success: true
				});
			}, callback && function(e) {
					onError(e, callback);
				});
		},

		constants: {
			isDetached: {
				get: function() {
					return this._obj.isDetached;
				}
			}
		},

		properties: {
			endDate: {
				get: function() {
					var endDate = this._obj.endDate;
					return helper.createDate(endDate);
				},
				set: function(value) {
					this._obj.endDate = helper.createTZDate(value);
				}
			},
			availability: {
				get: function() {
					return this._obj.availability;
				},
				set: function(value) {
					this._obj.availability = value;
				}
			},
			recurrenceRule: {
				get: function() {
					return this._obj.recurrenceRule;
				},
				set: function(value) {
					this._obj.recurrenceRule = value;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	calendarEvent.prototype.declaredClass = 'Tizen.Calendar.CalendarEvent';
	return calendarEvent;
});
