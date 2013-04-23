// Wraps Tizen module "Download".

define(['Ti/_/lang', 'Tizen/_/Download/DownloadRequest', 'Ti/_/Evented'], function(lang, DownloadRequest, Evented) {

	return lang.mixProps(require.mix({}, Evented), {

		getDownloadRequest: function(downloadId /*long*/) {
			return new DownloadRequest(void 0, tizen.download.getDownloadRequest(downloadId));
		},

		createDownloadRequest: function(args) {
			return new DownloadRequest(args);
		},

		constants: {
			DOWNLOAD_STATE_QUEUED: 'QUEUED',
			DOWNLOAD_STATE_DOWNLOADING: 'DOWNLOADING',
			DOWNLOAD_STATE_PAUSED: 'PAUSED',
			DOWNLOAD_STATE_CANCELED: 'CANCELED',
			DOWNLOAD_STATE_COMPLETED: 'COMPLETED',
			DOWNLOAD_STATE_FAILED: 'FAILED'
		}

	}, true);
});