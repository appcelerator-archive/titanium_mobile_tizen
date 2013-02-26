define(['Ti/_/declare', 'Ti/Tizen/Contact/ContactRef'], function(declare, ContactRef) {

	return declare('Ti.Tizen.Call.RemoteParty', null, {

	constructor: function(args) {
			this._obj = args;
		},

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
					return new ContactRef(this._obj.contactRef);
				}
			},
		}

	});

});