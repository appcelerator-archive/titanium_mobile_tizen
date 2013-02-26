define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Application.ApplicationService', null, {
		constructor: function(args) {
			if(args.toString() === '[object ApplicationService]') {
				this._obj = args;
			} else {
				if ('operation' in args && 'uri' in args && 'mime' in args && 'data' in args) {
					this._obj = new tizen.ApplicationService(args.operation, args.uri, args.mime, args.data);
				} else if ('operation' in args) {
					this._obj = new tizen.ApplicationService(args.operation);
				} else {
					Ti.API.error('Constructor with given parameters doesn\'t exists');
				}
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
			data: {
				get: function() {
					return this._obj.data;
				},
				set: function(value) {
					this._obj.data = value;
				}
			},
		},

		replyResult: function(data /*ApplicationServiceData*/) {
			return this._obj.replyResult(data ? data._obj : data);
		},

		replyFailure: function() {
			return this._obj.replyFailure();
		}
	});
});