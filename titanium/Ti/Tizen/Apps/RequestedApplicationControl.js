define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Tizen.Apps.RequestedApplicationControl', Evented, {
		constructor: function(args) {
			this._obj = args;
			this.constants.__values__.appControl = {
				key: this._obj.appControl.key,
				value: this._obj.appControl.value
			};
		},

		constants: {
			appControl: {}
		},

		replyResult: function(data /*ApplicationControlData*/) {
			this._obj.replyResult(new tizen.ApplicationControlData(this.constants.__values__.appControl.key, this.constants.__values__.appControl.value));
		},

		replyFailure: function() {
			this._obj.replyFailure();
		}
	});
});