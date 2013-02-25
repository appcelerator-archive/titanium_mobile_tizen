define(['Ti/_/lang', 'Ti/Tizen/Filesystem/File', 'Ti/Tizen/Filesystem/FileSystemStorage', 'Ti/Tizen/WebAPIError'], function(lang, File, FileSystemStorage, WebAPIError) {
	
	function onFileSuccessCallback(object, onsuccess) { 
		onsuccess.call(self, new File(object));
	};

	function onFileSystemStorageArraySuccessCallback(storages, onsuccess) {
		var result = [],
			len = storages.length,
			i = 0;
			
		for (; i < len; i++) {
			result.push(new FileSystemStorage(storages[i]));
		}
		
		onsuccess.call(null, result);
	};
	
	function onFileSystemStorageSuccessCallback(object, onsuccess) { 
		onsuccess.call(self, new FileSystemStorage(object));
	};
	
	return lang.setObject('Ti.Tizen.Filesystem', {

		constants: {
			FILE_MODE_R: 'r',
			FILE_MODE_RW: 'rw',
			FILE_MODE_W: 'w',
			FILE_MODE_A: 'a',
			FILE_SYSTEM_STORAGE_TYPE_INTERNAL: 'INTERNAL',
			FILE_SYSTEM_STORAGE_TYPE_EXTERNAL: 'EXTERNAL',
			FILE_SYSTEM_STORAGE_STATE_MOUNTED: 'MOUNTED',
			FILE_SYSTEM_STORAGE_STATE_REMOVED: 'REMOVED',
			FILE_SYSTEM_STORAGE_STATE_UNMOUNTABLE: 'UNMOUNTABLE',
		},

		constants: {
			maxPathLength: {
				get: function() {
					return tizen.filesystem.maxPathLength;
				}
			},
		},

		resolve: function(location /*DOMString*/, onsuccess /*FileSuccessCallback*/, onerror /*ErrorCallback*/, mode /*FileMode*/) {
			return tizen.filesystem.resolve(location, function(object){onFileSuccessCallback(object, onsuccess)}, function(e) {onerror.call(null, new WebAPIError(e))}, mode);
		},

		getStorage: function(label /*DOMString*/, onsuccess /*FileSystemStorageSuccessCallback*/, onerror /*ErrorCallback*/) {
			return tizen.filesystem.getStorage(label, function(object){onFileSystemStorageSuccessCallback(object, onsuccess)}, function(e) {onerror.call(null, new WebAPIError(e))});
		},

		listStorages: function(onsuccess /*FileSystemStorageArraySuccessCallback*/, onerror /*ErrorCallback*/) {
			return tizen.filesystem.listStorages(function(storages){onFileSystemStorageArraySuccessCallback(storages, onsuccess)}, function(e) {onerror && onerror.call(null, new WebAPIError(e))});
		},

		addStorageStateChangeListener: function(onsuccess /*FileSystemStorageSuccessCallback*/, onerror /*ErrorCallback*/) {
			return tizen.filesystem.addStorageStateChangeListener(function(object){onFileSystemStorageSuccessCallback(object, onsuccess)}, function(e) {onerror.call(null, new WebAPIError(e))});
		},

		removeStorageStateChangeListener: function(watchId /*long*/) {
			return tizen.filesystem.removeStorageStateChangeListener(watchId);
		},
		
		createFile: function(args){
			return new File(args);
		}
	});
});