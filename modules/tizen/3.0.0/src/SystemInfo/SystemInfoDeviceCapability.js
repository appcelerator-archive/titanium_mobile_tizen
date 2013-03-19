define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.SystemInfo.SystemInfoDeviceCapability', null, {
		constructor: function(args) {
			if(args.toString() === '[object SystemInfoDeviceCapability]') {
				this._obj = args;
			}
		},

		constants: {
			bluetooth: {
				get: function() {
					return this._obj.bluetooth;
				}
			},
			nfc: {
				get: function() {
					return this._obj.nfc;
				}
			},
			multiTouchCount: {
				get: function() {
					return this._obj.multiTouchCount;
				}
			},
			inputKeyboard: {
				get: function() {
					return this._obj.inputKeyboard;
				}
			},
			wifi: {
				get: function() {
					return this._obj.wifi;
				}
			},
			wifiDirect: {
				get: function() {
					return this._obj.wifiDirect;
				}
			},
			openglesVersion1_1: {
				get: function() {
					return this._obj.openglesVersion1_1;
				}
			},
			openglesVersion2_0: {
				get: function() {
					return this._obj.openglesVersion2_0;
				}
			},
			fmRadio: {
				get: function() {
					return this._obj.fmRadio;
				}
			},
			platformVersion: {
				get: function() {
					return this._obj.platformVersion;
				}
			},
			platformName: {
				get: function() {
					return this._obj.platformName;
				}
			},
			cameraFront: {
				get: function() {
					return this._obj.cameraFront;
				}
			},
			cameraFrontFlash: {
				get: function() {
					return this._obj.cameraFrontFlash;
				}
			},
			cameraBack: {
				get: function() {
					return this._obj.cameraBack;
				}
			},
			cameraBackFlash: {
				get: function() {
					return this._obj.cameraBackFlash;
				}
			},
			location: {
				get: function() {
					return this._obj.location;
				}
			},
			locationGps: {
				get: function() {
					return this._obj.locationGps;
				}
			},
			locationWps: {
				get: function() {
					return this._obj.locationWps;
				}
			},
			microphone: {
				get: function() {
					return this._obj.microphone;
				}
			},
			usbHost: {
				get: function() {
					return this._obj.usbHost;
				}
			},
			usbAccessory: {
				get: function() {
					return this._obj.usbAccessory;
				}
			},
			screenOutputRca: {
				get: function() {
					return this._obj.screenOutputRca;
				}
			},
			screenOutputHdmi: {
				get: function() {
					return this._obj.screenOutputHdmi;
				}
			},
			platformCoreCpuArch: {
				get: function() {
					return this._obj.platformCoreCpuArch;
				}
			},
			platformCoreFpuArch: {
				get: function() {
					return this._obj.platformCoreFpuArch;
				}
			},
			sipVoip: {
				get: function() {
					return this._obj.sipVoip;
				}
			},
			duid: {
				get: function() {
					return this._obj.duid;
				}
			},
			speechRecognition: {
				get: function() {
					return this._obj.speechRecognition;
				}
			},
			accelerometer: {
				get: function() {
					return this._obj.accelerometer;
				}
			},
			barometer: {
				get: function() {
					return this._obj.barometer;
				}
			},
			gyroscope: {
				get: function() {
					return this._obj.gyroscope;
				}
			},
			magnetometer: {
				get: function() {
					return this._obj.magnetometer;
				}
			},
			proximity: {
				get: function() {
					return this._obj.proximity;
				}
			},
		},

	});
});