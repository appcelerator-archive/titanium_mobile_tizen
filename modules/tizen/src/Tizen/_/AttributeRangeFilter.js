// Wraps Tizen interface "AttributeRangeFilter" that resides in Tizen module "Tizen".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var filter = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object AttributeRangeFilter]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				this._obj = new tizen.AttributeRangeFilter(args.attributeName, args.initialValue, args.endValue);
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
