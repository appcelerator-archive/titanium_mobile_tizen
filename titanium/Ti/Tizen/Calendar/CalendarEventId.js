define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Calendar.CalendarEventId', null, {
		constructor: function(args) {
			if (args.toString() === '[object CalendarEventId]') {
				this._obj = args;
			} else {
				this._obj = new tizen.CalendarEventId(args.uid, args.rid);
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
			},
		},

	});
});