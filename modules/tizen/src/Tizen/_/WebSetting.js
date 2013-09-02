// Wraps Tizen module "WebSetting".

define(['Ti/_/lang', 'Ti/_/Evented'], function(lang, Evented) {

	function errorCallback(e, callback) {
		callback({
			code: e.code,
			error: e.type + ': ' + e.message,
			success: false
		});
	}

	return lang.mixProps(require.mix({}, Evented), {

		setUserAgentString: function(value /*DOMString*/, callback) {
			tizen.websetting.setUserAgentString(value, callback && function() {
				callback({
					code: 0,
					success: true
				});
			}, callback && function(e) {
				errorCallback(e, callback);
			});
		},

		removeAllCookies: function(callback) {
			tizen.websetting.removeAllCookies(callback && function() {
				callback({
					code: 0,
					success: true
				});
			}, callback && function(e) {
				errorCallback(e, callback);
			});
		}
	}, true);
});
