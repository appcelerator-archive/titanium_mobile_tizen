define(['Ti/_/declare', 'Ti/Tizen/Notification/Notification'], function(declare, Notification) {
	return declare('Ti.Tizen.Notification.StatusNotification', Notification, {
		constructor: function(args) {
			if(args.toString() === '[object StatusNotification]') {
				this._obj = args;
			} else {
				var notificationInitDict;
				if (args.notificationInitDict) {
					notificationInitDict = args.notificationInitDict;
					notificationInitDict.service && (notificationInitDict.service = notificationInitDict.service._obj);
				}
				this._obj = new tizen.StatusNotification(args.statusType, args.title, notificationInitDict);
			}
		},

		constants: {
			statusType: {
				get: function() {
					return this._obj.statusType;
				}
			},
		},

		properties: {
			iconPath: {
				get: function() {
					return this._obj.iconPath;
				},
				set: function(value) {
					this._obj.iconPath = value;
				}
			},
			soundPath: {
				get: function() {
					return this._obj.soundPath;
				},
				set: function(value) {
					this._obj.soundPath = value;
				}
			},
			vibration: {
				get: function() {
					return this._obj.vibration;
				},
				set: function(value) {
					this._obj.vibration = value;
				}
			},
			service: {
				get: function() {
					return this._obj.service;
				},
				set: function(value) {
					this._obj.service = value;
				}
			},
			progressValue: {
				get: function() {
					return this._obj.progressValue;
				},
				set: function(value) {
					this._obj.progressValue = value;
				}
			},
		}

	});
});