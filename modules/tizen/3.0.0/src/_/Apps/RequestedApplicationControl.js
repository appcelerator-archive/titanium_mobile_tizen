define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var requestedApplicationControl = declare(Evented, {

		constructor: function(args) {
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

	requestedApplicationControl.prototype.declaredClass = 'Tizen.Apps.RequestedApplicationControl';
	return requestedApplicationControl;
});