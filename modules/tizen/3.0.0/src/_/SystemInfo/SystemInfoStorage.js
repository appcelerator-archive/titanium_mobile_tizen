define(['Ti/_/declare', '_/SystemInfo/SystemInfoProperty', '_/SystemInfo/SystemInfoStorageUnit'], function(declare, SystemInfoProperty, SystemInfoStorageUnit) {

	var storage = declare(SystemInfoProperty, {

		constructor: function(args) {
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

	storage.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoStorage';
	return storage;
});