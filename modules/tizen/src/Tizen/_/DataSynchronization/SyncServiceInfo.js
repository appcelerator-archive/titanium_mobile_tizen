define(['Ti/_/declare'], function(declare) {
	var obj = declare(null, {

		constructor: function(args, nativeObj) {
			if(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				this._obj = new tizen.SyncServiceInfo(args.enable, args.serviceType, args.serverDatabaseUri, args.id, args.password);
			}
		},

		properties: {
			enable: {
				get: function() {
					return this._obj.enable;
				},
				set: function(value) {
					this._obj.enable = value;
				}
			},
			serviceType: {
				get: function() {
					return this._obj.serviceType;
				},
				set: function(value) {
					this._obj.serviceType = value;
				}
			},
			serverDatabaseUri: {
				get: function() {
					return this._obj.serverDatabaseUri;
				},
				set: function(value) {
					this._obj.serverDatabaseUri = value;
				}
			},
			id: {
				get: function() {
					return this._obj.id;
				},
				set: function(value) {
					this._obj.id = value;
				}
			},
			password: {
				get: function() {
					return this._obj.password;
				},
				set: function(value) {
					this._obj.password = value;
				}
			},
		},

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataSynchronization.SyncServiceInfo';
	return obj;
});
