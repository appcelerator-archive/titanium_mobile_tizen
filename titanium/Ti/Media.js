define(
	['Ti/_/Evented', 'Ti/_/lang', 'Ti/Blob', 'Ti/h2c', 'Ti/Media/Sound', 'Ti/Media/AudioPlayer', 'Ti/_/Media/helper'],
	function(Evented, lang, Blob, h2c, Sound, AudioPlayer, helper) {

	var deviceCapabilities = tizen.systeminfo.getCapabilities();

	return lang.setObject('Ti.Media', Evented, {

		constants: {
			UNKNOWN_ERROR: 0,
			DEVICE_BUSY: 1,
			NO_CAMERA: 2,
			NO_VIDEO: 3,

			VIDEO_CONTROL_DEFAULT: 1,
			VIDEO_CONTROL_EMBEDDED: 1,
			VIDEO_CONTROL_FULLSCREEN: 2,
			VIDEO_CONTROL_NONE: 0,
			VIDEO_CONTROL_HIDDEN: 0,

			VIDEO_SCALING_NONE: 0,
			VIDEO_SCALING_ASPECT_FILL: 2,
			VIDEO_SCALING_ASPECT_FIT: 1,
			VIDEO_SCALING_MODE_FILL: 3,

			VIDEO_PLAYBACK_STATE_STOPPED: 0,
			VIDEO_PLAYBACK_STATE_PLAYING: 1,
			VIDEO_PLAYBACK_STATE_PAUSED: 2,

			VIDEO_LOAD_STATE_PLAYABLE: 1,
			VIDEO_LOAD_STATE_PLAYTHROUGH_OK: 2,
			VIDEO_LOAD_STATE_STALLED: 4,
			VIDEO_LOAD_STATE_UNKNOWN: 0,

			VIDEO_REPEAT_MODE_NONE: 0,
			VIDEO_REPEAT_MODE_ONE: 1,

			VIDEO_FINISH_REASON_PLAYBACK_ENDED: 0,
			VIDEO_FINISH_REASON_PLAYBACK_ERROR: 1,
			VIDEO_FINISH_REASON_USER_EXITED: 2,

			MEDIA_TYPE_PHOTO: 'public.image',
			MEDIA_TYPE_VIDEO: 'public.video',

			canRecord: deviceCapabilities.microphone,
			isCameraSupported: deviceCapabilities.cameraFront || deviceCapabilities.cameraBack
		},

		openPhotoGallery: function(args) {
			//TODO: From the next release (Tizen 2.1.0), this additional data will not be needed.
			var additionalData = [new tizen.ApplicationControlData("selectionMode", ["single"])],
				service = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/pick', null, 'image/*', null, additionalData);

			tizen.application.launchAppControl(service,
					null,
					function() {
						console.log('Launch service Photo Gallery succeeded');
					},
					function(e){
						args && args.error && args.error({
							code: -1,
							error: e.message,
							success: false
						});
						console.error('Something wrong with launching service - Photo Gallery. '+ e.message);
					},
					{
						// callee now sends a reply
						onsuccess: function(data) {
							helper.selectedItemCB(data, args);
						},
						//Something went wrong
						onfailure:function() {
							console.error('Something went wrong');
						}
					}
				);
		},

		createAudioPlayer: function(args) {
			return new AudioPlayer(args);
		},

		createSound: function(args) {
			return new Sound(args);
		},

		createVideoPlayer: function(args) {
			return new (require('Ti/Media/VideoPlayer'))(args);
		},

		vibrate: function(pattern) {
			'vibrate' in navigator && navigator.vibrate(require.is(pattern, 'Array') ? pattern : [pattern | 0]);
		},

		openMusicLibrary: function(args) {
			//Open default Tizet music applicatin with ApplicationControl
			var service = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view', null, 'audio/*', null);

			tizen.application.launchAppControl(
				service,
				'org.tizen.music-player',
				function() {
					args && args.success && args.success();
					console.log('Launch service Music Player succeeded');
				},
				function(e) {
					args && args.error && args.error({
						code: -1,
						error: e.message,
						success: false
					});
					console.error('Something wrong with launching service - Music Player. '+ e.message);
				}
			);
		},

		// In Tizen, this function won't work until https://jira.appcelerator.org/browse/TIMOB-12416 
		// is resolved
		
		saveToPhotoGallery: function(media, callbacks) {
			var file,
				blob,
				searchString = 'base64,',
				base64String;

			function errorCB(e) {
				console.error(e.message);
				callbacks && typeof callbacks.error === 'function' && callbacks.error();
			}

			if(media instanceof Blob) {
				blob = media;
				file = blob.file;
			} else if(media instanceof Titanium.Filesystem.File) {
				file = media;
				blob = file.read();
			} else {
				return errorCB({message: 'Incorrect type of media argument'});
			}

			base64String = blob.toString();
			var index = base64String.indexOf(searchString);

			if(index === -1) {
				return errorCB({message: 'Error: prefix base64 not found'});
			}

			base64String = base64String.substring(index + searchString.length);

			tizen.filesystem.resolve('images',
				function(dir) {
					var writeToStream = function (fileStream) {
						fileStream.writeBase64(base64String);
						fileStream.close();
						callbacks && typeof callbacks.success === 'function' && callbacks.success();
					};

					try {
						dir.createFile(file.name).openStream('rw', writeToStream, errorCB);
					} catch(e) {
						errorCB(e);
					}
				},
				errorCB,
				'rw'
			);
		},

		takeScreenshot: function(callback) {
			if (!callback) return;

			var options = {
				allowTaint: true,
				taintTest: false
			};
			options.onrendered = function(canvasObject) {
				var blobData = canvasObject.toDataURL().substring(22), //data:image/png;base64,
					blob = new Blob({
						data: blobData,
						length: blobData.length,
						mimeType: 'image/png'
					});
				callback({
					media: blob
				});
			};

			h2c([document.body], options);
		},

		showCamera: function(args) {
			if (!this.isCameraSupported) return;

			var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/create_content', null, 'image/jpeg', null);

			tizen.application.launchAppControl(
				appControl,
				null,
				function() {
					// On succeeded
					console.log('Launch service Camera succeeded');
				},
				function(e){
					args && args.error && args.error({
						code: -1,
						error: e.message,
						success: false
					});
					console.error('Something wrong with launching service - Camera. '+ e.message);
				},
				{
					// callee now sends a reply
					onsuccess: function(data) {
						helper.selectedItemCB(data, args);
					},
					//Something went wrong
					onfailure:function() {
						console.error('Something went wrong');
					}
				}
			);
		}
	});
});