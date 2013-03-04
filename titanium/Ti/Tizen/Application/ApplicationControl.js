define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Application.ApplicationControl', null, {
		constructor: function(args) {
			if(args.toString() === '[object ApplicationControl]') {
				this._obj = args;
			} else {
				this._obj = new tizen.ApplicationControl(args.operation, args.uri, args.mime, args.category, args.data);
			}
		},

		properties: {
			operation: {
				get: function() {
					return this._obj.operation;
				},
				set: function(value) {
					this._obj.operation = value;
				}
			},
			uri: {
				get: function() {
					return this._obj.uri;
				},
				set: function(value) {
					this._obj.uri = value;
				}
			},
			mime: {
				get: function() {
					return this._obj.mime;
				},
				set: function(value) {
					this._obj.mime = value;
				}
			},
			category: {
				get: function() {
					return this._obj.category;
				},
				set: function(value) {
					this._obj.category = value;
				}
			},
			data: {
				get: function() {
					return this._obj.data;
				},
				set: function(value) {
					this._obj.data = value;
				}
			},
		},

	});
});