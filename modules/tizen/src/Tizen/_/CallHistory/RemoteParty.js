// Wraps Tizen interface "RemoteParty" that resides in Tizen module "CallHistory".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var RemoteParty = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	RemoteParty.prototype.declaredClass = 'Tizen.CallHistory.RemoteParty';
	return RemoteParty;
});
