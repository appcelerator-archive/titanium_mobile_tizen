define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.Call.RemoteParty', null, {
		constants: {
			remoteParty: {
				get: function() {
					return this._obj.remoteParty;
				}
			},
			displayName: {
				get: function() {
					return this._obj.displayName;
				}
			},
			contactRef: {
				get: function() {
					return this._obj.contactRef;
				}
			},
		},

	});
});