define(['Ti/_/declare'], function(declare){
	return declare('Ti.Tizen.Filesystem.FileStream', null, {
		constructor: function(args) {
			if(args.toString() === '[object FileStream]') {
				this._obj = args;
			} 
		},
		
		constants: {
			eof: {
				get: function() {
					return this._obj.eof;
				}
			},
			bytesAvailable: {
				get: function() {
					return this._obj.bytesAvailable;
				}
			},
		},

		properties: {
			position: {
				get: function() {
					return this._obj.position;
				},
				set: function(value) {
					this._obj.position = value;
				}
			},
		},

		close: function() {
			return this._obj.close();
		},

		read: function(charCount /*long*/) {
			return this._obj.read(charCount);
		},

		readBytes: function(byteCount /*long*/) {
			return this._obj.readBytes(byteCount);
		},

		readBase64: function(byteCount /*long*/) {
			return this._obj.readBase64(byteCount);
		},

		write: function(stringData /*DOMString*/) {
			return this._obj.write(stringData);
		},

		writeBytes: function(byteData /*octet*/) {
			this._obj.writeBytes(byteData);
		},

		writeBase64: function(base64Data /*DOMString*/) {
			return this._obj.writeBase64(base64Data);
		}
	});
});