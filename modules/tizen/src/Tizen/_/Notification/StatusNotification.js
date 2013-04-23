// Wraps Tizen interface "StatusNotification" that resides in Tizen module "Application".

define(['Ti/_/declare', 'Tizen/_/Notification/Notification'], function(declare, Notification) {

	var StatusNotification = declare(Notification, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				var notificationInitDict;
				if (args.notificationInitDict) {
					notificationInitDict = args.notificationInitDict;
					notificationInitDict.appControl && (notificationInitDict.appControl = notificationInitDict.appControl._obj);
				}
				this._obj = new tizen.StatusNotification(args.statusType, args.title, args.notificationInitDict);
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
			progressValue: {
				get: function() {
					return this._obj.progressValue;
				},
				set: function(value) {
					this._obj.progressValue = value;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	StatusNotification.prototype.declaredClass = 'Tizen.Notification.StatusNotification';
	return StatusNotification;
});
