define(['Ti/_/declare', 'Ti/_/Evented', 'Ti/Tizen/Apps/ApplicationInformation', 'Ti/Tizen/Apps/RequestedApplicationControl'], 
		function(declare, Evented, ApplicationInformation, RequestedApplicationControl) {

	return declare('Tizen.Apps.Application', Evented, {
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