define(['Ti/_/declare'], function(declare) {

	function createTZDate(dateObj) {
		return new tizen.TZDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes())
	}
	function createDate(tzDateObj){
		return new Date(tzDateObj.getUTCFullYear(), tzDateObj.getUTCMonth(), tzDateObj.getUTCDate(), tzDateObj.getUTCHours(), tzDateObj.getUTCMinutes());
	}

	return declare('Ti.Tizen.Calendar.CalendarRecurrenceRule', null, {
		constructor: function(args) {
			if(args.toString() === '[object CalendarRecurrenceRule]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('frequency')) {

					var initDict = args,
						untilDate = args.ruleInitDict && args.ruleInitDict.untilDate,
						exceptions = args.ruleInitDict && args.ruleInitDict.exceptions,
						i=0,
						len = exceptions && exceptions.length,
						exceptionsTmp = [];

					if(untilDate) {
						args.ruleInitDict.hasOwnProperty('untilDate') && (initDict.ruleInitDict.untilDate = createTZDate(untilDate));
					}
					if(exceptions) {
						for(; i<len; i++) {
							exceptionsTmp.push(createTZDate(exceptions[i]));
						}
						args.ruleInitDict.hasOwnProperty('exceptions') && (initDict.ruleInitDict.exceptions = exceptionsTmp);
					}

					this._obj = new tizen.CalendarRecurrenceRule(initDict.frequency, initDict.ruleInitDict);

				} else {
					Ti.API.error('Constructor with such parameters not found in CalendarRecurrenceRule.');
				}
			}
		},

		properties: {
			frequency: {
				get: function() {
					return this._obj.frequency;
				},
				set: function(value) {
					this._obj.frequency = value;
				}
			},
			interval: {
				get: function() {
					return this._obj.interval;
				},
				set: function(value) {
					this._obj.interval = value;
				}
			},
			untilDate: {
				get: function() {
					var untilDate = this._obj.untilDate;
					return createDate(untilDate);
				},
				set: function(value) {
					this._obj.untilDate = createTZDate(value);
				}
			},
			occurrenceCount: {
				get: function() {
					return this._obj.occurrenceCount;
				},
				set: function(value) {
					this._obj.occurrenceCount = value;
				}
			},
			daysOfTheWeek: {
				get: function() {
					return this._obj.daysOfTheWeek;
				},
				set: function(value) {
					this._obj.daysOfTheWeek = value;
				}
			},
			setPositions: {
				get: function() {
					return this._obj.setPositions;
				},
				set: function(value) {
					this._obj.setPositions = value;
				}
			},
			exceptions: {
				get: function() {
					var res = [],
						exceptions = this._obj.exceptions,
						i=0,
						len = exceptions.length;

					for(; i<len; i++) {
						res.push(createDate(exceptions[i]));
					}
					return res;
				},
				set: function(value) {
					var res = [],
						exceptions = value,
						i=0,
						len = exceptions.length;

					for(; i<len; i++) {
						res.push(createTZDate(exceptions[i]));
					}
					this._obj.exceptions = res;
				}
			}
		}

	});
});