define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var RemoteParty = declare(Evented, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			remoteParty: {
				get: function() {
					return this._obj.remoteParty;
				}
			},
			personId: {
				get: function() {
					return this._obj.personId;
				}
			}
		}
	});

	RemoteParty.prototype.declaredClass = 'Tizen.CallHistory.RemoteParty';

	return RemoteParty;
});