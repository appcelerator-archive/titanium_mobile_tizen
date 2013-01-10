define(["Ti/_/declare", "Ti/_/lang", "Ti/_/Evented"], function(declare, lang, Evented) {
	return lang.setObject("Ti.UI.Tizen", Evented, {	
		constants: {
			LINKIFY_ALL : 1,
			LINKIFY_EMAIL_ADDRESSES : 2,
			LINKIFY_WEB_URLS : 3,
			LINKIFY_PHONE_NUMBERS : 4
		}
	});
});