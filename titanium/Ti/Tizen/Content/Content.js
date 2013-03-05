define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.MediaContent.MediaItem', Evented, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			editableAttributes: {
				get: function() {
					return this._obj.editableAttributes;
				}
			},
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			type: {
				get: function() {
					return this._obj.type;
				}
			},
			mimeType: {
				get: function() {
					return this._obj.mimeType;
				}
			},
			itemURI: {
				get: function() {
					return this._obj.itemURI;
				}
			},
			thumbnailURIs: {
				get: function() {
					return this._obj.thumbnailURIs;
				}
			},
			releaseDate: {
				get: function() {
					return this._obj.releaseDate;
				}
			},
			modifiedDate: {
				get: function() {
					return this._obj.modifiedDate;
				}
			},
			size: {
				get: function() {
					return this._obj.size;
				}
			}
		},

		properties: {
			title: {
				get: function() {
					return this._obj.title;
				},
				set: function(value) {
					this._obj.title = value;
				}
			},
			description: {
				get: function() {
					return this._obj.description;
				},
				set: function(value) {
					this._obj.description = value;
				}
			},
			rating: {
				get: function() {
					return this._obj.rating;
				},
				set: function(value) {
					this._obj.rating = value;
				}
			}
		}

	});
});