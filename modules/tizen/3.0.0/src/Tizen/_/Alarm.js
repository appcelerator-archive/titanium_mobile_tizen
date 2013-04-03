define(['Ti/_/lang', 'Tizen/_/Alarm/AlarmRelative', 'Tizen/_/Alarm/AlarmAbsolute', 'Ti/_/Evented'], function(lang, AlarmRelative, AlarmAbsolute, Evented) {

	var Alarm = lang.mixProps(require.mix({}, Evented), {

		add: function(alarm /*Alarm*/, applicationId /*ApplicationId*/, appControl /*ApplicationControl*/) {
			return tizen.alarm.add(alarm._obj, applicationId, appControl ? appControl._obj : appControl);
		},

		remove: function(id /*AlarmId*/) {
			return tizen.alarm.remove(id);
		},

		removeAll: function() {
			return tizen.alarm.removeAll();
		},

		getAlarm: function(id /*AlarmId*/) {
			return this._wrap(tizen.alarm.get(id));
		},

		getAll: function() {
			var objects = tizen.alarm.getAll(),
				i = 0,
				objectsCount = objects.length,
				result = [];

			for (; i < objectsCount; i++) {
				result.push(this._wrap(objects[i]));
			}
			return result;
		},

		_wrap: function(object) {
			var result;

			if (object.toString() === '[object AlarmRelative]') {
				result = this.createAlarmRelative(object);
			}
			if (object.toString() === '[object AlarmAbsolute]') {
				result = this.createAlarmAbsolute(object);
			}
			return result;
		},

		createAlarmRelative: function(args) {
			return new AlarmRelative(args);
		},

		createAlarmAbsolute: function(args) {
			return new AlarmAbsolute(args);
		},

		constants: {
			PERIOD_MINUTE: 60, //unsigned long long
			PERIOD_HOUR: 3600, //unsigned long long
			PERIOD_DAY: 86400, //unsigned long long
			PERIOD_WEEK: 604800 //unsigned long long
		}

	}, true);

	return Alarm;
});