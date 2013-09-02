// Wraps Tizen interface "StatusNotification" that resides in Tizen module "Application".

define(['Ti/_/declare', 'Tizen/_/Notification/Notification', 'Tizen/_/Notification/NotificationDetailInfo'], function(declare, Notification, NotificationDetailInfo) {

	var StatusNotification = declare(Notification, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				if('statusType' in args && 'title' in args) {
					var notificationInitDict;
					if (args.notificationInitDict) {
						notificationInitDict = args.notificationInitDict;
						notificationInitDict.appControl && (notificationInitDict.appControl = notificationInitDict.appControl._obj);
					}
					this._obj = new tizen.StatusNotification(args.statusType, args.title, args.notificationInitDict);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
			}
		},

		constants: {
			statusType: {
				get: function() {
					return this._obj.statusType;
				}
			}
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
			subIconPath: {
				get: function() {
					return this._obj.subIconPath;
				},
				set: function(value) {
					this._obj.subIconPath = value;
				}
			},
			number: {
				get: function() {
					return this._obj.number;
				},
				set: function(value) {
					this._obj.number = value;
				}
			},
			detailInfo: {
				get: function() {
					var objects = this._obj.detailInfo,
						i = 0,
						objectsCount = objects.length,
						result = [];

					for (; i < objectsCount; i++) {
						result.push(new NotificationDetailInfo(void 0, objects[i]));
					}
					return result;
				},
				set: function(value) {
					var arr = value,
						i = 0,
						len = arr.length,
						res = [];

						for (; i < len; i++) {
							res.push(arr[i]._obj);
						}
					this._obj.detailInfo = res;
				}
			},
			backgroundImagePath: {
				get: function() {
					return this._obj.backgroundImagePath;
				},
				set: function(value) {
					this._obj.backgroundImagePath = value;
				}
			},
			thumbnails: {
				get: function() {
					return this._obj.thumbnails;
				},
				set: function(value) {
					this._obj.thumbnails = value;
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
			appControl: {
				get: function() {
					return this._obj.appControl;
				},
				set: function(value) {
					this._obj.appControl = value;
				}
			},
			appId: {
				get: function() {
					return this._obj.appId;
				},
				set: function(value) {
					this._obj.appId = value;
				}
			},
			progressType: {
				get: function() {
					return this._obj.progressType;
				},
				set: function(value) {
					this._obj.progressType = value;
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
			ledColor: {
				get: function() {
					return this._obj.ledColor;
				},
				set: function(value) {
					this._obj.ledColor = value;
				}
			},
			ledOnPeriod: {
				get: function() {
					return this._obj.ledOnPeriod;
				},
				set: function(value) {
					this._obj.ledOnPeriod = value;
				}
			},
			ledOffPeriod: {
				get: function() {
					return this._obj.ledOffPeriod;
				},
				set: function(value) {
					this._obj.ledOffPeriod = value;
				}
			},
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	StatusNotification.prototype.declaredClass = 'Tizen.Notification.StatusNotification';
	return StatusNotification;
});
