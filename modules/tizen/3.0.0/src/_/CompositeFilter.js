define(['Ti/_/declare', '_/AbstractFilter'], function(declare, AbstractFilter) {

	var filter = declare(AbstractFilter, {

		constructor: function(args) {
			if (args.toString() === '[object CompositeFilter]') {
				this._obj = args;
			} else {
				var i = 0,
					filters = args.filters,
					filtersCount = filters.length,
					result = [];

				for (; i < filtersCount; i++) {
					result.push(filters[i]._obj);
				}
				args.filters = result;
				this._obj = new tizen.CompositeFilter(args.type, args.filters);
			}
		},

		properties: {
			type: {
				get: function() {
					return this._obj.type;
				},
				set: function(value) {
					this._obj.type = value;
				}
			},
			filters: {
				get: function() {
					return this._obj.filters;
				},
				set: function(value) {
					this._obj.filters = value;
				}
			}
		}

	});

	filter.prototype.declaredClass = 'Tizen.CompositeFilter';
	return filter;
});