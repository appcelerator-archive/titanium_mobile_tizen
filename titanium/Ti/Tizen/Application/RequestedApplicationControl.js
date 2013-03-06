define(['Ti/_/declare', 'Ti/Tizen/Application/ApplicationControl'], function(declare, ApplicationControl) {
	return declare('Ti.Tizen.Application.RequestedApplicationControl', null, {
		constructor: function(args) {
			this._obj = args;
			this.constants.__values__.appControl = new ApplicationControl(this._obj.appControl);
		},

		constants: {
			appControl: {},
		},

		replyResult: function(data /*ApplicationControlData*/) {
			this._obj.replyResult(data ? data._obj : data);
		},

		replyFailure: function() {
			this._obj.replyFailure();
		}
	});
});