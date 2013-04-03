define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var sysInfoProperty = declare(Evented, {

		constructor: function(args) {
			this._obj = args;
		}

	});

	sysInfoProperty.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoProperty';
	return sysInfoProperty;
});