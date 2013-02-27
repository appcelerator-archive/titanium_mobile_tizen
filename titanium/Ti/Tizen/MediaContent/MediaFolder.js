define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.MediaContent.MediaFolder', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object Folder]') {
				this._obj = args;
			}
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			folderURI: {
				get: function() {
					return this._obj.folderURI;
				}
			},
			title: {
				get: function() {
					return this._obj.title;
				}
			},
			storageType: {
				get: function() {
					return this._obj.storageType;
				}
			},
			modifiedDate: {
				get: function() {
					return this._obj.modifiedDate;
				}
			}
		}

	});
});