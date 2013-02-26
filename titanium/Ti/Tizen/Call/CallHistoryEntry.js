define(['Ti/_/declare', 'Ti/Tizen/Call/RemoteParty'], function(declare, RemoteParty) {

	return declare('Ti.Tizen.Call.CallHistoryEntry', null, {

		constructor: function(args) {
			this._obj = args;
		},

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
					var remoteParties = this._obj.remoteParties,
						i = 0,
						remotePartiesCount = remoteParties.length,
						result = [];

					for (; i < remotePartiesCount; i++) {
						result.push(new RemoteParty(remoteParties[i]));
					}

					return result;
				}
			},
			forwardedFrom: {
				get: function() {
					return new RemoteParty(this._obj.forwardedFrom);
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
		}

	});

});