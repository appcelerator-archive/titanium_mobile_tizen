define(['Ti/_/Evented', 'Ti/_/lang', 'Ti/UI', 'Ti/_/ready'], function(Evented, lang, UI, ready) {

	var win = window,
		on = require.on,
		lastOrient = null,
		lastShake = Date.now(),
		lastAccel = {},
		api = lang.setObject('Ti.Gesture', Evented, {
			_updateOrientation: function() {
				getWindowOrientation();
				lastOrient !== api.orientation && api.fireEvent('orientationchange', {
					orientation: lastOrient = api.orientation
				});
			},

			isLandscape: function() {
				return api.landscape;
			},

			isPortrait: function() {
				return api.portrait;
			},

			constants: {
				portrait: false,
				landscape: false,
				orientation: UI.UNKNOWN
			}
		});

	function getWindowOrientation() {
		var landscape = !!(window.innerWidth && (window.innerWidth > window.innerHeight));
		api.constants.__values__.orientation = landscape ? UI.LANDSCAPE_LEFT : UI.PORTRAIT;
		api.constants.__values__.landscape = landscape;
		api.constants.__values__.portrait = !landscape;
		return api.orientation;
	}
	ready(function() {
		getWindowOrientation();
	});

	on(win, 'devicemotion', function(evt) {
		var e = evt.acceleration || evt.accelerationIncludingGravity,
			x, y, z,
			currentTime,
			accel = e && {
				x: e.x,
				y: e.y,
				z: e.z,
				source: evt.source
			};

		if (accel) {
			if (lastAccel.x !== void 0) {
				x = Math.abs(lastAccel.x - accel.x) > 10;
				y = Math.abs(lastAccel.y - accel.y) > 10;
				z = Math.abs(lastAccel.z - accel.z) > 10;
				if ((x && (y || z)) || (y && z)) {
					currentTime = Date.now();
					if ((accel.timestamp = currentTime - lastShake) > 300) {
						lastShake = currentTime;
						api.fireEvent('shake', accel);
					}
				}
			}
			lastAccel = accel;
		}
	});

	tizen.systeminfo.addPropertyValueChangeListener('DEVICE_ORIENTATION', function (e) {
		var orient = null,
			status = e.status;
		if (status === 'PORTRAIT_PRIMARY') {
			orient = UI.PORTRAIT;
		} else if (status === 'PORTRAIT_SECONDARY') {
			orient = UI.UPSIDE_PORTRAIT;
		} else if (status === 'LANDSCAPE_PRIMARY') {
			orient = UI.LANDSCAPE_LEFT;
		} else {
			orient = UI.LANDSCAPE_RIGHT;
		}
		if (orient !== lastOrient) {
			api.fireEvent('orientationchange', {
				orientation: lastOrient = orient
			});
		}
	});

	return api;

});