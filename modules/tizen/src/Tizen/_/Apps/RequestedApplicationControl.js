// Wraps Tizen interface "RequestedApplicationControl" that resides in Tizen module "Application".
// Module "Application" is renamed as Apps in this wrapper.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var requestedApplicationControl = declare(Evented, {

		constructor: function(args) {
			// args is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = args;
			this.constants.__values__.appControl = {
				key: this._obj.appControl.key,
				value: this._obj.appControl.value
			};
		},

		replyResult: function(data /*ApplicationControlData*/) {
			this._obj.replyResult(new tizen.ApplicationControlData(this.constants.__values__.appControl.key, this.constants.__values__.appControl.value));
		},

		replyFailure: function() {
			this._obj.replyFailure();
		},

		constants: {
			appControl: {}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	requestedApplicationControl.prototype.declaredClass = 'Tizen.Apps.RequestedApplicationControl';
	return requestedApplicationControl;
});
