define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Tizen.Bluetooth.BluetoothClassDeviceMinor', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothClassDeviceMinor]') {
				this._obj = args;
			}
		},

		constants: {
			COMPUTER_UNCATEGORIZED: 0x00, //octet
			COMPUTER_DESKTOP: 0x01, //octet
			COMPUTER_SERVER: 0x02, //octet
			COMPUTER_LAPTOP: 0x03, //octet
			COMPUTER_HANDHELD_PC_OR_PDA: 0x04, //octet
			COMPUTER_PALM_PC_OR_PDA: 0x05, //octet
			COMPUTER_WEARABLE: 0x06, //octet
			PHONE_UNCATEGORIZED: 0x00, //octet
			PHONE_CELLULAR: 0x01, //octet
			PHONE_CORDLESS: 0x02, //octet
			PHONE_SMARTPHONE: 0x03, //octet
			PHONE_MODEM_OR_GATEWAY: 0x04, //octet
			PHONE_ISDN: 0x05, //octet
			AV_UNRECOGNIZED: 0x00, //octet
			AV_WEARABLE_HEADSET: 0x01, //octet
			AV_HANDSFREE: 0x02, //octet
			AV_MICROPHONE: 0x04, //octet
			AV_LOUDSPEAKER: 0x05, //octet
			AV_HEADPHONES: 0x06, //octet
			AV_PORTABLE_AUDIO: 0x07, //octet
			AV_CAR_AUDIO: 0x08, //octet
			AV_SETTOP_BOX: 0x09, //octet
			AV_HIFI: 0x0a, //octet
			AV_VCR: 0x0b, //octet
			AV_VIDEO_CAMERA: 0x0c, //octet
			AV_CAMCORDER: 0x0d, //octet
			AV_MONITOR: 0x0e, //octet
			AV_DISPLAY_AND_LOUDSPEAKER: 0x0f, //octet
			AV_VIDEO_CONFERENCING: 0x10, //octet
			AV_GAMING_TOY: 0x12, //octet
			PERIPHERAL_UNCATEGORIZED: 0, //octet
			PERIPHERAL_KEYBOARD: 0x10, //octet
			PERIPHERAL_POINTING_DEVICE: 0x20, //octet
			PERIPHERAL_KEYBOARD_AND_POINTING_DEVICE: 0x30, //octet
			PERIPHERAL_JOYSTICK: 0x01, //octet
			PERIPHERAL_GAMEPAD: 0x02, //octet
			PERIPHERAL_REMOTE_CONTROL: 0x03, //octet
			PERIPHERAL_SENSING_DEVICE: 0x04, //octet
			PERIPHERAL_DEGITIZER_TABLET: 0x05, //octet
			PERIPHERAL_CARD_READER: 0x06, //octet
			PERIPHERAL_DIGITAL_PEN: 0x07, //octet
			PERIPHERAL_HANDHELD_SCANNER: 0x08, //octet
			PERIPHERAL_HANDHELD_INPUT_DEVICE: 0x09, //octet
			IMAGING_UNCATEGORIZED: 0x00, //octet
			IMAGING_DISPLAY: 0x04, //octet
			IMAGING_CAMERA: 0x08, //octet
			IMAGING_SCANNER: 0x10, //octet
			IMAGING_PRINTER: 0x20, //octet
			WEARABLE_WRITST_WATCH: 0x01, //octet
			WEARABLE_PAGER: 0x02, //octet
			WEARABLE_JACKET: 0x03, //octet
			WEARABLE_HELMET: 0x04, //octet
			WEARABLE_GLASSES: 0x05, //octet
			TOY_ROBOT: 0x01, //octet
			TOY_VEHICLE: 0x02, //octet
			TOY_DOLL: 0x03, //octet
			TOY_CONTROLLER: 0x04, //octet
			TOY_GAME: 0x05, //octet
			HEALTH_UNDEFINED: 0x00, //octet
			HEALTH_BLOOD_PRESSURE_MONITOR: 0x01, //octet
			HEALTH_THERMOMETER: 0x02, //octet
			HEALTH_WEIGHING_SCALE: 0x03, //octet
			HEALTH_GLUCOSE_METER: 0x04, //octet
			HEALTH_PULSE_OXIMETER: 0x05, //octet
			HEALTH_PULSE_RATE_MONITOR: 0x06, //octet
			HEALTH_DATA_DISPLAY: 0x07, //octet
			HEALTH_STEP_COUNTER: 0x08, //octet
			HEALTH_BODY_COMPOSITION_ANALYZER: 0x09, //octet
			HEALTH_PEAK_FLOW_MONITOR: 0x0a, //octet
			HEALTH_MEDICATION_MONITOR: 0x0b, //octet
			HEALTH_KNEE_PROSTHESIS: 0x0c, //octet
			HEALTH_ANKLE_PROSTHESIS: 0x0d //octet
		}

	});
});