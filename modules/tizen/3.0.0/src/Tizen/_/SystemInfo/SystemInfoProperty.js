// Wraps Tizen interface "SystemInfoProperty" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var sysInfoProperty = declare(Evented, {

		constructor: function(args) {
			// args is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = args;
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	sysInfoProperty.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoProperty';
	return sysInfoProperty;
});
