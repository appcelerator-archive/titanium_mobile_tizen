define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Bluetooth.BluetoothClassDeviceMajor', null, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothClassDeviceMajor]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			MISC: 0x00, //octet
			COMPUTER: 0x01, //octet
			PHONE: 0x02, //octet
			NETWORK: 0x03, //octet
			AUDIO_VIDEO: 0x04, //octet
			PERIPHERAL: 0x05, //octet
			IMAGING: 0x06, //octet
			WEARABLE: 0x07, //octet
			TOY: 0x08, //octet
			HEALTH: 0x09, //octet
			UNCATEGORIZED: 0x1F //octet
		},

	});
});