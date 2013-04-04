// Wraps Tizen interface "SystemInfoDeviceCapability" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var capability = declare(Evented, {

		constructor: function(args) {
			if (args.toString() === '[object SystemInfoDeviceCapability]') {
				// args is a native Tizen object; simply wrap it (take ownership of it)
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
			cameraFrontFlash: {
				get: function() {
					return this._obj.cameraFrontFlash;
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
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	capability.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoDeviceCapability';
	return capability;
});
