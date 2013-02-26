define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Power.PowerStateRequest', null, {
		constructor: function(args) {
			if(args.toString() === '[object PowerStateRequest]') {
				this._obj = args;
			} else {
				this._obj = new tizen.PowerStateRequest(args.resource, args.state);
			}
		},

		properties: {
			resource: {
				get: function() {
					return this._obj.resource;
				},
				set: function(value) {
					this._obj.resource = value;
				}
			},
			minimalState: {
				get: function() {
					return this._obj.minimalState;
				},
				set: function(value) {
					this._obj.minimalState = value;
				}
			},
		},

	});
});