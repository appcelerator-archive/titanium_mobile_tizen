define(["Ti/_/declare", "Ti/Blob"],
    function(declare, Blob) {
		var service = new tizen.ApplicationService('http://tizen.org/appcontrol/operation/pick', null,'IMAGE/*'),
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
				_removePrefix: function(path){
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
				getFile: function(path){
					if(this.getRoot(path)){
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
			open: function(args){
				var path;
				var file;
				var readFromStream  = function(fileStream){
					var contents = fileStream.readBase64(fileStream.bytesAvailable);
					fileStream.close();
					
					var blob = new Blob({
						data: contents,
						length: contents.length,
						mimeType: imgMimeType[virtualRoot.fileExt(path)] || "text/plain",
						file: file || null,
						nativePath: path || null
					});
					
					var event = {
						cropRect: null,
						media: blob,
						mediaType: Ti.Media.MEDIA_TYPE_PHOTO
					}
					args.success(event);
				};
								
				var resolveFileCB = function(dir) {
					//Resolve to file
					file = dir.resolve(virtualRoot.getFile(path));
					file.openStream(
						// open for reading
						'r',
						// success callback - read and display the contents of the file
						readFromStream,
						// error callback
						function(e) {
							console.log("Error with open stream" + e.message)
							}
						);	
				};
				var pickToItemCB = function(reply) {   // reply -> ApplicationServiceData[0]
					path = reply[0].value.toString();
					//Check if this file is image - return blob
					if(virtualRoot.fileType(virtualRoot.fileExt(path)) == PHOTO) {
						//Resolve to directory
						tizen.filesystem.resolve(
							virtualRoot.getRoot(path), 
							//'removable1',
							resolveFileCB, 
							function(e) {
								console.log("Error" + e.message);
							}, 
							"rw");
					//Check if this file is video - return path(string)		
					} else if(virtualRoot.fileType(virtualRoot.fileExt(path)) == VIDEO) {
						var event = {
								cropRect: null,
								media: path,
								mediaType: Ti.Media.MEDIA_TYPE_VIDEO
							}		
						args.success(event);
					} else {
						console.log('This format of file does not supported');
					}	
				}
				var serviceReplyCB = {
                    // callee now sends a reply
                    onsuccess: pickToItemCB,
                    // Something went wrong 
                    onfail: args.error 
                };
				//START
                //Launch PhotoGallery for tizen
                tizen.application.launchService(
                    service,
                    'org.tizen.gallery',
                    function() {
                        console.log("Launch service succeeded");
                    }, 
                    function(e) {
                        console.log("Launch service failed. Reason : " + e.name);
                    },  
                    serviceReplyCB
                    );
			}
        };
    });
