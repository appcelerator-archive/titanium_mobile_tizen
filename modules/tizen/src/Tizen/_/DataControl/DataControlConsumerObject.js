define(['Ti/_/declare'], function(declare) {
	var obj = declare(null, {

		constructor: function(args, nativeObj) {
			if(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			}
		},

		constants: {
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			providerId: {
				get: function() {
					return this._obj.providerId;
				}
			},
			dataId: {
				get: function() {
					return this._obj.dataId;
				}
			},
		},

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataControl.DataControlConsumerObject';
	return obj;
});