define(['Ti/_/declare', 'Tizen/_/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {

	var storageUnit = declare(SystemInfoProperty, {

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
			}
		}
	});

	storageUnit.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoStorageUnit';
	return storageUnit;
});