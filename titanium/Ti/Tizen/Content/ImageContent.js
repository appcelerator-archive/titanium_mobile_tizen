define(['Ti/_/declare', 'Ti/Tizen/Content/Content'], function(declare, Content) {
	return declare('Ti.Tizen.Content.ImageContent', Content, {
		constructor: function(args) {
			if(args.toString() === '[object ImageContent]') {
				this._obj = args;
			}
		},

		constants: {
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
			orientation: {
				get: function() {
					return this._obj.orientation;
				},
				set: function(value) {
					this._obj.orientation = value;
				}
			}
		}

	});
});