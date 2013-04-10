define(['Ti/_', 'Ti/_/Evented', 'Ti/_/lang', 'Ti/Platform'], function(_, Evented, lang, Platform) {

	function initDisplayCaps() {
		// tizen.systeminfo.getPropertyValue provides access to various Tizen platform info. 
		// However, this function is asynchronous.
		// Since we must implement the corresponding synchronous Titanium API, we will cache 
		// the data and synchronously return the cached copy to the Titanium programmer. The cache
		// will be kept up to date.

		tizen.systeminfo.getPropertyValue('DISPLAY',
			onSuccessDisplayCallback,
			function(e){
				console.error('An error occurred: ' + e.message);
			});
		tizen.systeminfo.addPropertyValueChangeListener('DISPLAY', onSuccessDisplayCallback);
	}

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

	initDisplayCaps();

	return Platform.displayCaps = dc;

});