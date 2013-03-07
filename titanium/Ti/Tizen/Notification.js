define(['Ti/_/lang', 'Ti/Tizen/Notification/StatusNotification', 'Ti/_/Evented'], function(lang, StatusNotification, Evented) {
	return lang.setObject('Ti.Tizen.Notification', Evented, {

		constants: {
			NOTIFICATION_TYPE_STATUS: 'STATUS',
			STATUS_NOTIFICATION_TYPE_SIMPLE: 'SIMPLE',
			STATUS_NOTIFICATION_TYPE_ONGOING: 'ONGOING',
			STATUS_NOTIFICATION_TYPE_PROGRESS: 'PROGRESS',
		},

		post: function(notification /*Notification*/) {
			console.log('it work here');
			tizen.notification.post(notification._obj);
		},

		update: function(notification /*Notification*/) {
			tizen.notification.update(notification._obj);
		},

		remove: function(id /*NotificationId*/) {
			tizen.notification.remove(id);
		},

		removeAll: function() {
			tizen.notification.removeAll();
		},

		get: function(id /*NotificationId*/) {
			return this._wrap(tizen.notification.get(id));
		},

		getAll: function() {
			var objects = tizen.notification.getAll(),
				i = 0,
				objectsCount = objects.length,
				result = [];
			for(; i < objectsCount; i++) {
				result.push(this._wrap(objects[i]));
			}
			return result;
		},

		_wrap: function(object) {
			var result;
			if (object.toString() === '[object StatusNotification]') {
				result = this.createStatusNotification(object);
			}
			return result;
		},

		createStatusNotification: function(args) {
			return new StatusNotification(args); //Need to add this module StatusNotification in define, with path Ti/Tizen/Notification/StatusNotification
		},
	});
});