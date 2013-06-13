// Wraps Tizen interface "Notification" that resides in Tizen module "Notification".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var Notification = declare(Evented, {

		constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			postedTime: {
				get: function() {
					return this._obj.postedTime;
				}
			}
		},

		properties: {
			title: {
				get: function() {
					return this._obj.title;
				},
				set: function(value) {
					this._obj.title = value;
				}
			},
			content: {
				get: function() {
					return this._obj.content;
				},
				set: function(value) {
					this._obj.content = value;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	Notification.prototype.declaredClass = 'Tizen.Notification.Notification';
	return Notification;
});
