define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.Time.TimeDuration', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object TimeDuration]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('length')) {
					this._obj = new tizen.TimeDuration(args.length, args.unit);
				} else {
					Ti.API.error('Constructor with such parameters not found in TimeDuration.');
				}
			}
		},

		properties: {
			length: {
				get: function() {
					return this._obj.length;
				},
				set: function(value) {
					this._obj.length = value;
				}
			},
			unit: {
				get: function() {
					return this._obj.unit;
				},
				set: function(value) {
					this._obj.unit = value;
				}
			},
		},

		difference: function(other /*TimeDuration*/) {
			return this._obj.difference(other._obj);
		},

		equalsTo: function(other /*TimeDuration*/) {
			return this._obj.equalsTo(other._obj);
		},

		lessThan: function(other /*TimeDuration*/) {
			return this._obj.lessThan(other._obj);
		},

		greaterThan: function(other /*TimeDuration*/) {
			return this._obj.greaterThan(other._obj);
		}
	});
});