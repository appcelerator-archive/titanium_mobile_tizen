define(["Ti/_/declare", "Ti/_/lang", "Ti/_/Evented"], function(declare, lang, Evented) {
	return lang.setObject("Ti.UI.Tizen", Evented, {		
		hideSoftKeyboard: function(obj) {
			obj.blur();
		},
		
		constants: {
			SOFT_KEYBOARD_DEFAULT_ON_FOCUS: 1,
			SOFT_KEYBOARD_SHOW_ON_FOCUS: 2,
			SOFT_KEYBOARD_HIDE_ON_FOCUS: 3,
			LINKIFY_ALL : 1,
			LINKIFY_EMAIL_ADDRESSES : 2,
			LINKIFY_WEB_URLS : 3,
			LINKIFY_PHONE_NUMBERS : 4
		}
	});
});