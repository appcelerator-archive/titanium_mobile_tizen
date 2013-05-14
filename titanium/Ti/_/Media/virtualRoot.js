define(function() {

	var photoExt = ['jpg', 'gif', 'png', 'svg'],
		videoExt = ['mp4', 'mov', 'flv', 'wmv', 'avi', 'ogg', 'ogv'],
		imgMimeType = {
			'jpg': 'image/jpeg',
			'gif': 'image/gif',
			'png': 'image/png',
			'svg': 'image/svg+xml'
		};

	return {
		PHOTO: 1,
		VIDEO: 2,
		UNKNOWN: 3,
		prefix: '/opt/usr/media/',
		removablePrefix: '/opt/usr/storage/sdcard/',
		removable: 'removable1',
		selectedKey: 'http://tizen.org/appcontrol/data/selected',
		tizenRoots: ['images', 'videos', 'downloads', 'documents', 'removable1'],

		// From Tizen's photo gallery or camera we receive the fully qualified file name
		// (for example, /opt/usr/media/image.jpg). We will need to open the file
		// using tizen's Filesystem and read it. However, tizen.Filesystem will
		// not accept the fully qualified file name - it only works with
		// "virtual roots". There is no OS facility to "reverse resolve" from
		// a OS path to a "virtual root".
		//
		// Our method to get a virtual root from a fully qualified file name is
		// to simply remove the '/opt/usr/media/' part from the file name.

		_removePrefix: function(path) {
			var nP;
			if (path.indexOf(this.prefix) === 0) {
				nP = path.replace(this.prefix, '');
			} else {
				nP = this.removable + '/' + path.replace(this.removablePrefix, '');
			}
			return nP;
		},

		_fileName: function(path) {
			return path.substring(path.lastIndexOf('/') + 1);
		},

		_fileExt: function(path) {
			return path.substring(path.lastIndexOf('.') + 1);
		},

		_getRoot: function(path) {
			var noP = this._removePrefix(path).toLowerCase(), d = noP.substring(0, noP.indexOf('/'));

			if (this.tizenRoots.indexOf(d) !== -1) {
				return d;
			} else {
				console.error('Can`t resolve root directory: ' + d);
			}
		},

		_getFile: function(path) {
			if (this._getRoot(path)) {
				var noP = this._removePrefix(path);
				return noP.substring(noP.indexOf('/'));
			}
		},

		_fileType: function(_fileExt) {
			var type = this.UNKNOWN;
			if (photoExt.indexOf(_fileExt) !== -1) {
				type = this.PHOTO;
			} else if (videoExt.indexOf(_fileExt) !== -1) {
				type = this.VIDEO;
			}
			return type;
		},

		//arguments:
		// data - Key-value pairs providing additional information for the control request.
		// args - (optional) Simple object for specifying options from user. The following properties are used here:
		//        success and error

		pickToItemCB: function(data, args) {

			if (!data) {
				console.error('Error: ApplicationControlData is empty');
			}

			var self = this,
				i = 0,
				len = data.length,
				file,
				path,
				Media = require('Ti/Media');

			for (; i < len; i++) {
				if (data[i].key == this.selectedKey) {
					path = data[i].value[0];
				}
			}

			function readFromStream(fileStream) {
				var contents = fileStream.readBase64(fileStream.bytesAvailable),
					blob = new (require('Ti/Blob'))({
						data: contents,
						length: contents.length,
						mimeType: imgMimeType[self._fileExt(path)] || 'text/plain',
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
			};

			function resolveFileCB(dir) {
				//Resolve to file
				file = dir.resolve(self._getFile(path));
				file.openStream(
					// open for reading
					'r',
					// success callback - read the contents of the file
					readFromStream,
					// error callback
					function(e) {
						console.error('Error with open stream' + e.message)
					}
				);
			};

			if (this._fileType(this._fileExt(path)) === this.PHOTO) {
				// Resolve to directory
				tizen.filesystem.resolve(
					self._getRoot(path),
					resolveFileCB,
					function(e) {
						console.error('Error: ' + e.message);
					}, 'rw');

			} else if (this._fileType(this._fileExt(path)) === this.VIDEO) {
				var event = {
					cropRect: null,
					media: path, // For video files we return only 'path'
					mediaType: Media.MEDIA_TYPE_VIDEO
				}
				args && args.success && args.success(event);
			} else {
				console.error('This format of file is not supported');
			}
		}
	};
});