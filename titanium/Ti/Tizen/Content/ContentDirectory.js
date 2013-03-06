define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.Content.ContentDirectory', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object ContentDirectory]') {
				this._obj = args;
			}
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			directoryURI: {
				get: function() {
					return this._obj.directoryURI;
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