define(['Ti/_/declare', 'Ti/Blob', 'Ti/Media'],
	function(declare, Blob, Media) {
		var service = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/pick', null, 'image/*'),
			photoExt = ['jpg', 'gif', 'png', 'svg'],
			videoExt = ['mp4', 'mov', 'flv', 'wmv', 'avi', 'ogg', 'ogv'],
			imgMimeType = {
				'jpg': 'image/jpeg',
				'gif': 'image/gif',
				'png': 'image/png',
				'svg': 'image/svg+xml'
			},
			PHOTO = 1,
			VIDEO = 2,
			UNKNOWN = 3,
			virtualRoot = {
				prefix: '/opt/usr/media/',
				removablePrefix: '/opt/usr/storage/sdcard/',
				removable: 'removable1',
				tizenRoots: ['images', 'videos', 'downloads', 'documents', 'removable1'],

				// From Tizen's photo gallery we receive the fully qualified file name
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

				fileName: function(path) {
					return path.substring(path.lastIndexOf('/') + 1);
				},

				fileExt: function(path) {
					return path.substring(path.lastIndexOf('.') + 1);
				},

				getRoot: function(path) {
					var noP = this._removePrefix(path).toLowerCase(),
						d = noP.substring(0, noP.indexOf('/'));

					if (this.tizenRoots.indexOf(d) !== -1) {
						return d;
					} else {
						console.error('Can`t resolve root directory: ' + d);
					}
				},

				getFile: function(path) {
					if (this.getRoot(path)) {
						var noP = this._removePrefix(path);
						return noP.substring(noP.indexOf('/'));
					}
				},

				fileType: function(fileExt) {
					var type = UNKNOWN;
					if (photoExt.indexOf(fileExt) !== -1) {
						type = PHOTO;
					} else if (videoExt.indexOf(fileExt) !== -1) {
						type = VIDEO;
					}
					return type;
				}
			};

		return {
			open: function(args) {
				var path,
					file,
					serviceReplyCB = {
						// callee now sends a reply
						onsuccess: pickToItemCB,
						//Something went wrong
						onfailure:function() {console.error('Something went wrong')}
					};

				function readFromStream(fileStream) {
					var contents = fileStream.readBase64(fileStream.bytesAvailable),
						blob = new Blob({
							data: contents,
							length: contents.length,
							mimeType: imgMimeType[virtualRoot.fileExt(path)] || 'text/plain',
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
					args.success && args.success(event);
				};

				function resolveFileCB(dir) {
					//Resolve to file
					file = dir.resolve(virtualRoot.getFile(path));
					file.openStream(
						// open for reading
						'r',
						// success callback - read and display the contents of the file
						readFromStream,
						// error callback
						function(e) {
							console.error('Error with open stream' + e.message)
						}
					);
				};

				function pickToItemCB(data) {
					var i= 0,
						len = data.length;

					if (!data) {
						console.error('Error: ApplicationControlData is empty');
					}

					for(; i < len; i++) {
						if(data[i].key == "http://tizen.org/appcontrol/data/selected") {
							path =  data[i].value[0];
						}
					}

					if (virtualRoot.fileType(virtualRoot.fileExt(path)) === PHOTO) {
						// Resolve to directory
						tizen.filesystem.resolve(
							virtualRoot.getRoot(path),
							resolveFileCB,
							function(e) {
								console.error('Error' + e.message);
							},
							'rw'
						);

					} else if (virtualRoot.fileType(virtualRoot.fileExt(path)) === VIDEO) {
						var event = {
								cropRect: null,
								media: path, // For video files we return only 'path'
								mediaType: Media.MEDIA_TYPE_VIDEO
							}
						args.success && args.success(event);
					} else {
						console.error('This format of file is not supported');
					}
				};

				//launch default gallery application
				tizen.application.launchAppControl(service,
					null,
					function() { console.log('launch appControl succeeded'); },
					args.error ? args.error : function(e) { console.log('Something wrong with launching service - Photo Gallery. '+ e.name); },
					serviceReplyCB
				);
			}
		};
	});