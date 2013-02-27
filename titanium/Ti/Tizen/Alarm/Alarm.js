define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented){
	return declare('Ti.Tizen.Alarm.Alarm', Evented, {
		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			}
		}

	});
});