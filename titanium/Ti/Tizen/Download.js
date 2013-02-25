define(['Ti/_/lang'], function(lang) {
	return lang.setObject('Ti.Tizen.Download', {

		constants: {
			DOWNLOAD_STATE_QUEUED: 'QUEUED',
			DOWNLOAD_STATE_DOWNLOADING: 'DOWNLOADING',
			DOWNLOAD_STATE_PAUSED: 'PAUSED',
			DOWNLOAD_STATE_ABORTED: 'ABORTED',
			DOWNLOAD_STATE_COMPLETED: 'COMPLETED',
			DOWNLOAD_STATE_FAILED: 'FAILED',
		},

		start: function(downloadObject /*URLDownload*/, downloadCallback /*DownloadCallback*/) {
			return tizen.download.start(downloadObject._obj, downloadCallback);
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
			return new (require('Ti/Tizen/Download/URLDownload'))(args);
		},
	});
});