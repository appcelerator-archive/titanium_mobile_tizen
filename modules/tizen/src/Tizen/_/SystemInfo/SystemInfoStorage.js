// Wraps Tizen interface "SystemInfoStorage" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Tizen/_/SystemInfo/SystemInfoProperty', 'Tizen/_/SystemInfo/SystemInfoStorageUnit'], function(declare, SystemInfoProperty, SystemInfoStorageUnit) {

	var storage = declare(SystemInfoProperty, {

		constructor: function(args) {
			// Automatically initialize system info storage units.
			
			var i = 0,
				units = args,
				unitsCount = units.length,
				result = [];

			for (; i < unitsCount; i++) {
				result.push(new SystemInfoStorageUnit(units[i]));
			}

			this._obj = args;
			this.constants.__values__.units = result;
		},

		constants: {
			units: {}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	storage.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoStorage';
	return storage;
});
