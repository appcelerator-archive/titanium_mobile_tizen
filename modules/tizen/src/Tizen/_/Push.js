define(['Ti/_/lang', 'Tizen/_/Package/PackageInformation', 'Ti/_/Evented'], function(lang, PushMessage, Evented) {

	function onError (e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

	return lang.mixProps(require.mix({}, Evented), {

		registerService: function(appControl /*ApplicationControl*/, callback /*PushRegisterSuccessCallback*/) {
			tizen.push.registerService(appControl._obj, callback && function(registrationId) {
				callback({
					code: 0,
					success: true,
					id: registrationId
				});
			}, callback && function(e) {
				onError(e, callback);
			});
		},

		unregisterService: function(callback /*SuccessCallback*/) {
			tizen.push.unregisterService(callback && function() {
				callback({
					code: 0,
					success: true
				});
			}, callback && function(e) {
				onError(e, callback);
			});
		},

		connectService: function(callback /*PushNotificationCallback*/) {
			return tizen.push.connectService(callback && function(pushMessage) {
				callback({
					code: 0,
					success: true,
					message: new PushMessage(pushMessage)
				});
			});
		},

		disconnectService: function() {
			tizen.push.disconnectService();
		},

		getRegistrationId: function() {
			return tizen.push.getRegistrationId();
		},


	}, true);
});