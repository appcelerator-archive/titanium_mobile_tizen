// Wraps Tizen interface "MessageFolder" that resides in Tizen module "Messaging".

define(['Ti/_/declare'], function(declare) {

	var messageFolder = declare(null, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			parentId: {
				get: function() {
					return this._obj.parentId;
				}
			},
			serviceId: {
				get: function() {
					return this._obj.serviceId;
				}
			},
			contentType: {
				get: function() {
					return this._obj.contentType;
				}
			},
			path: {
				get: function() {
					return this._obj.path;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				}
			}
		},

		properties: {
			name: {
				get: function() {
					return this._obj.name;
				},
				set: function(value) {
					this._obj.name = value;
				}
			},
			synchronizable: {
				get: function() {
					return this._obj.synchronizable;
				},
				set: function(value) {
					this._obj.synchronizable = value;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	messageFolder.prototype.declaredClass = 'Tizen.Messaging.MessageFolder';
	return messageFolder;
});
