define(['Ti/_/declare', 'Ti/Tizen/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoStorageUnit', SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoStorageUnit]') {
				this._obj = args;
			} else {
			}
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