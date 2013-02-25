define(['Ti/_/declare', 'Ti/Tizen/Filesystem/FileStream', 'Ti/Tizen/WebAPIError'], function(declare, FileStream, WebAPIError) {
	
	function onFileStreamSuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new FileStream(object));
	};
	
	function onFileArraySuccessCallback(objects, onsuccess) {
		var result = [],
			len = objects.length,
			i = 0;
		
		for (; i < len; i++) {
			result.push(Ti.Tizen.Filesystem.createFile(objects[i]));
		}
		
		onsuccess.call(null, result);
	};

	return declare('Ti.Tizen.Filesystem.File', null, {
		constructor: function(args) {
			if(args.toString() === '[object File]') {
				this._obj = args;
			} 
		}, 
		
		constants: {
			parent: {
				get: function() {
					return this._obj.parent;
				}
			},
			readOnly: {
				get: function() {
					return this._obj.readOnly;
				}
			},
			isFile: {
				get: function() {
					return this._obj.isFile;
				}
			},
			isDirectory: {
				get: function() {
					return this._obj.isDirectory;
				}
			},
			created: {
				get: function() {
					return this._obj.created;
				}
			},
			modified: {
				get: function() {
					return this._obj.modified;
				}
			},
			path: {
				get: function() {
					return this._obj.path;
				}
			},
			name: {
				get: function() {
					return this._obj.name;
				}
			},
			fullPath: {
				get: function() {
					return this._obj.fullPath;
				}
			},
			fileSize: {
				get: function() {
					return this._obj.fileSize;
				}
			},
			length: {
				get: function() {
					return this._obj.length;
				}
			},
		},

		toURI: function() {
			return this._obj.toURI();
		},

		listFiles: function(onsuccess /*FileArraySuccessCallback*/, onerror /*ErrorCallback*/, filter /*FileFilter*/) {
			return this._obj.listFiles(function(objects){onFileArraySuccessCallback(objects, onsuccess)}, function(e) {onerror.call(null, new WebAPIError(e))}, filter);
		},

		openStream: function(mode /*FileMode*/, onsuccess /*FileStreamSuccessCallback*/, onerror /*ErrorCallback*/, encoding /*DOMString*/) {
			return this._obj.openStream(mode, function(object){onFileStreamSuccessCallback(object, onsuccess)}, function(e) {onerror.call(null, new WebAPIError(e))}, encoding);
		},

		readAsText: function(onsuccess /*FileStringSuccessCallback*/, onerror /*ErrorCallback*/, encoding /*DOMString*/) {
			return this._obj.readAsText(onsuccess, function(e) {onerror.call(null, new WebAPIError(e))}, encoding);
		},

		copyTo: function(originFilePath /*DOMString*/, destinationFilePath /*DOMString*/, overwrite /*boolean*/, onsuccess /*SuccessCallback*/, onerror /*ErrorCallback*/) {
			return this._obj.copyTo(originFilePath, destinationFilePath, overwrite, onsuccess, function(e) {onerror.call(null, new WebAPIError(e))});
		},

		moveTo: function(originFilePath /*DOMString*/, destinationFilePath /*DOMString*/, overwrite /*boolean*/, onsuccess /*SuccessCallback*/, onerror /*ErrorCallback*/) {
			return this._obj.moveTo(originFilePath, destinationFilePath, overwrite, onsuccess, function(e) {onerror.call(null, new WebAPIError(e))});
		},

		createDirectory: function(dirPath /*DOMString*/) {
			return Ti.Tizen.Filesystem.createFile(this._obj.createDirectory(dirPath));
		},

		createFile: function(filePath /*DOMString*/) {
			return Ti.Tizen.Filesystem.createFile(this._obj.createFile(filePath));
		},

		resolve: function(filePath /*DOMString*/) {
			return Ti.Tizen.Filesystem.createFile(this._obj.resolve(filePath));
		},

		deleteDirectory: function(directory /*DOMString*/, recursive /*boolean*/, onsuccess /*SuccessCallback*/, onerror /*ErrorCallback*/) {
			return this._obj.deleteDirectory(directory, recursive, onsuccess, function(e) {onerror.call(null, new WebAPIError(e))});
		},

		deleteFile: function(file /*DOMString*/, onsuccess /*SuccessCallback*/, onerror /*ErrorCallback*/) {
			return this._obj.deleteFile(file, onsuccess, function(e) {onerror.call(null, new WebAPIError(e))});
		}
	});
});