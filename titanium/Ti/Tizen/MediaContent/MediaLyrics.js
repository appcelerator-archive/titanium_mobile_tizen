define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.MediaContent.MediaLyrics', null, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			timestamps: {
				get: function() {
					return this._obj.timestamps;
				}
			},
			texts: {
				get: function() {
					return this._obj.texts;
				}
			}
		}

	});
});