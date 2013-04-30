// Wraps Tizen interface "CalendarAttendee" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Contact/ContactRef'], function(declare, Evented, ContactRef) {

	var calendarAttendee = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				// Check if the required parameters are present (do not check for the optional ones).
				if ('uri' in args) {
					// In Tizen module, the name of the RSVP property does not match its name in Tizen Device API
					// (different case), so we have to map it by hand. In order to not change the argument, we clone it first.
					
					var i,
						attendeeInitDict = {};
					for (i in args.attendeeInitDict) {
						if (! args.attendeeInitDict.hasOwnProperty(i)) {
							continue;
						}
						(i === 'rsvp') ? attendeeInitDict.RSVP = args.attendeeInitDict.rsvp : attendeeInitDict[i] = args.attendeeInitDict[i];
					}
					this._obj = new tizen.CalendarAttendee(args.uri, attendeeInitDict);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
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
			rsvp: {
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
					return new ContactRef(void 0, this._obj.contactRef);
				},
				set: function(value) {
					this._obj.contactRef = value._obj;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	calendarAttendee.prototype.declaredClass = 'Tizen.Calendar.CalendarAttendee';
	return calendarAttendee;
});
