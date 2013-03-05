define(['Ti/_/lang', 'Ti/Tizen/Content/AudioContent', 'Ti/Tizen/Content/VideoContent', 'Ti/Tizen/Content/ImageContent', 'Ti/Tizen/Content/ContentDirectory', 'Ti/_/Evented'],
	function(lang, AudioContent, VideoContent, ImageContent, ContentDirectory, Evented) {
		function onContentArraySuccessCallback (objects, onsuccess) {
			var result = [],
				len = objects.length,
				i = 0;
			for (; i < len; i++) {
				if(objects[i].type == 'AUDIO'){
					result.push(Ti.Tizen.Content._createAudioContent(objects[i]));
				} else if(objects[i].type == 'VIDEO'){
					result.push(Ti.Tizen.Content._createVideoContent(objects[i]));
				} else if(objects[i].type == 'IMAGE'){
					result.push(Ti.Tizen.Content._createImageContent(objects[i]));
				}
			}

			onsuccess.call(null, result);
		}

		function onContentDirectoryArraySuccessCallback(objects, onsuccess){
			var result = [],
				len = objects.length,
				i = 0;

			for (; i < len; i++) {
				result.push(Ti.Tizen.Content._createContentDirectory(objects[i]));
			}

			onsuccess.call(null, result);
		}

		return lang.setObject('Ti.Tizen.Content', Evented, {

			constants: {
				CONTENT_DIRECTORY_STORAGE_TYPE_INTERNAL: 'INTERNAL',
				CONTENT_DIRECTORY_STORAGE_TYPE_EXTERNAL: 'EXTERNAL',
				CONTENT_TYPE_IMAGE: 'IMAGE',
				CONTENT_TYPE_VIDEO: 'VIDEO',
				CONTENT_TYPE_AUDIO: 'AUDIO',
				AUDIO_CONTENT_LYRICS_TYPE_SYNCHRONIZED: 'SYNCHRONIZED',
				AUDIO_CONTENT_LYRICS_TYPE_UNSYNCHRONIZED: 'UNSYNCHRONIZED',
				IMAGE_CONTENT_ORIENTATION_NORMAL: 'NORMAL',
				IMAGE_CONTENT_ORIENTATION_FLIP_HORIZONTAL: 'FLIP_HORIZONTAL',
				IMAGE_CONTENT_ORIENTATION_ROTATE_180: 'ROTATE_180',
				IMAGE_CONTENT_ORIENTATION_FLIP_VERTICAL: 'FLIP_VERTICAL',
				IMAGE_CONTENT_ORIENTATION_TRANSPOSE: 'TRANSPOSE',
				IMAGE_CONTENT_ORIENTATION_ROTATE_90: 'ROTATE_90',
				IMAGE_CONTENT_ORIENTATION_TRANSVERSE: 'TRANSVERSE',
				IMAGE_CONTENT_ORIENTATION_ROTATE_270: 'ROTATE_270'
			},

			update: function(content /*Content*/) {
				return tizen.content.update(content._obj);
			},

			updateBatch: function(contents /*Content*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
				var res = [];
				for(var i= 0, len = contents.length; i<len; i++) {
					res.push(contents[i]._obj);
				}
				return tizen.content.updateBatch(res, successCallback, errorCallback);
			},

			getDirectories: function(successCallback /*ContentDirectoryArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
				return tizen.content.getDirectories(successCallback && function(folders){onContentDirectoryArraySuccessCallback(folders, successCallback)}, errorCallback && function(e) {errorCallback.call(null, new WebAPIError(e))});
			},

			find: function(successCallback /*ContentArraySuccessCallback*/, errorCallback /*ErrorCallback*/, directoryId /*ContentDirectoryId*/, filter /*AbstractFilter*/, sortMode /*SortMode*/, count /*unsigned long*/, offset /*unsigned long*/) {
				return tizen.content.find(successCallback && function(objects){onContentArraySuccessCallback(objects, successCallback)}, errorCallback && function(e) {errorCallback.call(null, new WebAPIError(e))}, directoryId, filter ? filter._obj : filter, sortMode ? sortMode._obj : sortMode, count, offset);
			},

			_createContentDirectory: function(args){
				return new ContentDirectory(args);
			},

			_createAudioContent: function(args){
				return new AudioContent(args);
			},

			_createVideoContent: function(args){
				return new VideoContent(args);
			},

			_createImageContent: function(args){
				return new ImageContent(args);
			}
		});
});