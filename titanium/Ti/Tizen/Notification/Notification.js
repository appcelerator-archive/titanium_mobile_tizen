define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.Notification.Notification', Evented, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			postedTime: {
				get: function() {
					return this._obj.postedTime;
				}
			},
		},

		properties: {
			title: {
				get: function() {
					return this._obj.title;
				},
				set: function(value) {
					this._obj.title = value;
				}
			},
			content: {
				get: function() {
					return this._obj.content;
				},
				set: function(value) {
					this._obj.content = value;
				}
			},
		},

	});
});