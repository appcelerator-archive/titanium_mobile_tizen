define(['Ti/_/declare'], function(declare) {
	var obj = declare(null, {

		constructor: function(args, nativeObj) {
			if(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				if ('url' in args && 'id' in args && 'password' in args && 'mode' in args && 'interval' in args) {
					this._obj = new tizen.SyncInfo(args.url, args.id, args.password, args.mode, args.interval);
				} else if ('url' in args && 'id' in args && 'password' in args && 'mode' in args && 'type' in args) {
					this._obj = new tizen.SyncInfo(args.url, args.id, args.password, args.mode, args.type);
				} else if ('url' in args && 'id' in args && 'password' in args && 'mode' in args) {
					this._obj = new tizen.SyncInfo(args.url, args.id, args.password, args.mode);
				} else {
					throw new Error('Constructor SyncInfo with given parameters doesn\'t exist');
				}
			}
		},

		properties: {
			url: {
				get: function() {
					return this._obj.url;
				},
				set: function(value) {
					this._obj.url = value;
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
			mode: {
				get: function() {
					return this._obj.mode;
				},
				set: function(value) {
					this._obj.mode = value;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				},
				set: function(value) {
					this._obj.type = value;
				}
			},
			interval: {
				get: function() {
					return this._obj.interval;
				},
				set: function(value) {
					this._obj.interval = value;
				}
			},
		},

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataSynchronization.SyncInfo';
	return obj;
});