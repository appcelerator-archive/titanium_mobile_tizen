define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/MessagePort/RemoteMessagePort'], function(declare, Evented, RemoteMessagePort) {

	var listening,
		LocalMessagePort = declare(Evented, {

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
				isTrusted: {
					get: function() {
						return this._obj.isTrusted;
					}
				}
			},

			addEventListener: function() {
				var self = this;

				Evented.addEventListener.apply(this, arguments);

				if (!listening) {
					listening = true;

					this._obj.addMessagePortListener(function(data, remoteMsgPort) {
						self.fireEvent('received', {
							remoteMsgPort: new RemoteMessagePort(remoteMsgPort),
							data: data
						});
					});
				}
			}
		});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	LocalMessagePort.prototype.declaredClass = 'Tizen.MessagePort.LocalMessagePort';
	return LocalMessagePort;
});