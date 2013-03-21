define(['Ti/_/declare'], function(declare) {
	var RemoteParty = declare(null, {
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
			},
		}

	});

	RemoteParty.prototype.declaredClass = 'Tizen.Callhistory.RemoteParty';
	return RemoteParty;

});