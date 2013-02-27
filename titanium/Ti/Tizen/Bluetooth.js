define(['Ti/_/lang'], function(lang) {
	return lang.setObject('Ti.Tizen.Bluetooth', {

		constants: {
			BLUETOOTH_SECURITY_LEVEL_LOW: 'LOW',
			BLUETOOTH_SECURITY_LEVEL_MEDIUM: 'MEDIUM',
			BLUETOOTH_SECURITY_LEVEL_HIGH: 'HIGH',
			BLUETOOTH_SOCKET_TYPE_RFCOMM: 'RFCOMM',
			BLUETOOTH_SOCKET_TYPE_L2CAP: 'L2CAP',
			BLUETOOTH_SOCKET_STATE_CLOSED: 'CLOSED',
			BLUETOOTH_SOCKET_STATE_OPEN: 'OPEN',
		},

		constants: {
			deviceMajor: {
				get: function() {
					return this._obj.deviceMajor;
				}
			},
			deviceMinor: {
				get: function() {
					return this._obj.deviceMinor;
				}
			},
			deviceService: {
				get: function() {
					return this._obj.deviceService;
				}
			},
		},

		getDefaultAdapter: function() {
			return this._wrap(tizen.bluetooth.getDefaultAdapter());
		},

		_wrap: function(object) {
			if (object.toString() === '[object BluetoothAdapter]') {
				return this.createBluetoothAdapter(object);
			}
		},
	});
	function onBluetoothDeviceSuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new BluetoothDevice(object));
	};

	function onBluetoothDeviceArraySuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new BluetoothDevice(object));
	};

	function onBluetoothSocketSuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new BluetoothSocket(object));
	};

	function onBluetoothServiceSuccessCallback(object, onsuccess) { 
		onsuccess.call(null, new BluetoothServiceHandler(object));
	};

});