// Wraps Tizen interface "BluetoothAdapter" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bluetooth/BluetoothDevice', 'Tizen/_/Bluetooth/BluetoothServiceHandler'],
	function(declare, Evented, BluetoothDevice, BluetoothServiceHandler) {
	
		function onError (e, callback) {
			callback({
				code: e.code,
				success: false,
				error: e.type + ': ' + e.message
			});
		}

		var listening,
			adapter = declare(Evented, {

			constructor: function(args) {
				if (args.toString() === '[object BluetoothAdapter]') {
					// args is a native Tizen object; simply wrap it (take ownership of it)
					this._obj = args;
				}
			},


			setName: function(name /*DOMString*/, callback) {
				return this._obj.setName(name, callback && function() {
					callback({
						code: 0,
						success: true
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			setPowered: function(state /*boolean*/, callback) {
				return this._obj.setPowered(state, callback && function() {
					callback({
						code: 0,
						success: true
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			addEventListener: function () {
				var self = this;
				Evented.addEventListener.apply(this, arguments);

				if (! listening) {
					listening = true;
					this._obj.discoverDevices({
						onstarted: function () {
							self.fireEvent('discoverystarted');
						},
						ondevicefound: function (device) {
							self.fireEvent('devicefound', {
								device: new BluetoothDevice(device)
							});
						},
						ondevicedisappeared: function(address) {
							self.fireEvent('devicedisappeared', {
								address: address
							});
						},
						onfinished: function(devices) {
							var i = 0,
								len = devices.length,
								arr = [];

							for (; i < len; i++) {
								arr.push(new BluetoothDevice(devices[i]));
							}
							self.fireEvent('discoveryfinished', {
								devices: arr
							});
						}
					}, function (e){
						self.fireEvent('discoveryerror', {
							code: e.code,
							error: e.type + ': ' + e.message
						});
					});
				}
			},

			stopDiscovery: function(callback) {
				return this._obj.stopDiscovery(callback && function() {
					callback({
						code: 0,
						success: true
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			getKnownDevices: function(callback) {
				return this._obj.getKnownDevices(callback && function(devices) {
						var i = 0,
							len = devices.length,
							arr = [];

						for (; i < len; i++) {
							arr.push(new BluetoothDevice(devices[i]));
						}

						callback({
							code: 0,
							success: true,
							devices: arr
						});
					}, callback && function(e) {
						onError(e, callback);
					});
			},

			getDevice: function(address /*BluetoothAddress*/, callback) {
				return this._obj.getDevice(address, callback && function(device) {
						callback({
							code: 0,
							success: true,
							device: new BluetoothDevice(device)
						});
				}, callback && function(e) {
						onError(e, callback);
				});
			},

			createBonding: function(address /*BluetoothAddress*/, callback) {
				return this._obj.createBonding(address, callback && function(device) {
						console.log(device + '<<-------------');
						callback({
							code: 0,
							success: true,
							device: new BluetoothDevice(device)
						});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			destroyBonding: function(address /*BluetoothAddress*/, callback) {
				return this._obj.destroyBonding(address, callback && function() {
					callback({
						code: 0,
						success: true
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			registerRFCOMMServiceByUUID: function(uuid /*BluetoothUUID*/, name /*DOMString*/, callback) {
				return this._obj.registerRFCOMMServiceByUUID(uuid, name, callback && function(handler) {
					callback({
						code: 0,
						success: true,
						handler: new BluetoothServiceHandler(handler)
					});
				}, callback && function(e) {
					onError(e, callback);
				});
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
			}

		});

		// Initialize declaredClass, so that toString() works properly on such objects.
		// Correct operation of toString() is required for proper wrapping and automated testing.
		adapter.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothAdapter';
		return adapter;
	});
