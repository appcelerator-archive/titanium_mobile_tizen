define(['Ti/_/declare', 'Ti/Tizen/Callhistory/RemoteParty'], function(declare, RemoteParty) {
	return declare('Tizen.Callhistory.CallHistoryEntry', null, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			uid: {
				get: function() {
					return this._obj.uid;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			features: {
				get: function() {
					return this._obj.features;
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
		},

	});
});