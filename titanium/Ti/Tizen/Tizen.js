define(['Ti/_/lang', 'Ti/_/Evented', 'Ti/Tizen/AttributeFilter', 'Ti/Tizen/AttributeRangeFilter', 
        'Ti/Tizen/CompositeFilter', 'Ti/Tizen/SortMode', 'Ti/Tizen/SimpleCoordinates'],
        
    function(lang, Evented, AttributeFilter, AttributeRangeFilter, CompositeFilter, SortMode, SimpleCoordinates) {
        return lang.setObject('Tizen', Evented, {

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

            createAttributeFilter: function(args) {
                return new AttributeFilter(args);
            },

            createAttributeRangeFilter: function(args) {
                return new AttributeRangeFilter(args);
            },

            createCompositeFilter: function(args) {
                return new CompositeFilter(args);
            },

            createSortMode: function(args) {
                return new SortMode(args);
            },

            createSimpleCoordinates: function(args) {
                return new SimpleCoordinates(args);
            }
        });
});