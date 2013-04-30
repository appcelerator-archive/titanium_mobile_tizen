// Wraps Tizen interface "AttributeRangeFilter" that resides in Tizen module "Tizen".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var filter = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				if('attributeName' in args) {
					// args is a dictionary that the user of the wrapper module passed to the creator function.
					// Check if the required parameters are present (do not check for the optional ones).
					this._obj = new tizen.AttributeRangeFilter(args.attributeName, args.initialValue, args.endValue);
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
			initialValue: {
				get: function() {
					return this._obj.initialValue;
				},
				set: function(value) {
					this._obj.initialValue = value;
				}
			},
			endValue: {
				get: function() {
					return this._obj.endValue;
				},
				set: function(value) {
					this._obj.endValue = value;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	filter.prototype.declaredClass = 'Tizen.AttributeRangeFilter';
	return filter;
});
