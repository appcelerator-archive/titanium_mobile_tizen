define(['Ti/_/lang', 'Ti/Tizen/WebAPIError', 'Ti/Tizen/Download/URLDownload', 'Ti/_/Evented'], function(lang, WebAPIError, URLDownload, Evented) {
	return lang.setObject('Ti.Tizen.Download', Evented, {

		constants: {
			DOWNLOAD_STATE_QUEUED: 'QUEUED',
			DOWNLOAD_STATE_DOWNLOADING: 'DOWNLOADING',
			DOWNLOAD_STATE_PAUSED: 'PAUSED',
			DOWNLOAD_STATE_ABORTED: 'ABORTED',
			DOWNLOAD_STATE_COMPLETED: 'COMPLETED',
			DOWNLOAD_STATE_FAILED: 'FAILED',
		},

		start: function(downloadObject /*URLDownload*/, downloadCallback /*DownloadCallback*/) {
			return tizen.download.start(downloadObject._obj, downloadCallback && {
				onprogress: downloadCallback.onprogress && function(id, receivedSize, totalSize) {
					downloadCallback.onprogress.call(null, id, receivedSize, totalSize);
				},
				onpaused: downloadCallback.onpaused && function(id) {
					downloadCallback.onpaused.call(null, id);
				},
				onaborted: downloadCallback.onaborted && function(id) {
					downloadCallback.onaborted.call(null, id);
				},
				oncompleted: downloadCallback.oncompleted && function(id, fileName) {
					downloadCallback.oncompleted.call(null, id, fileName);
				},
				onfailed: downloadCallback.onfailed && function(id, error) {
					downloadCallback.onfailed.call(null, id, new WebAPIError(error));
				}
			});
		},

		abort: function(downloadId /*long*/) {
			return tizen.download.abort(downloadId);
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

		createURLDownload: function(args){
			return new URLDownload(args);
		},
	});
});