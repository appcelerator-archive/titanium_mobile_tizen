define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.Download.URLDownload', null, {
		constructor: function(args) {
			if(args.toString() === '[object URLDownload]') {
				this._obj = args;
			} else {
				this._obj = new tizen.URLDownload(args.url, args.destination, args.fileName);
			}
		},

		properties: {
			url: {
				get: function() {
					return this._obj.url;
				},
				set: function(value) {
					this._obj.url = value;
				}
			},
			destination: {
				get: function() {
					return this._obj.destination;
				},
				set: function(value) {
					this._obj.destination = value;
				}
			},
			fileName: {
				get: function() {
					return this._obj.fileName;
				},
				set: function(value) {
					this._obj.fileName = value;
				}
			},
		},

	});
});