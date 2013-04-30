// Wraps Tizen interface "SimpleCoordinates" that resides in Tizen module "Tizen".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var sc = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				if('latitude' in args && 'longitude' in args) {
					this._obj = new tizen.SimpleCoordinates(args.latitude, args.longitude);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	sc.prototype.declaredClass = 'Tizen.SimpleCoordinates';
	return sc;
});
