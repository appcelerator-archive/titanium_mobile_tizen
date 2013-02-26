define(['Ti/_/declare', 'Ti/Tizen/MediaContent/MediaItem', 'Ti/Tizen/MediaContent/MediaLyrics'], function(declare, MediaItem, MediaLyrics) {
	return declare('Ti.Tizen.MediaContent.MediaAudio', MediaItem, {
		constructor: function(args) {
			if(args.toString() === '[object Audio]') {
				this._obj = args;
			}
		},

		constants: {
			lyrics: {
				get: function() {
					return new MediaLyrics(this._obj.lyrics);
				}
			},
			copyright: {
				get: function() {
					return this._obj.copyright;
				}
			},
			bitrate: {
				get: function() {
					return this._obj.bitrate;
				}
			},
			duration: {
				get: function() {
					return this._obj.duration;
				}
			}
		},

		properties: {
			album: {
				get: function() {
					return this._obj.album;
				},
				set: function(value) {
					this._obj.album = value;
				}
			},
			genres: {
				get: function() {
					return this._obj.genres;
				},
				set: function(value) {
					this._obj.genres = value;
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
			composers: {
				get: function() {
					return this._obj.composers;
				},
				set: function(value) {
					this._obj.composers = value;
				}
			},
			trackNumber: {
				get: function() {
					return this._obj.trackNumber;
				},
				set: function(value) {
					this._obj.trackNumber = value;
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