define(['Ti/_/lang', 'Download/DownloadRequest', 'Ti/_/Evented'], function(lang, DownloadRequest, Evented) {
    var Download = lang.mixProps(lang.mixProps({},Evented), {

		constants: {
			DOWNLOAD_STATE_QUEUED: 'QUEUED',
			DOWNLOAD_STATE_DOWNLOADING: 'DOWNLOADING',
			DOWNLOAD_STATE_PAUSED: 'PAUSED',
			DOWNLOAD_STATE_CANCELED: 'CANCELED',
			DOWNLOAD_STATE_COMPLETED: 'COMPLETED',
			DOWNLOAD_STATE_FAILED: 'FAILED'
		},

		getDownloadRequest: function(downloadId /*long*/) {
			return new DownloadRequest(tizen.download.getDownloadRequest(downloadId));
		},

		createDownloadRequest: function(args){
			return new DownloadRequest(args);
		}
	}, true);
	
	return Download;
});