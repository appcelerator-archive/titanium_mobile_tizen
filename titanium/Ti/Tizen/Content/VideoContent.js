define(['Ti/_/declare', 'Ti/Tizen/Content/Content'], function(declare, Content) {
	return declare('Ti.Tizen.Content.VideoContent', Content, {
		constructor: function(args) {
			if(args.toString() === '[object VideoContent]') {
				this._obj = args;
			}
		},

		constants: {
			album: {
				get: function() {
					return this._obj.album;
				}
			},
			artists: {
				get: function() {
					return this._obj.artists;
				}
			},
			duration: {
				get: function() {
					return this._obj.duration;
				}
			},
			width: {
				get: function() {
					return this._obj.width;
				}
			},
			height: {
				get: function() {
					return this._obj.height;
				}
			}
		},

		properties: {
			geolocation: {
				get: function() {
					return this._obj.geolocation;
				},
				set: function(value) {
					this._obj.geolocation = value;
				}
			}
		}

	});
});