define(['Ti/_/declare'], function(declare) {

	function createTZDate(dateObj) {
		return new tizen.TZDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes())
	}
	function createDate(tzDateObj){
		return new Date(tzDateObj.getUTCFullYear(), tzDateObj.getUTCMonth(), tzDateObj.getUTCDate(), tzDateObj.getUTCHours(), tzDateObj.getUTCMinutes());
	}

	return declare('Ti.Tizen.Calendar.CalendarAlarm', null, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarAlarm]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('before') && args.hasOwnProperty('method') && args.hasOwnProperty('description')) {
					this._obj = new tizen.CalendarAlarm(args.before, args.method, args.description);
				} else if (args.hasOwnProperty('absoluteDate') && args.hasOwnProperty('method') && args.hasOwnProperty('description')) {
					var alarmInitDict = args,
						absoluteDate = args.absoluteDate;

					args.hasOwnProperty('absoluteDate') && (alarmInitDict.absoluteDate = createTZDate(absoluteDate));

					this._obj = new tizen.CalendarAlarm(alarmInitDict.absoluteDate, alarmInitDict.method, alarmInitDict.description);
				} else {
					Ti.API.error('Constructor with such parameters does not exist in CalendarAlarm.');
				}
			}
		},

		properties: {
			absoluteDate: {
				get: function() {
					var absoluteDate = this._obj.absoluteDate;
					return createDate(absoluteDate);
				},
				set: function(value) {
					this._obj.absoluteDate = createTZDate(value);
				}
			},
			before: {
				get: function() {
					return this._obj.before;
				},
				set: function(value) {
					this._obj.before = value;
				}
			},
			method: {
				get: function() {
					return this._obj.method;
				},
				set: function(value) {
					this._obj.method = value;
				}
			},
			description: {
				get: function() {
					return this._obj.description;
				},
				set: function(value) {
					this._obj.description = value;
				}
			}
		}

	});
});