define(['Ti/_/declare', 'Ti/Tizen/AbstractFilter'], function(declare, AbstractFilter) {
	return declare('Tizen.AttributeRangeFilter', AbstractFilter, {
		constructor: function(args) {
			if(args.toString() === '[object AttributeRangeFilter]') {
				this._obj = args;
			} else {
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
			},
		},

	});
});