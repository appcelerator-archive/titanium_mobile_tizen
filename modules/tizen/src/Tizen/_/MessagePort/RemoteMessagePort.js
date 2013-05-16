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
			this._obj.sendMessage(data, localMessagePort ? localMessagePort._obj : localMessagePort);
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	RemoteMessagePort.prototype.declaredClass = 'Tizen.MessagePort.RemoteMessagePort';
	return RemoteMessagePort;
});