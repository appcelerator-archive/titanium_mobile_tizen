define(['Ti/_/declare', 'WebAPIError', 'Ti/_/Evented'], function(declare, WebAPIError, Evented) {
	var downloadRequest = declare(Evented, {
		constructor: function(args) {
			if (args.toString() === '[object DownloadRequest]') {
				this._obj = args;
			} else {
				if (args.hasOwnProperty('url')) {
					this._obj = new tizen.DownloadRequest(args.url, args.destination, args.fileName);	
				} else {
					Ti.API.error('Constructor with such parameters does not exist in DownloadRequest.');
				}
			}
		},

		_getDownloadCallback: function(downloadCallback) {
			var self = this;

			return {
				onprogress: function(id, receivedSize, totalSize) {
					downloadCallback.onDataStream(self, receivedSize, totalSize);
				},
				onpaused: function(id) {
					downloadCallback.onPause(self);
				},
				oncanceled: function(id) {
					downloadCallback.onCancel(self);
				},
				oncompleted: function(id, fullPath) {
					downloadCallback.onLoad(self, fullPath);
				},
				onfailed: function(id, error) {
					downloadCallback.onError(self, new WebAPIError(error));
				}
			}
		},

		send: function(downloadCallback /*DownloadCallback*/) {
			return this.constants.__values__.id = tizen.download.start(this._obj, downloadCallback && this._getDownloadCallback(downloadCallback));
		},

		setListener: function(downloadCallback /*DownloadCallback*/) {
			tizen.download.setListener(this.id, this._getDownloadCallback(downloadCallback));
		},

		abort: function() {
			tizen.download.cancel(this.id);
		},

		pause: function() {
			tizen.download.pause(this.id);
		},

		resume: function() {
			tizen.download.resume(this.id);
		},

		constants: {
			id: {}
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
			state: {
				get: function() {
					return tizen.download.getState(this.id);
				}
			},
			MIMEType: {
				get: function() {
					return tizen.download.getMIMEType(this.id);
				}
			}
		}
	});

	downloadRequest.prototype.declaredClass = 'Tizen.Download.DownloadRequest';

	return downloadRequest;
});