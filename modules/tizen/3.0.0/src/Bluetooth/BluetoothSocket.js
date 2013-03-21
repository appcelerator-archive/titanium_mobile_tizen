define(['Ti/_/declare', 'Ti/_/Evented', 'WebAPIError'], function(declare, Evented, WebAPIError) {
	var socket = declare(Evented, {
		constructor: function(args) {
			var self = this;
			if(args.toString() === '[object BluetoothSocket]') {
				self._obj = args;
			}
            
			self._obj.onmessage = function() {
				self.fireEvent('socketmessagereceived');
            };
            
            self._obj.onclose = function() {
            	self.fireEvent('socketclosed');
            };
            
            self._obj.onerror  = function(e) {
            	self.fireEvent('socketerror', new WebAPIError(e));
            };
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
			}
		},

		writeData: function(data) {
			return this._obj.writeData(data);
		},

		readData: function() {
			return this._obj.readData();
		},

		close: function() {
			return this._obj.close();
		}
	});
    
    socket.prototype.declaredClass = 'Tizen.Bluetooth.BluetoothSocket';
    
    return socket;
});