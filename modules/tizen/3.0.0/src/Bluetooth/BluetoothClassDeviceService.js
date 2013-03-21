define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	return declare('Tizen.Bluetooth.BluetoothClassDeviceService', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothClassDeviceService]') {
				this._obj = args;
			}
		},

		constants: {
			LIMITED_DISCOVERABILITY: 0x0001, //unsigned short
			POSITIONING: 0x0008, //unsigned short
			NETWORKING: 0x0010, //unsigned short
			RENDERING: 0x0020, //unsigned short
			CAPTURING: 0x0040, //unsigned short
			OBJECT_TRANSFER: 0x0080, //unsigned short
			AUDIO: 0x0100, //unsigned short
			TELEPHONY: 0x0200, //unsigned short
			INFORMATION: 0x0400 //unsigned short
		}

	});
});