define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var obj = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			appData: {
				get: function() {
					return this._obj.appData;
				}
			},
			alertMessage: {
				get: function() {
					return this._obj.alertMessage;
				}
			},
			date: {
				get: function() {
					return this._obj.date;
				}
			},
		},

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.Push.PushMessage';
	return obj;
});