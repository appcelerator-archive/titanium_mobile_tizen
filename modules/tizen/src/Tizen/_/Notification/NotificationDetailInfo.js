define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var NotificationDetailInfo = declare(Evented, {

		constructor: function(args, nativeObj) {
			if(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				if('mainText' in args) {
					this._obj = new tizen.NotificationDetailInfo(args.mainText, args.subText);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
			}
		},

		properties: {
			mainText: {
				get: function() {
					return this._obj.mainText;
				},
				set: function(value) {
					this._obj.mainText = value;
				}
			},
			subText: {
				get: function() {
					return this._obj.subText;
				},
				set: function(value) {
					this._obj.subText = value;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	NotificationDetailInfo.prototype.declaredClass = 'Tizen.Notification.NotificationDetailInfo';
	return NotificationDetailInfo;
});