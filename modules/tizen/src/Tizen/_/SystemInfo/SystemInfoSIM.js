// Wraps Tizen interface "SystemInfoSIM" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var sim = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			state: {
				get: function() {
					return this._obj.state;
				}
			},
			operatorName: {
				get: function() {
					return this._obj.operatorName;
				}
			},
			msisdn: {
				get: function() {
					return this._obj.msisdn;
				}
			},
			iccid: {
				get: function() {
					return this._obj.iccid;
				}
			},
			mcc: {
				get: function() {
					return this._obj.mcc;
				}
			},
			mnc: {
				get: function() {
					return this._obj.mnc;
				}
			},
			msin: {
				get: function() {
					return this._obj.msin;
				}
			},
			spn: {
				get: function() {
					return this._obj.spn;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	sim.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoSIM';
	return sim;
});
