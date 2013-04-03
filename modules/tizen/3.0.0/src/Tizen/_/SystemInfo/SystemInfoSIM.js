define(['Ti/_/declare', 'Tizen/_/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {

	var sim = declare(SystemInfoProperty, {

		constructor: function(args) {
			if (args.toString() === '[object SystemInfoSIM]') {
				this._obj = args;
			}
		},

		constants: {
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

	sim.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoSIM';
	return sim;
});