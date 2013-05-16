define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/MessagePort/LocalMessagePort', 'Tizen/_/MessagePort/RemoteMessagePort'],
	function(lang, Evented, LocalMessagePort, RemoteMessagePort) {

		return lang.mixProps(require.mix({}, Evented), {

			requestLocalMessagePort: function(localMessagePortName /*DOMString*/) {
				return this._wrap(tizen.messageport.requestLocalMessagePort(localMessagePortName));
			},

			requestTrustedLocalMessagePort: function(localMessagePortName /*DOMString*/) {
				return this._wrap(tizen.messageport.requestTrustedLocalMessagePort(localMessagePortName));
			},

			requestRemoteMessagePort: function(appId /*ApplicationId*/, remoteMessagePortName /*DOMString*/) {
				return this._wrap(tizen.messageport.requestRemoteMessagePort(appId, remoteMessagePortName));
			},

			requestTrustedRemoteMessagePort: function(appId /*ApplicationId*/, remoteMessagePortName /*DOMString*/) {
				return this._wrap(tizen.messageport.requestTrustedRemoteMessagePort(appId, remoteMessagePortName));
			},

			_wrap: function(object) {
				if (object.toString() === '[object LocalMessagePort]') {
					return new LocalMessagePort(object);
				} else if (object.toString() === '[object RemoteMessagePort]') {
					return new RemoteMessagePort(object);
				} else {
					throw new Error('Object of unknown type');
				}
			}
		}, true);
	});