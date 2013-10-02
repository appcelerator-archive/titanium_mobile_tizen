// Wraps Tizen interface "BluetoothAdapter" that resides in Tizen module "Bluetooth".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bluetooth/BluetoothDevice', 'Tizen/_/Bluetooth/BluetoothServiceHandler', 'Tizen/_/Bluetooth/BluetoothProfileHandler', 'Tizen/_/Bluetooth/BluetoothHealthProfileHandler'],
	function(declare, Evented, BluetoothDevice, BluetoothServiceHandler, BluetoothProfileHandler, BluetoothHealthProfileHandler) {

		function onError (e, callback) {
			callback({
				code: e.code,
				success: false,
				error: e.type + ': ' + e.message
			});
		}

		var listening,
			adapter = declare(Evented, {

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},


			setName: function(name /*DOMString*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [ name ];
				(typeof callback !== 'undefined') && args.push(
					function() {
						callback({
							code: 0,
							success: true
						});
					},
					function(e) {
						onError(e, callback);
					}
				);
				this._obj.setName.apply(this._obj, args);
			},

			setPowered: function(state /*boolean*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [ state ];
				(typeof callback !== 'undefined') && args.push(
					function() {
						callback({
							code: 0,
							success: true
						});
					}, 
					function(e) {
						onError(e, callback);
					}
				);
				this._obj.setPowered.apply(this._obj, args);
			},

			// Device discovery will automatically start when user subscribes to one of the
			// device discovery events.
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

							listening = false;
						}
					}, function (e) {
						self.fireEvent('discoveryerror', {
							code: e.code,
							error: e.type + ': ' + e.message
						});
					});
				}
			},

			stopDiscovery: function(callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [];
				if(listening) {
					// stopDiscovery automatically removes all Titanium event subscriptions.
					// Otherwise, after stopping discovery and reinitiating it with addEventListener again,
					// events that were subscribed to previously will start arriving, which generally is not
					// intended.

					Evented.removeEventListener('discoverystarted');
					Evented.removeEventListener('devicefound');
					Evented.removeEventListener('devicedisappeared');
					Evented.removeEventListener('discoveryfinished');

					listening = false;
				}

				(typeof callback !== 'undefined') && args.push(function() {
						callback({
							code: 0,
							success: true
						});
					},
					callback && function(e) {
						onError(e, callback);
					});
				this._obj.stopDiscovery.apply(this._obj, args);
			},

			getKnownDevices: function(callback) {
				this._obj.getKnownDevices(callback && function(devices) {
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
				this._obj.getDevice(address, callback && function(device) {
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
				this._obj.createBonding(address, callback && function(device) {
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
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				args = [ address ];
				(typeof callback !== 'undefined') && args.push(function() {
					callback({
						code: 0,
						success: true
					});
				}, 
				callback && function(e) {
					onError(e, callback);
				});
				this._obj.destroyBonding.apply(this._obj, args);
			},

			registerRFCOMMServiceByUUID: function(uuid /*BluetoothUUID*/, name /*DOMString*/, callback) {
				this._obj.registerRFCOMMServiceByUUID(uuid, name, callback && function(handler) {
					callback({
						code: 0,
						success: true,
						handler: new BluetoothServiceHandler(handler)
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			addEventListener: function () {
				var self = this;

				Evented.addEventListener.apply(this, arguments);

				if (!listening) {
					listening = true;

					this._obj.setChangeListener({
						onstatechanged: function(powered) {
							self.fireEvent('onstatechanged', {
								powered: powered
							});
						},
						onnamechanged: function(name) {
							self.fireEvent('onnamechanged', {
								name: name
							});
						},
						onvisibilitychanged: function(visible) {
							self.fireEvent('onvisibilitychanged', {
								visible: visible
							});
						}
					});					
				}
			},

			getBluetoothProfileHandler: function(/*BluetoothProfileType*/ profileType) {
				try {
					return this._wrap(this._obj.getBluetoothProfileHandler(profileType));
				} catch(e) {
					console.log(e.message);
				}
			},

			_wrap: function(object) {
				// Wrap the object (create a Titanium wrapped object out of a native Tizen object)
				if (object.toString() === '[object BluetoothProfileHandler]') {
					return new BluetoothProfileHandler(object);
				} else if (object.toString() === '[object BluetoothHealthProfileHandler]') {
					return new BluetoothHealthProfileHandler(object);
				} else {
					throw new Error('Object of unknown type');
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
			}

		});

		// Initialize declaredClass, so that toString() works properly on such objects.
		// Correct operation of toString() is required for proper wrapping and automated testing.
		adapter.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothAdapter';
		return adapter;
	});
