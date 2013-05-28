define(function() {
	
	var photoExt = ['jpg', 'gif', 'png', 'svg'],
		videoExt = ['mp4', 'mov', 'flv', 'wmv', 'avi', 'ogg', 'ogv'],
		imgMimeType = {
			'jpg': 'image/jpeg',
			'gif': 'image/gif',
			'png': 'image/png',
			'svg': 'image/svg+xml'
		};

	function _getValueByKey(arr, key) {
		var i = 0,
			len = arr.length,
			path;

		for (; i < len; i++) {
			if (arr[i].key == key) {
				path = arr[i].value[0];
			}
		}

		if(!path) {
			console.error('Can\'t find path to selected item');
		} else {
			return path;
		}
	}

	function _getFileExt(path) {
		return path.substring(path.lastIndexOf('.') + 1);
	}


	var virtualRootResolver = {
		PHOTO: 1,
		VIDEO: 2,
		UNKNOWN: 3,
		prefix: '/opt/usr/media/',
		removablePrefix: '/opt/usr/storage/sdcard/',
		removable: 'removable1',
		selectedKey: 'http://tizen.org/appcontrol/data/selected',
		tizenRoots: ['images', 'videos', 'downloads', 'documents', 'removable1', 'camera'],

		// From Tizen's photo gallery or camera we receive the fully qualified file name
		// (for example, /opt/usr/media/image.jpg). We will need to open the file
		// using tizen's Filesystem and read it. However, tizen.Filesystem will
		// not accept the fully qualified file name - it only works with
		// "virtual roots". There is no OS facility to "reverse resolve" from
		// a OS path to a "virtual root".
		//
		// Our method to get a virtual root from a fully qualified file name is
		// to simply remove the '/opt/usr/media/' part from the file name.

		removePrefix: function(path) {
			var nP;
			if (path.indexOf(this.prefix) === 0) {
				nP = path.replace(this.prefix, '');
			} else {
				nP = this.removable + '/' + path.replace(this.removablePrefix, '');
			}
			return nP;
		},

		//String - Tizen's virtual root ('images', 'videos' ....)
		getRoot: function(path) {
			var noP = this.removePrefix(path).toLowerCase(),
				d = noP.substring(0, noP.indexOf('/'));

			if (this.tizenRoots.indexOf(d) !== -1) {
				return d;
			} else {
				console.error('Can`t resolve root directory: ' + d);
			}
		},

		getFilePathInVR: function(path) {
			if (this.getRoot(path)) {
				var noP = this.removePrefix(path);
				return noP.substring(noP.indexOf('/'));
			}
		},

		fileType: function(fileExt) {
			var type = this.UNKNOWN;
			if (photoExt.indexOf(fileExt) !== -1) {
				type = this.PHOTO;
			} else if (videoExt.indexOf(fileExt) !== -1) {
				type = this.VIDEO;
			}
			return type;
		}
	}


	return {

		// Handles Tizen OS callback for item selection, translates the native path of the selected item to
		// a virtual root-based path, reads the file, and calls Titanium callbacks with the Blob (or an error).
		//
		// arguments:
		// data - Key-value pairs, sent from Tizen OS after selecting a media item,
		//        providing additional information for the control request.
		// args - (optional) Simple object for specifying options from user. The following properties are used here:
		//        success and error
		selectedItemCB: function(data, args) {      // error, success,

			if (!data) {
				console.error('Error: ApplicationControlData is empty');
			}

			var path = _getValueByKey(data, virtualRootResolver.selectedKey),
				Media = require('Ti/Media'),
				ext = _getFileExt(path),
				fileType = virtualRootResolver.fileType(ext);

			function readFromStream(fileStream) {
				var contents = fileStream.readBase64(fileStream.bytesAvailable),
					blob = new (require('Ti/Blob'))({
						data: contents,
						length: contents.length,
						mimeType: imgMimeType[ext] || 'text/plain',
						// we cannot return a Titanium.Filesystem.File here, because the file is not in the HTML5
						// local storage and therefore not accessible to Titanium Filesystem
						file: null,
						nativePath: path || null
					}),
					event = {
						cropRect: null,
						media: blob,
						mediaType: Media.MEDIA_TYPE_PHOTO
					};
				fileStream.close();
				args && args.success && args.success(event);
			}

			function resolveFileCB(dir) {
				//Resolve to file
				var file = dir.resolve(virtualRootResolver.getFilePathInVR(path));
				file.openStream(
					// open for reading
					'r',
					// success callback - read the contents of the file
					readFromStream,
					// error callback
					function(e) {
						args && args.error && args.error({
							code: -1,
							error: e.message,
							success: false
						});
						console.error('Error with open stream' + e.message);
					}
				);
			}

			if (fileType === virtualRootResolver.PHOTO) {
				// Resolve to directory
				tizen.filesystem.resolve(
					virtualRootResolver.getRoot(path),
					resolveFileCB,
					function(e) {
						args && args.error && args.error({
							code: -1,
							error: e.message,
							success: false
						});
					}, 'rw');

			} else if (fileType === virtualRootResolver.VIDEO) {
				var event = {
					cropRect: null,
					media: path, // For video files we return only 'path'
					mediaType: Media.MEDIA_TYPE_VIDEO
				}
				args && args.success && args.success(event);
			} else {
				args && args.error && args.error({
					code: -1,
					error: 'This format ' + ext + ' of file is not supported',
					success: false
				});
				console.error('This format ' + ext + ' of file is not supported');
			}
		}
	};
});