// Wraps Tizen interface "CallHistoryEntry" that resides in Tizen module "CallHistory".

define(['Ti/_/declare', 'Tizen/_/CallHistory/RemoteParty', 'Ti/_/Evented'], function(declare, RemoteParty, Evented) {

	var CallHistoryEntry = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
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
			}
		},

		properties: {
			direction: {
				get: function() {
					return this._obj.direction;
				},
				set: function(value) {
					this._obj.direction = value;
				}
			}
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	CallHistoryEntry.prototype.declaredClass = 'Tizen.CallHistory.CallHistoryEntry';
	return CallHistoryEntry;
});
