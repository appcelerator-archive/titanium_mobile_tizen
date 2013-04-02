define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var filter = declare(Evented, {});

	filter.prototype.declaredClass = 'Tizen.AbstractFilter';
	return filter;
});