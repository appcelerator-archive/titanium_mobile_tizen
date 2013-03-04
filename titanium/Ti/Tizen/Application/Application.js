define(['Ti/_/declare', 'Ti/Tizen/Application/ApplicationInformation'], function(declare, ApplicationInformation) {
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
			return this._obj.exit();
		},

		hide: function() {
			this._obj.hide();
		},

		getRequestedAppControl: function() {
			return this._obj.getRequestedAppControl();
		}
	});
});