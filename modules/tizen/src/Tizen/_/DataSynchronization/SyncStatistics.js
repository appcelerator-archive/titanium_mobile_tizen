define(['Ti/_/declare'], function(declare) {
	var obj = declare(null, {

		constructor: function(nativeObj) {
			this._obj = nativeObj;
		},

		constants: {
			syncStatus: {
				get: function() {
					return this._obj.syncStatus;
				}
			},
			serviceType: {
				get: function() {
					return this._obj.serviceType;
				}
			},
			lastSyncTime: {
				get: function() {
					return this._obj.lastSyncTime;
				}
			},
			serverToClientTotal: {
				get: function() {
					return this._obj.serverToClientTotal;
				}
			},
			serverToClientAdded: {
				get: function() {
					return this._obj.serverToClientAdded;
				}
			},
			serverToClientUpdated: {
				get: function() {
					return this._obj.serverToClientUpdated;
				}
			},
			serverToClientRemoved: {
				get: function() {
					return this._obj.serverToClientRemoved;
				}
			},
			clientToServerTotal: {
				get: function() {
					return this._obj.clientToServerTotal;
				}
			},
			clientToServerAdded: {
				get: function() {
					return this._obj.clientToServerAdded;
				}
			},
			clientToServerUpdated: {
				get: function() {
					return this._obj.clientToServerUpdated;
				}
			},
			clientToServerRemoved: {
				get: function() {
					return this._obj.clientToServerRemoved;
				}
			},
		},

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataSynchronization.SyncStatistics';
	return obj;
});