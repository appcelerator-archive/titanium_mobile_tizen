define(['Ti/_/declare', 'SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {

	var cpu = declare(SystemInfoProperty, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoCpu]') {
				this._obj = args;
			}
		},

		constants: {
			load: {
				get: function() {
					return this._obj.load;
				}
			}
		}
	});

	cpu.prototype.decloaredClass = 'Tizen.SystemInfo.SystemInfoCpu';

	return cpu;
});