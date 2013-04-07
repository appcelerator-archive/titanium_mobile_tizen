define(
	['Ti/_/Evented', 'Ti/_/lang', 'Ti/_/Media/PhotoGallery', 'Ti/Blob', 'Ti/h2c', 'Ti/Media/Sound', 'Ti/Media/AudioPlayer', 'Ti/API'],
	function(Evented, lang, photoGallery, Blob, h2c, Sound, AudioPlayer, API) {

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
			photoGallery.open(args);
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

		showMusicLibrary: function(args) {
			//Open default Tizet music applicatin with ApplicationControl
			var service = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/view', null, 'audio/*', null);

			tizen.application.launchAppControl(service, 'org.tizen.music-player',
				function() {API.info('launch service succeeded');},
				function(e) { API.warn('launch service failed. Reason : ' + e.name);},
				{
					// callee now sends a reply 
					onsuccess: function(reply) {
						API.info('onsuccess:' + reply.key + ';' + reply.value);
					},
					// Something went wrong 
					onfailure: function() {
						API.warn('launch service failed');
					}
				});
		},

		saveToPhotoGallery: function(media, callbacks) {
			var file = media instanceof Blob ? media.file : media,
				blob = file.read();

			function errorCB(e) {
				callbacks && typeof callbacks.error === 'function' && callbacks.error(e);
			}

			tizen.filesystem.resolve('images',
				function(dir) {
					var writeToStream = function (fileStream) {
						fileStream.writeBase64(blob._data);
						fileStream.close();
						callbacks && typeof callbacks.success === 'function' && callbacks.success();
					};

					try {
						dir.createFile(file.name).openStream('rw', writeToStream,errorCB);
					} catch(e) {
						errorCB(e);
					}
				},
				errorCB, 'rw'
			);
		},

		takeScreenshot: function(callback) {
			if (!callback) return;

			var options = { allowTaint: true,taintTest: false };
			options.onrendered = function(canvasObject) {
				var blobData = canvasObject.toDataURL().substring(22), //data:image/png;base64,
					blob = new Blob({
						data: blobData,
						length: blobData.length,
						mimeType: 'image/png'
					});
				callback({ media: blob });
			};

			h2c([document.body], options);
		},

		showCamera: function() {
			if (!this.isCameraSupported) return;

			var appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/create_content', null, 'image/jpeg', null);

			tizen.application.launchAppControl(appControl, 'org.tizen.camera-app',
				function(){
					// On succeeded
					API.info('launch service succeeded');
				},
				function(e) {
					//On Failed
					API.warn('launch service failed. Reason : ' + e.name);
				},
				{
					// callee now sends a reply 
					onsuccess: function(reply) {
						API.info('onsuccess:' + reply.key + ';' + reply.value);
					},
					// Something went wrong 
					onfailure: function() {
						API.warn('launch service failed');
					}
				}
			);
		}
	});
});