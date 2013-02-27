define(['Ti/_/lang'], function(lang) {
	return lang.setObject('Ti.Tizen.Notification', {

		constants: {
			NOTIFICATION_TYPE_STATUS: 'STATUS',
			STATUS_NOTIFICATION_TYPE_SIMPLE: 'SIMPLE',
			STATUS_NOTIFICATION_TYPE_ONGOING: 'ONGOING',
			STATUS_NOTIFICATION_TYPE_PROGRESS: 'PROGRESS',
		},

		post: function(notification /*Notification*/) {
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
			console.log(object);
			if (object.toString() === '[object StatusNotification]') {
				result = this.createStatusNotification(object);
			}
			return result;
		},

		createStatusNotification: function(args) {
			return new (require('Ti/Tizen/Notification/StatusNotification'))(args);
		},
	});
});