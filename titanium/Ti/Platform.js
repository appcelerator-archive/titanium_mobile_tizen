define(['Ti/_', 'Ti/_/browser', 'Ti/_/Evented', 'Ti/_/lang', 'Ti/Locale', 'Ti/_/dom', 'Ti/UI'],
	function(_, browser, Evented, lang, Locale, dom, UI) {

	var doc = document,
		midName = 'ti:mid',
		matches = doc.cookie.match(new RegExp('(?:^|; )' + midName + '=([^;]*)')),
		mid = matches ? decodeURIComponent(matches[1]) : void 0,
		unloaded,
		on = require.on,
		deviceCapabilities = tizen.systeminfo.getCapabilities(),
		hiddenIFrame = dom.create('iframe', { id: 'urlOpener', style: { display: 'none' } }, doc.body),
		wifiNetworkPropertyValueChangeListenerId, batteryValueChangeListenerId;

	mid || (mid = localStorage.getItem(midName));
	mid || localStorage.setItem(midName, mid = _.uuid());

	function saveMid() {
		if (!unloaded) {
			unloaded = 1;
			// expire cookie in 20 years... forever in mobile terms
			doc.cookie = midName + '=' + encodeURIComponent(mid) + '; expires=' + (new Date(Date.now() + 63072e7)).toUTCString();
			localStorage.setItem(midName, mid);
		}
	};

	// initialize values that should be initialized via fucntions with callbacks
	function initPlatformData() {
		//Get our application info.
		//Workaround for simulator. It throws exception because id is undefined. On Emulator works fine.
		try {
			Platform.constants.__values__.id = tizen.application.getAppInfo().id; //The unique ID for an installed application. 
		} catch (e) {
			Platform.constants.__values__.id = 'ID001'; //The unique ID for an installed application. 
		}

		if(deviceCapabilities.wifi) {
			tizen.systeminfo.getPropertyValue('WIFI_NETWORK', onSuccessWifiNetworkCallback, onErrorCallback);
			// subscribing to WiFi property changes
			wifiNetworkPropertyValueChangeListenerId = tizen.systeminfo.addPropertyValueChangeListener('WIFI_NETWORK', onSuccessWifiNetworkCallback);
		}

		// Get model property
		tizen.systeminfo.getPropertyValue('BUILD', onSuccessModelCallback, onErrorCallback);

		// Get battery info 
		tizen.systeminfo.getPropertyValue('BATTERY', onSuccessBatteryCallback, onErrorCallback);
		batteryValueChangeListenerId = tizen.systeminfo.addPropertyValueChangeListener('BATTERY', onSuccessBatteryCallback);
	};

	function onErrorCallback(error) {
		Ti.API.error('An error occurred ' + error.message);
	};

	// Callback to update WiFi's IP address
	function onSuccessWifiNetworkCallback(wifiNetwork) {
		//receive SystemInfoWifiNetwork 
		try {
			if (wifiNetwork.status === 'ON') {
				Platform.constants.__values__.address = wifiNetwork.ipAddress;
			} else {
				Platform.constants.__values__.address = void 0;
			}
			Ti.API.info('Platform.address is set to ' + Platform.address);
		} catch (e) {
			Ti.API.error('Error on getting WifiNetwork info. Error: ' + e.message);
			Platform.constants.__values__.address = void 0;
		}
	}

	// Callback to set Model
	function onSuccessModelCallback(build) {
		try {
			Platform.constants.__values__.model = build.model;
		} catch (e) {
			Ti.API.info('Error on getting model info. Error: ' + e.message);
			Platform.constants.__values__.model = void 0;
		}
	}

	function onSuccessBatteryCallback(battery) {
		try {
			Platform.constants.__values__.batteryMonitoring = true;
			Platform.constants.__values__.batteryLevel = battery.level * 100;
			Platform.constants.__values__.batteryState = battery.isCharging 
				? Platform.BATTERY_STATE_CHARGING 
				: (battery.level === 1 ? Platform.BATTERY_STATE_FULL : Platform.BATTERY_STATE_UNPLUGGED); 
		} catch (e) {
			Ti.API.error('Error on getting battery info. Error: ' + e.message);
			Platform.constants.__values__.batteryMonitoring = false;
			Platform.constants.__values__.batteryLevel = void 0;
			Platform.constants.__values__.batteryState = Platform.BATTERY_STATE_UNKNOWN;
		}
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
				batteryMonitoring: false,
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

	initPlatformData();
	return Platform;

});
