define(['Ti/_/declare', 'Ti/Tizen/AbstractFilter'], function(declare, AbstractFilter){
	return declare('Ti.Tizen.AttributeFilter', AbstractFilter, {
		constructor: function(args) {
			if(args.toString() === '[object AttributeFilter]') {
				this._obj = args;
			} else {
				this._obj = new tizen.AttributeFilter(args.attributeName, args.matchFlag, args.matchValue);
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
});