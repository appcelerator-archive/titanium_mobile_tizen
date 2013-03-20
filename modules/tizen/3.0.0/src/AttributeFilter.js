define(['Ti/_/declare', 'AbstractFilter'], function(declare, AbstractFilter) {
	var filter = declare(AbstractFilter, {
		constructor: function(args) {
        	if(args.toString() === '[object AttributeFilter]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('attributeName')) {
					this._obj = new tizen.AttributeFilter(args.attributeName, args.matchFlag, args.matchValue);
				} else {
					Ti.API.error('AttributeFilter\'s constructor with such parameters not found.');
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
			},
		},

	});
    
    filter.prototype.declaredClass = 'Tizen.AttributeFilter';
    
    return filter;
});