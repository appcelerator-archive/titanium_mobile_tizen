// Wraps Tizen interface "Alarm" that resides in Tizen module "Alarm".
// This is an abstract interface for alarm types.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var Alarm = declare(Evented, {

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	Alarm.prototype.declaredClass = 'Tizen.Alarm.Alarm';
	return Alarm;
});
