define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Calendar.CalendarAttendee', null, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarAttendee]') {
				this._obj = args;
			} else {
				this._obj = new tizen.CalendarAttendee(args.uri, args.attendeeInitDict);
			}
		},

		properties: {
			uri: {
				get: function() {
					return this._obj.uri;
				},
				set: function(value) {
					this._obj.uri = value;
				}
			},
			name: {
				get: function() {
					return this._obj.name;
				},
				set: function(value) {
					this._obj.name = value;
				}
			},
			role: {
				get: function() {
					return this._obj.role;
				},
				set: function(value) {
					this._obj.role = value;
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
			RSVP: {
				get: function() {
					return this._obj.RSVP;
				},
				set: function(value) {
					this._obj.RSVP = value;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				},
				set: function(value) {
					this._obj.type = value;
				}
			},
			group: {
				get: function() {
					return this._obj.group;
				},
				set: function(value) {
					this._obj.group = value;
				}
			},
			delegatorURI: {
				get: function() {
					return this._obj.delegatorURI;
				},
				set: function(value) {
					this._obj.delegatorURI = value;
				}
			},
			delegateURI: {
				get: function() {
					return this._obj.delegateURI;
				},
				set: function(value) {
					this._obj.delegateURI = value;
				}
			},
			contactRef: {
				get: function() {
					return this._obj.contactRef;
				},
				set: function(value) {
					this._obj.contactRef = value;
				}
			},
		},

	});
});