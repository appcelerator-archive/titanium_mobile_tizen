define(['Ti/_/declare', 'Ti/Tizen/WebAPIError'], function(declare, WebAPIError) {

	function onMediaFolderArraySuccessCallback(objects, onsuccess){
		var result = [],
			len = objects.length,
			i = 0;

		for (; i < len; i++) {
			result.push(Ti.Tizen.MediaContent._createMediaFolder(objects[i]));
		}

		onsuccess.call(null, result);
	}

	function onMediaItemArraySuccessCallback (objects, onsuccess) {
		var result = [],
			len = objects.length,
			i = 0;

		for (; i < len; i++) {
			if(objects[i].type == 'AUDIO'){
				result.push(Ti.Tizen.MediaContent._createMediaAudio(objects[i]));
			} else if(objects[i].type == 'VIDEO'){
				result.push(Ti.Tizen.MediaContent._createMediaVideo(objects[i]));
			} else if(objects[i].type == 'IMAGE'){
				result.push(Ti.Tizen.MediaContent._createMediaImage(objects[i]));
			}
		}

		onsuccess.call(null, result);
	}

	return declare('Ti.Tizen.MediaContent.MediaSource', null, {

		constructor: function(args) {
			if(args.toString() === '[object MediaSource]') {
				this._obj = args;
			}
		},

		updateItem: function(item /*MediaItem*/) {
			return this._obj.updateItem(item._obj);
		},

		updateItemsBatch: function(items /*MediaItem*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var res = [];
			for(var i= 0, len = items.length; i<len; i++) {
				res.push(items[i]._obj);
			}
			return this._obj.updateItemsBatch(res, successCallback, errorCallback && function(e) {errorCallback.call(null, new WebAPIError(e))});
		},

		getFolders: function(successCallback /*MediaFolderArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.getFolders(successCallback && function(folders){onMediaFolderArraySuccessCallback(folders, successCallback)}, errorCallback && function(e) {errorCallback.call(null, new WebAPIError(e))});
		},

		findItems: function(successCallback /*MediaItemArraySuccessCallback*/, errorCallback /*ErrorCallback*/, folderId /*MediaFolderId*/, filter /*AbstractFilter*/, sortMode /*SortMode*/, count /*unsigned long*/, offset /*unsigned long*/) {
			return this._obj.findItems(successCallback && function(folders){onMediaItemArraySuccessCallback(folders, successCallback)}, errorCallback && function(e) {errorCallback.call(null, new WebAPIError(e))}, folderId, filter ? filter._obj : filter, sortMode ? sortMode._obj : sortMode, count, offset);
		}
	});
});