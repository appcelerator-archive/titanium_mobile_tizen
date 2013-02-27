define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Bluetooth.BluetoothAdapter', null, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothAdapter]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			name: {
				get: function() {
					return this._obj.name;
				}
			},
			address: {
				get: function() {
					return this._obj.address;
				}
			},
			powered: {
				get: function() {
					return this._obj.powered;
				}
			},
			visible: {
				get: function() {
					return this._obj.visible;
				}
			},
		},

		setName: function(name /*DOMString*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setName(name, successCallback, errorCallback);
		},

		setPowered: function(state /*boolean*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setPowered(state, successCallback, errorCallback);
		},

		setVisible: function(mode /*boolean*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, timeout /*unsigned short*/) {
			return this._obj.setVisible(mode, successCallback, errorCallback, timeout);
		},

		discoverDevices: function(successCallback /*BluetoothDiscoverDevicesSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.discoverDevices(successCallback, errorCallback);
		},

		stopDiscovery: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.stopDiscovery(successCallback, errorCallback);
		},

		getKnownDevices: function(successCallback /*BluetoothDeviceArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.getKnownDevices(successCallback, errorCallback);
		},

		getDevice: function(address /*BluetoothAddress*/, successCallback /*BluetoothDeviceSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.getDevice(address, successCallback, errorCallback);
		},

		createBonding: function(address /*BluetoothAddress*/, successCallback /*BluetoothDeviceSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.createBonding(address, successCallback, errorCallback);
		},

		destroyBonding: function(address /*BluetoothAddress*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.destroyBonding(address, successCallback, errorCallback);
		},

		registerRFCOMMServiceByUUID: function(uuid /*BluetoothUUID*/, name /*DOMString*/, successCallback /*BluetoothServiceSuccessCallback*/, errorCallback /*ErrorCallback*/, securityLevel /*BluetoothSecurityLevel*/) {
			return this._obj.registerRFCOMMServiceByUUID(uuid, name, successCallback, errorCallback, securityLevel);
		}
	});
});