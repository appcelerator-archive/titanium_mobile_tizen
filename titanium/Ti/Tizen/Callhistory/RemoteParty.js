define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Callhistory.RemoteParty', null, {
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
		},

	});
});