define(['Ti/_/lang', 'Ti/Tizen/WebAPIError', 'Ti/Tizen/Download/DownloadRequest', 'Ti/_/Evented'], function(lang, WebAPIError, DownloadRequest, Evented) {

	function getDownloadCallback(downloadCallback) {
		return {
			onprogress: downloadCallback.onprogress && function(id, receivedSize, totalSize) {
				downloadCallback.onprogress.call(null, id, receivedSize, totalSize);
			},
			onpaused: downloadCallback.onpaused && function(id) {
				downloadCallback.onpaused.call(null, id);
			},
			oncanceled: downloadCallback.oncanceled && function(id) {
				downloadCallback.oncanceled.call(null, id);
			},
			oncompleted: downloadCallback.oncompleted && function(id, fullPath) {
				downloadCallback.oncompleted.call(null, id, fullPath);
			},
			onfailed: downloadCallback.onfailed && function(id, error) {
				downloadCallback.onfailed.call(null, id, new WebAPIError(error));
			}
		}
	}

	return lang.setObject('Ti.Tizen.Download', Evented, {

		constants: {
			DOWNLOAD_STATE_QUEUED: 'QUEUED',
			DOWNLOAD_STATE_DOWNLOADING: 'DOWNLOADING',
			DOWNLOAD_STATE_PAUSED: 'PAUSED',
			DOWNLOAD_STATE_CANCELED: 'CANCELED',
			DOWNLOAD_STATE_COMPLETED: 'COMPLETED',
			DOWNLOAD_STATE_FAILED: 'FAILED'
		},

		start: function(downloadRequest /*DownloadRequest*/, downloadCallback /*DownloadCallback*/) {
			return tizen.download.start(downloadRequest._obj, downloadCallback && getDownloadCallback(downloadCallback));
		},

		cancel: function(downloadId /*long*/) {
			return tizen.download.cancel(downloadId);
		},

		pause: function(downloadId /*long*/) {
			return tizen.download.pause(downloadId);
		},

		resume: function(downloadId /*long*/) {
			return tizen.download.resume(downloadId);
		},

		getState: function(downloadId /*long*/) {
			return tizen.download.getState(downloadId);
		},

		getDownloadRequest: function(downloadId /*long*/) {
			return this._wrap(tizen.download.getDownloadRequest(downloadId));
		},

		getMIMEType: function(downloadId /*long*/) {
			return tizen.download.getMIMEType(downloadId);
		},

		setListener: function(downloadId /*long*/, downloadCallback /*DownloadCallback*/) {
			return tizen.download.setListener(downloadId, downloadCallback && getDownloadCallback(downloadCallback));
		},

		createDownloadRequest: function(args){
			return new DownloadRequest(args);
		}
	});
});