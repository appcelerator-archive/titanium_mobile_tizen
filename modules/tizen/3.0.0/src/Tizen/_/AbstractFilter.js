// Abstract base class for Tizen filter classes. Wraps Tizen's "AbstractFilter" native interface.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var filter = declare(Evented, {});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	filter.prototype.declaredClass = 'Tizen.AbstractFilter';
	return filter;
});