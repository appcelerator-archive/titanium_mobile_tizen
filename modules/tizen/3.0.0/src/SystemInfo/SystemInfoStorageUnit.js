define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoStorageUnit', SystemInfoProperty, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			capacity: {
				get: function() {
					return this._obj.capacity;
				}
			},
			availableCapacity: {
				get: function() {
					return this._obj.availableCapacity;
				}
			},
			isRemoveable: {
				get: function() {
					return this._obj.isRemoveable;
				}
			},
		},

	});
});