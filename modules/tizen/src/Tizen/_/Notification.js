// Wraps Tizen module "Notification".

define(['Ti/_/lang', 'Tizen/_/Notification/StatusNotification', 'Tizen/_/Notification/NotificationDetailInfo', 'Ti/_/Evented'], function(lang, StatusNotification, NotificationDetailInfo, Evented) {

	return lang.mixProps(require.mix({}, Evented), {

		postNotification: function(notification /*Notification*/) {
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

		getNotification: function(id /*NotificationId*/) {
			return this._wrap(tizen.notification.get(id));
		},

		getAll: function() {
			var objects = tizen.notification.getAll(),
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
			if (object.toString() === '[object StatusNotification]') {
				result = new StatusNotification(void 0, object);
			}
			else {
				throw new Error('Object of unknown type');
			}
			return result;
		},

		createStatusNotification: function(args) {
			return new StatusNotification(args);
		},

		createNotificationDetailInfo: function(args) {
			return new NotificationDetailInfo(args);
		},

		constants: {
			NOTIFICATION_TYPE_STATUS: 'STATUS',
			STATUS_NOTIFICATION_TYPE_SIMPLE: 'SIMPLE',
			STATUS_NOTIFICATION_TYPE_THUMBNAIL: 'THUMBNAIL',
			STATUS_NOTIFICATION_TYPE_ONGOING: 'ONGOING',
			STATUS_NOTIFICATION_TYPE_PROGRESS: 'PROGRESS',
			NOTIFICATION_PROGRESS_TYPE_PERCENTAGE: 'PERCENTAGE',
			NOTIFICATION_PROGRESS_TYPE_BYTE: 'BYTE'
		}

	}, true);
});
