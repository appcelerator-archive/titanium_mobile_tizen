define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.Alarm.Alarm', null, {
		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
		},

	});
});