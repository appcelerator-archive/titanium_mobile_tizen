define(['Ti/_/lang'], function(lang) {
	return lang.setObject('Ti.Tizen', {

		constants: {
			FILTER_MATCH_FLAG_EXACTLY: 'EXACTLY',
			FILTER_MATCH_FLAG_FULLSTRING: 'FULLSTRING',
			FILTER_MATCH_FLAG_CONTAINS: 'CONTAINS',
			FILTER_MATCH_FLAG_STARTSWITH: 'STARTSWITH',
			FILTER_MATCH_FLAG_ENDSWITH: 'ENDSWITH',
			FILTER_MATCH_FLAG_EXISTS: 'EXISTS',
			SORT_MODE_ORDER_ASC: 'ASC',
			SORT_MODE_ORDER_DESC: 'DESC',
			COMPOSITE_FILTER_TYPE_UNION: 'UNION',
			COMPOSITE_FILTER_TYPE_INTERSECTION: 'INTERSECTION',
		},


		createCompositeFilter: function(args){
			return new (require('Ti/Tizen/CompositeFilter'))(args);
		},

		createAttributeFilter: function(args){
			return new (require('Ti/Tizen/AttributeFilter'))(args);
		},

		createAttributeRangeFilter: function(args){
			return new (require('Ti/Tizen/AttributeRangeFilter'))(args);
		},

		createSortMode: function(args){
			return new (require('Ti/Tizen/SortMode'))(args);
		},

		createSimpleCoordinates: function(args){
			return new (require('Ti/Tizen/SimpleCoordinates'))(args);
		},
	});
});