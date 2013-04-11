// Wraps Tizen interface "AttributeFilter" that resides in Tizen module "Tizen".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var filter = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object AttributeFilter]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			} else {
				// args is a dictionary that the user of the wrapper module passed to the creator function.
				if (args.hasOwnProperty('attributeName')) {
					this._obj = new tizen.AttributeFilter(args.attributeName, args.matchFlag, args.matchValue);
				} else {
					console.error('AttributeFilter\'s constructor with such parameters not found.');
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
			matchFlag: {
				get: function() {
					return this._obj.matchFlag;
				},
				set: function(value) {
					this._obj.matchFlag = value;
				}
			},
			matchValue: {
				get: function() {
					return this._obj.matchValue;
				},
				set: function(value) {
					this._obj.matchValue = value;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	filter.prototype.declaredClass = 'Tizen.AttributeFilter';
	return filter;
});
