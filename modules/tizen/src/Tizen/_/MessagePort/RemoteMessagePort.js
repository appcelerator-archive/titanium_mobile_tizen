define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {
	var RemoteMessagePort = declare(Evented, {

		constructor: function(nativeObj) {
			// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
			this._obj = nativeObj;
		},

		constants: {
			messagePortName: {
				get: function() {
					return this._obj.messagePortName;
				}
			},
			appId: {
				get: function() {
					return this._obj.appId;
				}
			},
			isTrusted: {
				get: function() {
					return this._obj.isTrusted;
				}
			}
		},

		sendMessage: function(data /*MessagePortDataItem*/, localMessagePort /*LocalMessagePort*/) {
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			args = [ data ];
			(typeof localMessagePort !== 'undefined') && args.push(localMessagePort && localMessagePort._obj || localMessagePort);
			this._obj.sendMessage.apply(this._obj, args);
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	RemoteMessagePort.prototype.declaredClass = 'Tizen.MessagePort.RemoteMessagePort';
	return RemoteMessagePort;
});