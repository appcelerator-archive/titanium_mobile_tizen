define(['Ti/_/declare', 'Ti/Tizen/Application/ApplicationInformation', 'Ti/Tizen/Application/RequestedApplicationControl'], 
		function(declare, ApplicationInformation, RequestedApplicationControl) {

	return declare('Ti.Tizen.Application.Application', null, {
		constructor: function(args) {
			this._obj = args;
			this.constants.__values__.appInfo = new ApplicationInformation(this._obj.appInfo);
		},

		constants: {
			appInfo: {},
			contextId: {
				get: function() {
					return this._obj.contextId;
				}
			},
		},

		exit: function() {
			this._obj.exit();
		},

		hide: function() {
			this._obj.hide();
		},

		getRequestedAppControl: function() {
			return new RequestedApplicationControl(this._obj.getRequestedAppControl());
		}
	});
});