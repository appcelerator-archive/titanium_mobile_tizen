define(['Ti/_/declare', 'Ti/_/Evented', 'Ti/Tizen/Bluetooth/BluetoothDevice', 'Ti/Tizen/Bluetooth/BluetoothServiceHandler', 'Ti/Tizen/WebAPIError'], 
    function(declare, Evented, BluetoothDevice, BluetoothServiceHandler, WebApiError) {
	return declare('Tizen.Bluetooth.BluetoothAdapter', Evented, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothAdapter]') {
				this._obj = args;
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
			}
		},

		setName: function(name /*DOMString*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setName(name,
				successCallback && function() {
                    successCallback();
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		setPowered: function(state /*boolean*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.setPowered(state,
				successCallback && function() {
                    successCallback();
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		discoverDevices: function() {
			var self = this;
            return self._obj.discoverDevices( 
                // BluetoothDiscoverDevicesSuccessCallback
                {
                    onstarted: function() {
                    	self.fireEvent('discoverystarted');
                    },
                    ondevicefound: function(device) {
                    	self.fireEvent('devicefound', new BluetoothDevice(device));
                    },
                    ondevicedisappeared: function(address) {
                    	self.fireEvent('devicedisappeared', address);
                    },
                    onfinished: function(devices) {
                        var i = 0,
                            len = devices.length,
                            arr = [];

                        for (; i < len; i++) {
                            arr.push(new BluetoothDevice(devices[i]));
                        }
                        self.fireEvent('discoveryfinished', arr);
                    }
                },
                // ErrorCallback
                function(e) {
                	self.fireEvent('discoveryerror', new WebAPIError(e));
                }
            );
		},

		stopDiscovery: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.stopDiscovery(
				successCallback && function() {
                    successCallback();
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		getKnownDevices: function(successCallback /*BluetoothDeviceArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.getKnownDevices(
                function(devices) {
                    var i = 0,
                        len = devices.length,
                        arr = [];

                    for (; i < len; i++) {
                        arr.push(new BluetoothDevice(devices[i]));
                    }
                    successCallback(arr);
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		getDevice: function(address /*BluetoothAddress*/, successCallback /*BluetoothDeviceSuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.getDevice(address,
                function(device) {
                    successCallback(new BluetoothDevice(device));
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		createBonding: function(address /*BluetoothAddress*/, successCallback /*BluetoothDeviceSuccessCallback*/, errorCallback /*ErrorCallback*/) {
            return this._obj.createBonding(address, 
                function(device) {
                    successCallback(new BluetoothDevice(device));
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		},

		destroyBonding: function(address /*BluetoothAddress*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return this._obj.destroyBonding(address,
				successCallback && function() {
                    successCallback();
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		},

        registerRFCOMMServiceByUUID: function(uuid /*BluetoothUUID*/, name /*DOMString*/, successCallback /*BluetoothServiceSuccessCallback*/, errorCallback /*ErrorCallback*/) {
            return this._obj.registerRFCOMMServiceByUUID(uuid, name, 
                function(handler) {
                    successCallback(new BluetoothServiceHandler(handler));
                },
				errorCallback && function(e) {
                    errorCallback(new WebAPIError(e));
                }
            );
		}
	});
});