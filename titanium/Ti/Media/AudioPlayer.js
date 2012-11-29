define(["Ti/_/declare", "Ti/_/dom", "Ti/_/event", "Ti/_/lang", "Ti/Media", "Ti/_/Evented"],
	function(declare, dom, event, lang, Media, Evented) {
	
	var doc = document,
		on = require.on,
		mimeTypes = {
			"mp3": "audio/mpeg",
			"ogg": "audio/ogg",
			"wav": "audio/wav"
		},
		BUFFERING = 0,
		INITIALIZED = 1,
		PAUSED = 2,
		PLAYING = 3,
		STARTING = 4,
		STOPPED = 5,
		STOPPING = 6,
		WAITING_FOR_DATA = 7,
		WAITING_FOR_QUEUE = 8,
		ENDED = 9,
		ABORT = 10,
		ERROR = 11;
	
	return declare("Ti.Media.AudioPlayer", Evented, {
		_currentState: STOPPED,
		_volume: 1.0,
		constructor: function() {
			this._handles = [];
		},
		properties: {
			url : {
				set: function(value) {
					if (!value || value === this.properties.__values__.url) {
						return;
					}
					this.constants.__values__.playing 	= false;
					this.constants.__values__.paused 	= false;
					this._currentState = STOPPED;
					this.properties.__values__.url = value;
					this._createAudio(true/*Release*/);
					return value;
				}
			},
			volume : {
				get: function() {
					return this._volume;
				},
				set: function(value) {
					if (value > 1.0 )
						value = 1.0;
					else if (value < 0)	
						value = 0;
					
					this._volume = value;
					this._audio && (this._audio.volume = value);
					return value;
				}
			},
			
			/* Why these properties are missing in Titanium API !!! */
			autoplay: false
			//duration: 0
		},
		constants: {
			paused : false,
			playing : false,
			state: STOPPED,
			progress: 0,
			STATE_BUFFERING:0,
			STATE_INITIALIZED:1,
			STATE_PAUSED:2,
			STATE_PLAYING:3,
			STATE_STARTING:4,
			STATE_STOPPED:5,
			STATE_STOPPING:6,
			STATE_WAITING_FOR_DATA:7,
			STATE_WAITING_FOR_QUEUE:8
		},
		_changeState: function(newState, description) {
			this._currentState = newState;
			this.constants.__values__.playing 	= PLAYING === newState;
			this.constants.__values__.paused 	= PAUSED === newState;
			var evt = {};
			evt['state'] = this.constants.__values__.state = this._currentState;
			evt['src'] = this;
			evt['description'] = description;
			this.fireEvent('change', evt);
		},
		
		/* It is commented because the duration is missing in Titanium API */
		/*
		_durationChange: function() {
			var d = this._audio.duration * 1000;
			if (d !== Infinity) {
				this.constants.__values__.duration = d;
			}
		},
		*/
		
		_createAudio: function(isRelease) {
			var audio = this._audio,
			url = this.url;
		
			if (!url) {
				return;
			}
			
			if (audio && audio.parentNode && !isRelease) {
				return audio;
			}
			
			this.release();
			
			audio = this._audio = dom.create("audio");
			
			this._handles = [
				on(audio, "playing", this, function() {this._changeState(PLAYING, "playing");}),
				on(audio, "play", this, function() {this._changeState(STARTING, "starting");}),
				on(audio, "pause", this, function() {
					if (this._currentState === STOPPING) {
						this._stop();
					} else {
						this._changeState(PAUSED, "paused");	
					}
				}),
				
				on(audio, "ended", this, function() {
					//this._changeState(ENDED, "ended");
					this._stop();
				}),
				on(audio, "abort", this, function() {
					//this._changeState(ABORT, "abort");
					this._stop();
				}),
				
				on(audio, "timeupdate", this, function() {
					var curTime = this._audio.currentTime * 1000;
					this.constants.__values__.progress = curTime;
					this.fireEvent( 'progress', {'progress': curTime} );
					this._currentState === STOPPING && this.pause();
				}),
				on(audio, "error", this, function() {
					var msg = "Unknown error";
					switch (this._audio.error.code) {
						case 1: msg = "Aborted"; break;
						case 2: msg = "Decode error"; break;
						case 3: msg = "Network error"; break;
						case 4: msg = "Unsupported format";
					}
					/* 
					Why the error event is missing in Titanium API !!! 
					So it will be description in 'state' event
					*/
					//this._changeState(ERROR, "error: " + msg);
					this.stop();
				}),
				on(audio, "canplay", this, function() {
					this.volume = this._volume;
					this._changeState(INITIALIZED, "initialized");
					this.autoplay && audio.play();
				})
				
				/* It is commented because the duration is missing in Titanium API */
				//on(audio, "durationchange", this, "_durationChange")
				
				/* These events are not used at the moment */
				/*
				on(audio, "loadstart", this, function() {
					console.log('loadstart');
				}),
				on(audio, "progress", this, function() {
					console.log('fetching data');	
				}),
				on(audio, "loadedmetadata", this, function() {
					console.log('loadedmetadata');
				}),
				on(audio, "loadeddata", this, function() {
					console.log('loadeddata');
				})
				*/	
			];
			
			doc.body.appendChild(audio);
			
			require.is(url, "Array") || (url = [url]);
			
			for (i = 0; i < url.length; i++) {
				match = url[i].match(/.+\.([^\/\.]+?)$/);
				dom.create("source", {
					src: url[i],
					type: match && mimeTypes[match[1]]
				}, audio);
			}

			return audio;
			
		},
		release: function() {
			var audio = this._audio,
				parent = audio && audio.parentNode;
			this._currentState = STOPPED;
			this.constants.playing = false;
			this.constants.paused = false;
			if (parent) {
				event.off(this._handles);
				parent.removeChild(audio);
			}
			this._audio = null;
		},
		pause: function() {
			var audio;
			this._currentState === PLAYING && (audio = this._createAudio()) && audio.pause();
		},
		start: function() {
			var audio;
			this._currentState !== PLAYING && (audio = this._createAudio()) && audio.play();
		},
		play: function() {
			this.start();
		},
		_stop: function() {
			var a = this._audio;
			a.currentTime = 0;
			this._changeState(STOPPED, "stopped");

			//fix bug related to "Stop/currentTime=0" !!!
			if (a.currentTime !== 0) {
				a.load();
				this.volume = this._volume;
			}
		},
		stop: function() {
			var a = this._audio;
			
			if (!a)
				return;
				
			if (this._currentState === PAUSED) {
				this._stop();
			} else {
				this._changeState(STOPPING, "stopping");
				a.pause();
			}
		}
	});
});
