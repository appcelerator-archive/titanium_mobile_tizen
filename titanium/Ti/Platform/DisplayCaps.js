define(['Ti/_', 'Ti/API', 'Ti/_/Evented', 'Ti/_/lang', 'Ti/Platform'], function(_, API, Evented, lang, Platform) {

	function onSuccessDisplayCallback(display) {
		dc.constants.__values__.xdpi = display.dotsPerInchWidth;
		dc.constants.__values__.ydpi = display.dotsPerInchHeight;
		dc.constants.__values__.dpi = Math.max(display.dotsPerInchHeight, display.dotsPerInchWidth);
		dc.constants.__values__.platformWidth = display.resolutionWidth;
		dc.constants.__values__.platformHeight = display.resolutionHeight;
	}

	var ua = navigator.userAgent.toLowerCase(),
		dc = lang.setObject('Ti.Platform.DisplayCaps', Evented, {
			constants: {
				density: function(){
					switch (ua) {
						case 'iphone':
							return 'medium';
						case 'ipad':
							return 'medium';
						default:
							return '';
					}
				},

				dpi: _.dpi,

				xdpi: void 0,
				ydpi: void 0,

				platformHeight: window.innerHeight,

				platformWidth: window.innerWidth
			}
		});

	tizen.systeminfo.getPropertyValue('DISPLAY',
		onSuccessDisplayCallback,
		function(e){
			API.error('An error occurred: ' + e.message);
		});
	tizen.systeminfo.addPropertyValueChangeListener('DISPLAY', onSuccessDisplayCallback);

	return Platform.displayCaps = dc;

});