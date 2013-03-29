define(['Ti/_/declare', '_/SystemInfo/SystemInfoProperty'], function(declare, SystemInfoProperty) {

	var cpu = declare(SystemInfoProperty, {

		constructor: function(args) {
			if (args.toString() === '[object SystemInfoCpu]') {
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

	cpu.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoCpu';
	return cpu;
});