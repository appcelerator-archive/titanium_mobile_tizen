// Wraps Tizen interface "CalendarItem" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Calendar/CalendarEventId', 'Tizen/_/Calendar/CalendarAttendee', 'Tizen/_/Calendar/helper'], function(declare, Evented, CalendarEventId, Attendee, helper) {

	var calendarItem = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		convertToString: function(format /*CalendarTextFormat*/) {
			return this._obj.convertToString(format);
		},

		clone: function() {
			return new (require('Tizen/_/Calendar/CalendarEvent'))(void 0, this._obj.clone());
		},

		constants: {
			id: {
				get: function() {
					return (this._obj == '[object CalendarEvent]') ? 
						(new CalendarEventId(void 0, this._obj.id)) : 
						this._obj.id;
				}
			},
			lastModificationDate: {
				get: function() {
					return this._obj.lastModificationDate;
				}
			},
			calendarId: {
				get: function() {
					return this._obj.calendarId;
				}
			}
		},

		properties: {
			description: {
				get: function() {
					return this._obj.description;
				},
				set: function(value) {
					this._obj.description = value;
				}
			},
			summary: {
				get: function() {
					return this._obj.summary;
				},
				set: function(value) {
					this._obj.summary = value;
				}
			},
			isAllDay: {
				get: function() {
					return this._obj.isAllDay;
				},
				set: function(value) {
					this._obj.isAllDay = value;
				}
			},
			startDate: {
				set: function(value) {
					if (value instanceof tizen.TZDate) {
						this._obj.startDate = value;
					} else {
						this._obj.startDate = helper.createTZDate(value);
					}
				},
				get: function() {
					var startDate = this._obj.startDate;
					return helper.createDate(startDate);
				}
			},
			duration: {
				set: function(value) {
					if (value instanceof tizen.TimeDuration) {
						this._obj.duration = value;
					} else {
						this._obj.duration = helper.createTimeDuration(value);
					}
				},
				get: function() {
					return helper.toMsec(this._obj.duration);
				}
			},
			location: {
				get: function() {
					return this._obj.location;
				},
				set: function(value) {
					this._obj.location = value;
				}
			},
			geolocation: {
				get: function() {
					return this._obj.geolocation;
				},
				set: function(value) {
					this._obj.geolocation = value;
				}
			},
			organizer: {
				get: function() {
					return this._obj.organizer;
				},
				set: function(value) {
					this._obj.organizer = value;
				}
			},
			visibility: {
				get: function() {
					return this._obj.visibility;
				},
				set: function(value) {
					this._obj.visibility = value;
				}
			},
			status: {
				get: function() {
					return this._obj.status;
				},
				set: function(value) {
					this._obj.status = value;
				}
			},
			priority: {
				get: function() {
					return this._obj.priority;
				},
				set: function(value) {
					this._obj.priority = value;
				}
			},
			alarms: {
				get: function() {
					return this._obj.alarms;
				},
				set: function(value) {
					this._obj.alarms = value;
				}
			},
			categories: {
				get: function() {
					return this._obj.categories;
				},
				set: function(value) {
					this._obj.categories = value;
				}
			},
			attendees: {
				get: function() {
					var i = 0,
						attendees = this._obj.attendees,
						l = attendees.length,
						result = [];
					for (; i < l; i++) {
						result.push(new Attendee(void 0, attendees[i]));
					}
					return result;
				},
				set: function(value) {
					var i = 0,
						l = value.length,
						result = [];
					for (; i < l; i++) {
						result.push(value[i]._obj);
					}
					this._obj.attendees = result;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	calendarItem.prototype.declaredClass = 'Tizen.Calendar.CalendarItem';
	return calendarItem;
});
