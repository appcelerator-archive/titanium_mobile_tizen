define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty', 'Ti/Tizen/SystemInfo/SystemInfoStorageUnit'], function(declare, SystemInfoProperty, SystemInfoStorageUnit) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoStorage', SystemInfoProperty, {
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
			units: {},
		},

	});
});