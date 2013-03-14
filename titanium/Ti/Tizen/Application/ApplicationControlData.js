define(['Ti/_/declare'], function(declare) {
	return declare('Tizen.Application.ApplicationControlData', null, {
		constructor: function(args) {
			if(args.toString() === '[object ApplicationControlData]') {
				this._obj = args;
			} else {
				if (args.key && args.value) {
					this._obj = new tizen.ApplicationControlData(args.key, args.value);
				} else {
					Ti.API.error('Constructor with such parameters not found for ApplicationControlData.');
				}
			}
		},

		properties: {
			key: {
				get: function() {
					return this._obj.key;
				},
				set: function(value) {
					this._obj.key = value;
				}
			},
			value: {
				get: function() {
					return this._obj.value;
				},
				set: function(value) {
					this._obj.value = value;
				}
			},
		}
	});
});