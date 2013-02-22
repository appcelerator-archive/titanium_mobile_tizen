define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.Call.CallHistoryEntry', null, {
		constants: {
			uid: {
				get: function() {
					return this._obj.uid;
				}
			},
			serviceId: {
				get: function() {
					return this._obj.serviceId;
				}
			},
			callType: {
				get: function() {
					return this._obj.callType;
				}
			},
			tags: {
				get: function() {
					return this._obj.tags;
				}
			},
			remoteParties: {
				get: function() {
					return this._obj.remoteParties;
				}
			},
			forwardedFrom: {
				get: function() {
					return this._obj.forwardedFrom;
				}
			},
			startTime: {
				get: function() {
					return this._obj.startTime;
				}
			},
			duration: {
				get: function() {
					return this._obj.duration;
				}
			},
			endReason: {
				get: function() {
					return this._obj.endReason;
				}
			},
			recording: {
				get: function() {
					return this._obj.recording;
				}
			},
			cost: {
				get: function() {
					return this._obj.cost;
				}
			},
		},

		properties: {
			direction: {
				get: function() {
					return this._obj.direction;
				},
				set: function(value) {
					this._obj.direction = value;
				}
			},
			currency: {
				get: function() {
					return this._obj.currency;
				},
				set: function(value) {
					this._obj.currency = value;
				}
			},
		},
		
		constructor: function(args) {
			this._obj = args;
		}

	});
});