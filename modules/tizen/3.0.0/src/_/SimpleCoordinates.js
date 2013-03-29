define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var sc = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object SimpleCoordinates]') {
				this._obj = args;
			} else {
				this._obj = new tizen.SimpleCoordinates(args.latitude, args.longitude);
			}
		},

		properties: {
			latitude: {
				get: function() {
					return this._obj.latitude;
				},
				set: function(value) {
					this._obj.latitude = value;
				}
			},
			longitude: {
				get: function() {
					return this._obj.longitude;
				},
				set: function(value) {
					this._obj.longitude = value;
				}
			}
		}

	});

	sc.prototype.declaredClass = 'Tizen.SimpleCoordinates';
	return sc;
});