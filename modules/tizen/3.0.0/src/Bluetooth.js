define(['Ti/_/lang', 'Ti/_/Evented', 'Ti/Tizen/Bluetooth/BluetoothAdapter'], function(lang, Evented, BluetoothAdapter) {
	return lang.setObject('Tizen.Bluetooth', Evented, {

		constants: {
			BLUETOOTH_SECURITY_LEVEL_LOW: 'LOW',
			BLUETOOTH_SECURITY_LEVEL_MEDIUM: 'MEDIUM',
			BLUETOOTH_SECURITY_LEVEL_HIGH: 'HIGH',
			BLUETOOTH_SOCKET_TYPE_RFCOMM: 'RFCOMM',
			BLUETOOTH_SOCKET_TYPE_L2CAP: 'L2CAP',
			BLUETOOTH_SOCKET_STATE_CLOSED: 'CLOSED',
			BLUETOOTH_SOCKET_STATE_OPEN: 'OPEN'
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
			}
		},

		getDefaultAdapter: function() {
            try {
                return this._wrap(tizen.bluetooth.getDefaultAdapter());
            } catch(e) {
                Ti.API.error(e.message);
            }
		},

		_wrap: function(object) {
			if (object.toString() === '[object BluetoothAdapter]') {
				return this.createBluetoothAdapter(object);
			}
		},
		createBluetoothAdapter: function(object) { 
			return new BluetoothAdapter(object);
		}
	});
});