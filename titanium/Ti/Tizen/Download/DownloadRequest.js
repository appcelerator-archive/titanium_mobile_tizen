define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Ti.Tizen.Download.DownloadRequest', Evented, {
		constructor: function(args) {
			console.log('[object DownloadRequest]=='+args.toString());
			if(args.toString() === '[object DownloadRequest]') {
				this._obj = args;
			} else {
				this._obj = new tizen.DownloadRequest(args.url, args.destination, args.fileName);
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
			}
		}

	});
});