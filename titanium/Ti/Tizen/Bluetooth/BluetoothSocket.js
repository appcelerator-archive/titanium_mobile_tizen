define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Bluetooth.BluetoothSocket', null, {
		constructor: function(args) {
			if(args.toString() === '[object BluetoothSocket]') {
				this._obj = args;
			} else {
			}
		},

		constants: {
			uuid: {
				get: function() {
					return this._obj.uuid;
				}
			},
			protocol: {
				get: function() {
					return this._obj.protocol;
				}
			},
			state: {
				get: function() {
					return this._obj.state;
				}
			},
			peer: {
				get: function() {
					return this._obj.peer;
				}
			},
		},

		properties: {
			onmessage: {
				get: function() {
					return this._obj.onmessage;
				},
				set: function(value) {
					this._obj.onmessage = value;
				}
			},
			onclose: {
				get: function() {
					return this._obj.onclose;
				},
				set: function(value) {
					this._obj.onclose = value;
				}
			},
			onerror: {
				get: function() {
					return this._obj.onerror;
				},
				set: function(value) {
					this._obj.onerror = value;
				}
			},
		},

		writeData: function(data /*byte*/) {
			return this._obj.writeData(data._obj);
		},

		readData: function() {
			return this._obj.readData();
		},

		close: function() {
			return this._obj.close();
		}
	});
});