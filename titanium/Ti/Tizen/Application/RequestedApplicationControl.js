define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Application.RequestedApplicationControl', null, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			appControl: {
				get: function() {
					return this._obj.appControl;
				}
			},
		},

		replyResult: function(data /*ApplicationControlData*/) {
			return this._obj.replyResult(data ? data._obj : data);
		},

		replyFailure: function() {
			return this._obj.replyFailure();
		}
	});
});