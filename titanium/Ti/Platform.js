define(['Ti/_', 'Ti/_/browser', 'Ti/_/Evented', 'Ti/_/lang', 'Ti/Locale', 'Ti/_/dom', 'Ti/UI'],
	function(_, browser, Evented, lang, Locale, dom, UI) {

	var doc = document,
		midName = 'ti:mid',
		matches = doc.cookie.match(new RegExp('(?:^|; )' + midName + '=([^;]*)')),
		mid = matches ? decodeURIComponent(matches[1]) : void 0,
		unloaded,
		on = require.on,
		deviceCapabilities = tizen.systeminfo.getCapabilities(),
		hiddenIFrame = dom.create('iframe', { id: 'urlOpener', style: { display: 'none' } }, doc.body);

	mid || (mid = localStorage.getItem(midName));
	mid || localStorage.setItem(midName, mid = _.uuid());

	function saveMid() {
		if (!unloaded) {
			unloaded = 1;
			// expire cookie in 20 years... forever in mobile terms
			doc.cookie = midName + '=' + encodeURIComponent(mid) + '; expires=' + (new Date(Date.now() + 63072e7)).toUTCString();
			localStorage.setItem(midName, mid);
		}
	}

	function onErrorCallback(error) {
		console.error('An error occurred ' + error.message);
	}

	// Tizen listener for WiFi IP address.
	function onSuccessWifiNetworkCallback(wifiNetwork) {
		//receive SystemInfoWifiNetwork 
		if (wifiNetwork.status === 'ON') {
			Platform.constants.__values__.address = wifiNetwork.ipAddress;
		} else {
			Platform.constants.__values__.address = void 0;
		}
		console.log('Platform.address is set to ' + Platform.address);
	}

	// Tizen listener for Model.
	function onSuccessModelCallback(build) {
		Platform.constants.__values__.model = build.model;
	}

	function onSuccessBatteryCallback(battery) {
		Platform.constants.__values__.batteryMonitoring = true;
		Platform.constants.__values__.batteryLevel = battery.level * 100;
		Platform.constants.__values__.batteryState = battery.isCharging ?
			Platform.BATTERY_STATE_CHARGING :
			(battery.level === 1 ? Platform.BATTERY_STATE_FULL : Platform.BATTERY_STATE_UNPLUGGED);
	}

	on(window, 'beforeunload', saveMid);
	on(window, 'unload', saveMid);

	var nav = navigator,
		battery = nav.battery || nav.webkitBattery || nav.mozBattery,
		Platform = lang.setObject('Ti.Platform', Evented, {

			canOpenURL: function(url) {
				return !!url;
			},

			createUUID: _.uuid,

			is24HourTimeFormat: function() {
				return false;
			},

			openURL: function(url){
				if (/^([tel|sms|mailto])/.test(url)) {
					hiddenIFrame.contentWindow.location.href = url;
				} else {
					var win = UI.createWindow({
							layout: UI._LAYOUT_CONSTRAINING_VERTICAL,
							backgroundColor: '#888'
						}),
						backButton = UI.createButton({
							top: 2,
							bottom: 2,
							title: 'Close'
						}),
						webview = UI.createWebView({
							width: UI.FILL,
							height: UI.FILL
						});
					backButton.addEventListener('singletap', function(){
						win.close();
					});
					win.add(backButton);
					win.add(webview);
					win.open();
					setTimeout(function(){
						webview.url = url;
					}, 1);
				}
			},

			properties: {
				batteryMonitoring: false
			},

			constants: {
				BATTERY_STATE_CHARGING: 1,
				BATTERY_STATE_FULL: 2,
				BATTERY_STATE_UNKNOWN: -1,
				BATTERY_STATE_UNPLUGGED: 0,
				address: void 0,
				architecture: deviceCapabilities.platformCoreCpuArch,
				availableMemory: void 0,
				batteryLevel: void 0,
				batteryState: void 0,
				isBrowser: true,
				id: mid,
				locale: Locale,
				macaddress: void 0,
				model: nav.userAgent,
				name: deviceCapabilities.platformName,
				netmask: void 0,
				osname: 'tizen',
				ostype: nav.platform,
				runtime: browser.runtime,
				processorCount: void 0,
				username: void 0,
				version: deviceCapabilities.platformVersion
			}

		});

	battery && require.on(battery, 'chargingchange', function() {
		Platform.batteryMonitoring && Platform.fireEvent('battery', {
			level: Platform.batteryLevel,
			state: Platform.batteryState
		});
	});

	// Initialize Tizen platform data
	// tizen.systeminfo.getPropertyValue provides access to various Tizen platform info. 
	// However, this function is asynchronous.
	// Since we must implement the corresponding synchronous Titanium API, we will cache 
	// the data and synchronously return the cached copy to the Titanium programmer. The cache
	// will be kept up to date.
	// Get our application info.		
	try {
		// The unique ID for an installed application. Will not change while the app is running.
		Platform.constants.__values__.id = tizen.application.getAppInfo().id;
	} catch (e) {
		// The web simulator throws an exception, because id is undefined.
		// Initialize to something sane.
		Platform.constants.__values__.id = 'ID001';
	}

	if (deviceCapabilities.wifi) {
		// Initialize the WiFi info.
		tizen.systeminfo.getPropertyValue('WIFI_NETWORK', onSuccessWifiNetworkCallback, onErrorCallback);
		// Subscribe to WiFi property changes.
		tizen.systeminfo.addPropertyValueChangeListener('WIFI_NETWORK', onSuccessWifiNetworkCallback);
	}

	// Get model property. Will not change as the app is running.
	tizen.systeminfo.getPropertyValue('BUILD', onSuccessModelCallback, onErrorCallback);

	// Initialize battery info.
	tizen.systeminfo.getPropertyValue('BATTERY', onSuccessBatteryCallback, onErrorCallback);
	// Sunscribe to battery info changes.
	tizen.systeminfo.addPropertyValueChangeListener('BATTERY', onSuccessBatteryCallback);

	return Platform;

});
