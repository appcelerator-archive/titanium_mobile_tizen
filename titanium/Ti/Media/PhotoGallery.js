define(["Ti/_/declare", "Ti/Blob"],
	function(declare, Blob) {
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
			UKNOWN = 3,
			args,
			virtualRoot = {
				prefix: '/opt/media/',
				removablePrefix: '/opt/storage/sdcard/', 
				removable: 'removable1',
				tizenRoots: ['images', 'videos', 'downloads', 'documents', 'removable1'],
				_removePrefix: function(path) {
					var nP;
					if(path.indexOf(this.prefix) == 0){
						nP = path.replace(this.prefix, '');		
					} else {
						nP = this.removable + '/' + path.replace(this.removablePrefix, '');
					}
					return nP;
				},
				fileName: function(path) {
					return path.substring(path.lastIndexOf('/')+1);
				},
				fileExt: function(path) {
					return path.substring(path.lastIndexOf('.')+1);
				},
				getRoot: function(path){
					var noP = this._removePrefix(path).toLowerCase(); 
					var d = noP.substring(0, noP.indexOf('/'));
					if(this.tizenRoots.indexOf(d) != -1) {
						return d;
					} else {
						console.log('Can not connect to directory - ' + d);
					}
				},
				getFile: function(path) {
					if(this.getRoot(path)) {
						var noP = this._removePrefix(path);
						return noP.substring(noP.indexOf('/'));
					}
				},
				fileType: function(fileExt) {
					var i;
					if(photoExt.indexOf(fileExt) !== -1) {
						i = PHOTO;
					} else if(videoExt.indexOf(fileExt) !== -1) {
						i = VIDEO;
					} else {
						i = UKNOWN;
					};
					return i; 			
				}
			};
		return {
			open: function(args) {
				var path,
					file,
					serviceReplyCB = {
						// callee now sends a reply
						onsuccess: pickToItemCB,
						// Something went wrong 
						onfailure: args.error ? args.error : function(){Titanium.API.error('Something wrong with launching service - Photo Gallery')} 
					};
					
				function readFromStream(fileStream) {
					var contents = fileStream.readBase64(fileStream.bytesAvailable),
                    	blob = new Blob({
							data: contents,
							length: contents.length,
							mimeType: imgMimeType[virtualRoot.fileExt(path)] || 'text/plain',
							file: file || null,
							nativePath: path || null
						}),					
						event = {
							cropRect: null,
							media: blob,
							mediaType: Ti.Media.MEDIA_TYPE_PHOTO
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
							Titanium.API.error('Error with open stream' + e.message)
							}
						);	
				};
				function pickToItemCB(reply) {   // reply -> ApplicationControlData[0]
					path = reply[0].value.toString();
                    
					//Check if this file is image - return blob
					if	(virtualRoot.fileType(virtualRoot.fileExt(path)) == PHOTO) {
						//Resolve to directory
						tizen.filesystem.resolve(
							virtualRoot.getRoot(path), 
							resolveFileCB, 
							function(e) {
								Titanium.API.error('Error' + e.message);
							}, 
							'rw');
					//Check if this file is video - return path(string)		
					} else if	(virtualRoot.fileType(virtualRoot.fileExt(path)) == VIDEO) {
						var event = {
								cropRect: null,
								media: path,
								mediaType: Ti.Media.MEDIA_TYPE_VIDEO
							}		
						args.success && args.success(event);
					} else {
						Titanium.API.error('This format of file does not supported');
					}	
				};
				//START
                tizen.application.launchAppControl(service, 
                    'ijudt7w61q.Gallery',//'org.tizen.gallery',
                    function(){console.log('launch appControl succeeded');}, 
                    function(e){console.log('launch appControl failed. Reason: ' + e.name);}, 
                    serviceReplyCB
                );
			}
		};
	});
