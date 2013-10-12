// Wraps Tizen interface "SystemInfoDeviceCapability" that resides in Tizen module "SystemInfo".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var capability = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
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
			nfcReservedPush: {
				get: function() {
					this._obj.nfcReservedPush;
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
			inputKeyboardLayout: {
				get: function() {
					return this._obj.inputKeyboardLayout;
				}
			},
			wifiDirect: {
				get: function() {
					return this._obj.wifiDirect;
				}
			},
			opengles: {
				get: function() {
					return this._obj.opengles;
				}
			},
			openglestextureFormat: {
				get: function() {
					return this._obj.openglestextureFormat;
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
			webApiVersion: {
				get: function() {
					return this._obj.webApiVersion;
				}
			},
			nativeApiVersion: {
				get: function() {
					return this._obj.nativeApiVersion;
				}
			},
			camera: {
				get: function() {
					return this._obj.camera;
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
			speechSynthesis: {
				get: function() {
					return this._obj.speechSynthesis;
				}
			},
			accelerometer: {
				get: function() {
					return this._obj.accelerometer;
				}
			},
			accelerometerWakeup: {
				get: function() {
					return this._obj.accelerometerWakeup;
				}
			},
			barometer: {
				get: function() {
					return this._obj.barometer;
				}
			},
			barometerWakeup: {
				get: function() {
					return this._obj.barometerWakeup;
				}
			},
			gyroscope: {
				get: function() {
					return this._obj.gyroscope;
				}
			},
			gyroscopeWakeup: {
				get: function() {
					return this._obj.gyroscopeWakeup;
				}
			},
			magnetometer: {
				get: function() {
					return this._obj.magnetometer;
				}
			},
			magnetometerWakeup: {
				get: function() {
					return this._obj.magnetometerWakeup;
				}
			},
			photometer: {
				get: function() {
					return this._obj.photometer;
				}
			},
			photometerWakeup: {
				get: function() {
					return this._obj.photometerWakeup;
				}
			},
			proximity: {
				get: function() {
					return this._obj.proximity;
				}
			},
			proximityWakeup: {
				get: function() {
					return this._obj.proximityWakeup;
				}
			},
			tiltmeter: {
				get: function() {
					return this._obj.tiltmeter;
				}
			},
			tiltmeterWakeup: {
				get: function() {
					return this._obj.tiltmeterWakeup;
				}
			},
			dataEncryption: {
				get: function() {
					return this._obj.dataEncryption;
				}
			},
			graphicsAcceleration: {
				get: function() {
					return this._obj.graphicsAcceleration;
				}
			},
			push: {
				get: function() {
					return this._obj.push;
				}
			},
			telephony: {
				get: function() {
					return this._obj.telephony;
				}
			},
			telephonyMms: {
				get: function() {
					return this._obj.telephonyMms;
				}
			},
			telephonySms: {
				get: function() {
					return this._obj.telephonySms;
				}
			},
			screenSizeNormal: {
				get: function() {
					return this._obj.screenSizeNormal;
				}
			},
			screenSize480_800: {
				get: function() {
					return this._obj.screenSize480_800;
				}
			},
			screenSize720_1280: {
				get: function() {
					return this._obj.screenSize720_1280;
				}
			},
			autoRotation: {
				get: function() {
					return this._obj.autoRotation;
				}
			},
			shellAppWidget: {
				get: function() {
					return this._obj.shellAppWidget;
				}
			},
			visionImageRecognition: {
				get: function() {
					return this._obj.visionImageRecognition;
				}
			},
			visionQrcodeGeneration: {
				get: function() {
					return this._obj.visionQrcodeGeneration;
				}
			},
			visionQrcodeRecognition: {
				get: function() {
					return this._obj.visionQrcodeRecognition;
				}
			},
			visionFaceRecognition: {
				get: function() {
					return this._obj.visionFaceRecognition;
				}
			},
			secureElement: {
				get: function() {
					return this._obj.secureElement;
				}
			},
			nativeOspCompatible: {
				get: function() {
					return this._obj.nativeOspCompatible;
				}
			},
			profile: {
				get: function() {
					return this._obj.profile;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	capability.prototype.declaredClass = 'Tizen.SystemInfo.SystemInfoDeviceCapability';
	return capability;
});
