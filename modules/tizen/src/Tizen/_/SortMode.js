// Wraps Tizen interface "SortMode" that resides in Tizen module "Application".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var sm = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				if('attributeName' in args) {
					this._obj = new tizen.SortMode(args.attributeName, args.order);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
			}
		},

		properties: {
			attributeName: {
				get: function() {
					return this._obj.attributeName;
				},
				set: function(value) {
					this._obj.attributeName = value;
				}
			},
			order: {
				get: function() {
					return this._obj.order;
				},
				set: function(value) {
					this._obj.order = value;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	sm.prototype.declaredClass = 'Tizen.SortMode';
	return sm;
});
