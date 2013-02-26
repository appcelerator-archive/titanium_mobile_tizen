define(['Ti/_/declare', 'Ti/Tizen/Calendar/CalendarEventId'], function(declare, CalendarEventId) {
	return declare('Ti.Tizen.Calendar.CalendarItem', null, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			id: {
				get: function() {
// console.log("this._obj: " + this._obj);
// console.log("this._obj.id: " + this._obj.id);
					
					return (this._obj == '[object CalendarEvent]') ? (new Ti.Tizen.Calendar.CalendarEventId(this._obj.id)) : this._obj.id;
				}
			},
			lastModificationDate: {
				get: function() {
					return this._obj.lastModificationDate;
				}
			},
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
				get: function() {
					return this._obj.startDate;
				},
				set: function(value) {
					this._obj.startDate = value;
				}
			},
			duration: {
				get: function() {
					return this._obj.duration;
				},
				set: function(value) {
					this._obj.duration = value;
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
					return this._obj.attendees;
				},
				set: function(value) {
					this._obj.attendees = value;
				}
			},
		},

		convertToString: function(format /*CalendarTextFormat*/) {
			return this._obj.convertToString(format);
		},

		clone: function() {
			return this._obj.clone();
		}
	});
});