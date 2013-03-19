define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Tizen.Apps.ApplicationContext', Evented, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			appId: {
				get: function() {
					return this._obj.appId;
				}
			}
		}
	});
});