define(['Ti/_/lang', 'Ti/Tizen/MediaContent/MediaSource', 'Ti/Tizen/MediaContent/MediaFolder', 'Ti/Tizen/MediaContent/MediaItem'], function(lang, MediaSource, MediaFolder, MediaItem) {
	return lang.setObject('Ti.Tizen.MediaContent', {

		constants: {
			MEDIA_FOLDER_STORAGE_TYPE_INTERNAL: 'INTERNAL',
			MEDIA_FOLDER_STORAGE_TYPE_EXTERNAL: 'EXTERNAL',
			MEDIA_FOLDER_STORAGE_TYPE_UNKNOWN: 'UNKNOWN',
			MEDIA_ITEM_TYPE_IMAGE: 'IMAGE',
			MEDIA_ITEM_TYPE_VIDEO: 'VIDEO',
			MEDIA_ITEM_TYPE_AUDIO: 'AUDIO',
			MEDIA_ITEM_TYPE_UNKNOWN: 'UNKNOWN',
			MEDIA_LYRICS_TYPE_SYNCHRONIZED: 'SYNCHRONIZED',
			MEDIA_LYRICS_TYPE_UNSYNCHRONIZED: 'UNSYNCHRONIZED',
			MEDIA_IMAGE_ORIENTATION_NORMAL: 'NORMAL',
			MEDIA_IMAGE_ORIENTATION_FLIP_HORIZONTAL: 'FLIP_HORIZONTAL',
			MEDIA_IMAGE_ORIENTATION_ROTATE_180: 'ROTATE_180',
			MEDIA_IMAGE_ORIENTATION_FLIP_VERTICAL: 'FLIP_VERTICAL',
			MEDIA_IMAGE_ORIENTATION_TRANSPOSE: 'TRANSPOSE',
			MEDIA_IMAGE_ORIENTATION_ROTATE_90: 'ROTATE_90',
			MEDIA_IMAGE_ORIENTATION_TRANSVERSE: 'TRANSVERSE',
			MEDIA_IMAGE_ORIENTATION_ROTATE_270: 'ROTATE_270',
		},

		_wrap: function(object) {
			var result;
			if (object.toString() === '[object MediaSource]') {
				result = this._createMediaSource(object);
			}
			return result;
		},

		getLocalMediaSource: function() {
			return this._wrap(tizen.mediacontent.getLocalMediaSource());
		},

		_createMediaSource: function(args){
			return new MediaSource(args);
		},

		_createMediaFolder: function(args){
			return new MediaFolder(args);
		},

		_createMediaItem: function(args){
			return new MediaItem(args);
		}

	});
});