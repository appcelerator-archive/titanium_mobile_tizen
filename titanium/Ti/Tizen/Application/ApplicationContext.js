define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Application.ApplicationContext', null, {
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
			},
		}
	});
});