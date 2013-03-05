define(['Ti/_/declare', 'Ti/Tizen/Content/Content', 'Ti/Tizen/Content/AudioContentLyrics'], function(declare, Content, AudioContentLyrics) {
	return declare('Ti.Tizen.Content.AudioContent', Content, {
		constructor: function(args) {
			if(args.toString() === '[object AudioContent]') {
				this._obj = args;
			}
		},

		constants: {
			album: {
				get: function() {
					return this._obj.album;
				}
			},
			genres: {
				get: function() {
					return this._obj.genres;
				}
			},
			artists: {
				get: function() {
					return this._obj.artists;
				}
			},
			composers: {
				get: function() {
					return this._obj.composers;
				}
			},
			lyrics: {
				get: function() {
					return new AudioContentLyrics(this._obj.lyrics);
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
			trackNumber: {
				get: function() {
					return this._obj.trackNumber;
				}
			},
			duration: {
				get: function() {
					return this._obj.duration;
				}
			}
		}

	});
});