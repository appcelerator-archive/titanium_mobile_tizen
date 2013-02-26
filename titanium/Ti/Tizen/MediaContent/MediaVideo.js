define(['Ti/_/declare', 'Ti/Tizen/MediaContent/MediaItem'], function(declare, MediaItem) {
	return declare('Ti.Tizen.MediaContent.MediaVideo', MediaItem, {
		constructor: function(args) {
			if(args.toString() === '[object Video]') {
				this._obj = args;
			}
		},

		constants: {
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
			},
			album: {
				get: function() {
					return this._obj.album;
				},
				set: function(value) {
					this._obj.album = value;
				}
			},
			artists: {
				get: function() {
					return this._obj.artists;
				},
				set: function(value) {
					this._obj.artists = value;
				}
			},
			playedTime: {
				get: function() {
					return this._obj.playedTime;
				},
				set: function(value) {
					this._obj.playedTime = value;
				}
			},
			playCount: {
				get: function() {
					return this._obj.playCount;
				},
				set: function(value) {
					this._obj.playCount = value;
				}
			}
		}

	});
});