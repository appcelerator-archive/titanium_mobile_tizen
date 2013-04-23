// Wraps Tizen interface "WebAPIError" that resides in Tizen module "Tizen".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var error = declare(Evented, {

		constructor: function(nativeObj) {
			// args is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			code: {
				get: function() {
					return this._obj.code;
				}
			},

			name: {
				get: function() {
					return this._obj.name;
				}
			},

			message: {
				get: function() {
					return this._obj.message;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	error.prototype.declaredClass = 'Tizen.WebAPIError';
	return error;
});
