// Wraps Tizen interface "RequestedApplicationControl" that resides in Tizen module "Application".
// Module "Application" is renamed as Apps in this wrapper.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var requestedApplicationControl = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		replyResult: function(data) {
			this._obj.replyResult(data);
		},

		replyFailure: function() {
			this._obj.replyFailure();
		},

		constants: {
			appControl: {
				get: function() {
					var a = this._obj.appControl;
					return {
						operation: a.operation,
						uri: a.uri,
						mime: a.mime,
						category: a.category,
						data: a.data,
						_obj: new tizen.ApplicationControl(a.operation, a.uri, a.mime, a.category, a.data)
					};
				}					
			},

			callerAppId: {
				get: function() {
					return this._obj.callerAppId;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	requestedApplicationControl.prototype.declaredClass = 'Tizen.Apps.RequestedApplicationControl';
	return requestedApplicationControl;
});
