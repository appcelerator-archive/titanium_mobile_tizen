// Wraps Tizen interface "SystemInfoStorageUnit" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var storageUnit = declare(Evented, {

		constructor: function(args) {
			// args is a native Tizen object; simply wrap it (take ownership of it)
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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	storageUnit.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoStorageUnit';
	return storageUnit;
});
