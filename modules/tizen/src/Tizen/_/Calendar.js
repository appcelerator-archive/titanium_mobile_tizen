// Wraps Tizen module "Calendar".

define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/Calendar/CalendarInstance', 'Tizen/_/Calendar/CalendarTask', 'Tizen/_/Calendar/CalendarEvent',
	'Tizen/_/Calendar/CalendarAttendee', 'Tizen/_/Calendar/CalendarRecurrenceRule', 'Tizen/_/Calendar/CalendarEventId', 'Tizen/_/Calendar/CalendarAlarm'],
	function(lang, Evented, CalendarInstance, CalendarTask, CalendarEvent, CalendarAttendee, CalendarRecurrenceRule, CalendarEventId, CalendarAlarm) {

		function onError (e, callback) {
			callback({
				code: e.code,
				success: false,
				error: e.type + ': ' + e.message
			});
		}

		return lang.mixProps(require.mix({}, Evented), {

			getCalendars: function(type /*CalendarType*/, callback) {
				tizen.calendar.getCalendars(type,
					callback && function(calendars) {
						var i = 0,
							len = calendars.length,
							calendarsArr = [];

						for (; i < len; i++) {
							calendarsArr.push(new CalendarInstance(calendars[i]));
						}
						callback({
							code: 0,
							success: true,
							calendars: calendarsArr
						});
					}, callback && function(e) {
						onError(e, callback);
					}
				);
			},

			getUnifiedCalendar: function(type /*CalendarType*/) {
				return new CalendarInstance(tizen.calendar.getUnifiedCalendar(type));
			},

			getDefaultCalendar: function(type /*CalendarType*/) {
				return new CalendarInstance(tizen.calendar.getDefaultCalendar(type));
			},

			getCalendar: function(type /*CalendarType*/, id /*CalendarId*/) {
				return new CalendarInstance(tizen.calendar.getCalendar(type, id));
			},

			createCalendarTask: function(args) {
				return new CalendarTask(args);
			},

			createCalendarEvent: function(args) {
				return new CalendarEvent(args);
			},

			createCalendarAttendee: function(args) {
				return new CalendarAttendee(args);
			},

			createCalendarRecurrenceRule: function(args) {
				return new CalendarRecurrenceRule(args);
			},

			createCalendarEventId: function(args) {
				return new CalendarEventId(args);
			},

			createCalendarAlarm: function(args) {
				return new CalendarAlarm(args);
			},

			constants: {
				CALENDAR_TYPE_EVENT: 'EVENT',
				CALENDAR_TYPE_TASK: 'TASK',
				CALENDAR_TEXT_FORMAT_ICALENDAR_20: 'ICALENDAR_20',
				CALENDAR_TEXT_FORMAT_VCALENDAR_10: 'VCALENDAR_10',
				ALARM_METHOD_SOUND: 'SOUND',
				ALARM_METHOD_DISPLAY: 'DISPLAY',
				RECURRENCE_RULE_FREQUENCY_DAILY: 'DAILY',
				RECURRENCE_RULE_FREQUENCY_WEEKLY: 'WEEKLY',
				RECURRENCE_RULE_FREQUENCY_MONTHLY: 'MONTHLY',
				RECURRENCE_RULE_FREQUENCY_YEARLY: 'YEARLY',
				BY_DAY_VALUE_MO: 'MO',
				BY_DAY_VALUE_TU: 'TU',
				BY_DAY_VALUE_WE: 'WE',
				BY_DAY_VALUE_TH: 'TH',
				BY_DAY_VALUE_FR: 'FR',
				BY_DAY_VALUE_SA: 'SA',
				BY_DAY_VALUE_SU: 'SU',
				EVENT_AVAILABILITY_BUSY: 'BUSY',
				EVENT_AVAILABILITY_FREE: 'FREE',
				ATTENDEE_TYPE_INDIVIDUAL: 'INDIVIDUAL',
				ATTENDEE_TYPE_GROUP: 'GROUP',
				ATTENDEE_TYPE_RESOURCE: 'RESOURCE',
				ATTENDEE_TYPE_ROOM: 'ROOM',
				ATTENDEE_TYPE_UNKNOWN: 'UNKNOWN',
				ATTENDEE_STATUS_PENDING: 'PENDING',
				ATTENDEE_STATUS_ACCEPTED: 'ACCEPTED',
				ATTENDEE_STATUS_DECLINED: 'DECLINED',
				ATTENDEE_STATUS_TENTATIVE: 'TENTATIVE',
				ATTENDEE_STATUS_DELEGATED: 'DELEGATED',
				ATTENDEE_STATUS_COMPLETED: 'COMPLETED',
				ATTENDEE_STATUS_IN_PROCESS: 'IN_PROCESS',
				ATTENDEE_ROLE_REQ_PARTICIPANT: 'REQ_PARTICIPANT',
				ATTENDEE_ROLE_OPT_PARTICIPANT: 'OPT_PARTICIPANT',
				ATTENDEE_ROLE_NON_PARTICIPANT: 'NON_PARTICIPANT',
				ATTENDEE_ROLE_CHAIR: 'CHAIR',
				CALENDAR_ITEM_PRIORITY_HIGH: 'HIGH',
				CALENDAR_ITEM_PRIORITY_MEDIUM: 'MEDIUM',
				CALENDAR_ITEM_PRIORITY_LOW: 'LOW',
				CALENDAR_ITEM_VISIBILITY_PUBLIC: 'PUBLIC',
				CALENDAR_ITEM_VISIBILITY_PRIVATE: 'PRIVATE',
				CALENDAR_ITEM_VISIBILITY_CONFIDENTIAL: 'CONFIDENTIAL',
				CALENDAR_ITEM_STATUS_TENTATIVE: 'TENTATIVE',
				CALENDAR_ITEM_STATUS_CONFIRMED: 'CONFIRMED',
				CALENDAR_ITEM_STATUS_CANCELLED: 'CANCELLED',
				CALENDAR_ITEM_STATUS_NEEDS_ACTION: 'NEEDS_ACTION',
				CALENDAR_ITEM_STATUS_IN_PROCESS: 'IN_PROCESS',
				CALENDAR_ITEM_STATUS_COMPLETED: 'COMPLETED'
			}

		}, true);
	});
