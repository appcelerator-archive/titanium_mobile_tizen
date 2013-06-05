// Wraps Tizen's module "Alarm".

define(['Ti/_/lang', 'Tizen/_/Alarm/AlarmRelative', 'Tizen/_/Alarm/AlarmAbsolute', 'Ti/_/Evented'], function(lang, AlarmRelative, AlarmAbsolute, Evented) {

	var Alarm = lang.mixProps(require.mix({}, Evented), {

		add: function(alarm /*Alarm*/, applicationId /*ApplicationId*/, appControl /*ApplicationControl*/) {
			// Tizen distinguishes between undefined appControl (this gives an error) and missing appControl.
			var args = [
				alarm._obj,
				applicationId
			];
			(typeof appControl !== 'undefined') && args.push((appControl && appControl._obj) || appControl);
			tizen.alarm.add.apply(tizen.alarm, args);
		},

		remove: function(id /*AlarmId*/) {
			tizen.alarm.remove(id);
		},

		removeAll: function() {
			tizen.alarm.removeAll();
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
			// Wrap the object (create a Titanium wrapped object out of a native Tizen object).

			var result;

			if (object.toString() === '[object AlarmRelative]') {
				result = new AlarmRelative(void 0, object);
			}
			else if (object.toString() === '[object AlarmAbsolute]') {
				result = new AlarmAbsolute(void 0, object);
			} else {
				throw new Error('Object of unknown type');
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
