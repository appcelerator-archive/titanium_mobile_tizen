function tizenSystemInfo(title) {
	var messageWin = require('ui/handheld/tizen/tizenToast'),
		//alertWin = require('ui/handheld/tizen/tizenAlert'),
		gBatteryListener;


	function getSystemProperty(property, onSuccess, onError) {
		try {
			if (tizen.systeminfo.isSupported(property)) {
				tizen.systeminfo.getPropertyValue(property, onSuccess, onError);
			} else {
				onError({message:"Property " + property + " not supported"})
			}
		} catch (e) {
			onError(e)
		}
	}

	function batteryMonitoringClicked(e){
		if  (e && e.rowData){
			if (batteryMonitoring.isOn)	{
				try {
					tizen.systeminfo.removePropertyValueChangeListener(gBatteryListener);
					e.rowData.title = batteryMonitoring.offCaption;
					messageWin.showToast(batteryMonitoring.offCaption,1500);
					batteryMonitoring.isOn = false;
				} catch(e) {
					messageWin.showToast("Exception on battery monitoring turning off! \n" + e.message,2500);
				}
			}else{
				try {
					gBatteryListener = tizen.systeminfo.addPropertyValueChangeListener("Power",
						function (power) {messageWin.showToast("Battery level: " + power.level,1500);},
						function (e) {messageWin.showToast("Battery monitoring error! \n" + e.message,2500);},
						// SystemInfoOptions object with threshold values
						{highThreshold: 0.9,lowThreshold: 0.2});

					e.rowData.title = batteryMonitoring.onCaption;
					messageWin.showToast(batteryMonitoring.onCaption,1500);
					batteryMonitoring.isOn = true;
				} catch(e) {
					messageWin.showToast("Exception on battery monitoring turning on! \n" + e.message,2500);
				}
			}
		}
	}

	function showDetailsDialog(propertyName, propertyDetailsHtml){
		var a = Titanium.UI.createAlertDialog({
			title: propertyName + ' details',
			message: propertyDetailsHtml,
			buttonNames: ['Go back to list']
		});
		a.show();
		//alertWin.showAlert(propertyName + ' details', propertyDetailsHtml, 'Go back to list')
	}

	var win = Ti.UI.createWindow({backgroundColor:'#fff'}),
		batteryMonitoring = {isOn: false, onCaption: 'Battery monitoring is on', offCaption:'Battery monitoring is off' },
		data = [
			{title:'Storage information', propertyName:'Storage', propertyCallback:onStorageSuccess},
			{title:'Power state', propertyName:'Power', propertyCallback:onPowerSuccess},
			{title:batteryMonitoring.offCaption, clickCallback:batteryMonitoringClicked},
			{title:'Cpu load', propertyName:'Cpu', propertyCallback:onCpuInfoSuccess},
			{title:'Display information', propertyName:'Display', propertyCallback:onDisplaySuccess},
			{title:'Device information', propertyName:'Device', propertyCallback:onDeviceSuccess},
			{title:'Current network type', propertyName:'Network', propertyCallback:onNetworkSuccess},
			{title:'Wifi network state', propertyName:'WifiNetwork', propertyCallback:onWifiSuccess},
			{title:'Cellular network state', propertyName:'CellularNetwork', propertyCallback:onCellSuccess},
			{title:'SIM information', propertyName:'SIM', propertyCallback:onSimSuccess}
		];
	// create table view
	for (var i = 0; i < data.length; i++ ) { data[i].color = '#000'; data[i].font = {fontWeight:'bold'} };
	var tableview = Titanium.UI.createTableView({data:data});

	// create table view event listener
	tableview.addEventListener('click', function(e){
		if (e)
		{
			if (e.rowData){
				var pName = e.rowData.propertyName;
				if (pName){
					getSystemProperty(pName, e.rowData.propertyCallback, function(er){showDetailsDialog(pName, '<b>API error:</b><br/>'+ er.message);})
				}else{
					if (e.rowData.clickCallback) e.rowData.clickCallback(e);
				}
			}}
	});

	win.add(tableview);
	return win;

	function onPowerSuccess(power) {
		showDetailsDialog('Power', formatSubLines(['Current level: ' + power.level, 'Charging: ' + (power.isCharging ? "Yes" : "No")]));
	}

	function onCpuInfoSuccess(cpu) {
		showDetailsDialog('Cpu', 'Load: ' + cpu.load);
	}

	function onStorageSuccess(storages) {
		var gInfo = '';

		for (var i = 0; i < storages.length; i++) {
			gInfo += formatHeader('Storage #' + (i + 1))+
				formatSubLine('Type: '+storages[i].type_)+
				formatSubLine('Capacity: ' + Math.floor(storages[i].capacity / 1000000) + ' MB')+
				formatSubLine('Available capacity: ' + Math.floor(storages[i].availableCapacity / 1000000) + ' MB')+
				formatSubLine('Removable: ' + (storages[i].isRemoveable ? "Yes" : "No"));
		}

		showDetailsDialog('Storage', gInfo);
	}

	function onDisplaySuccess(display) {
		var gInfo = formatHeader('Resolution')
			+ formatSubLines(['Width: ' + display.resolutionWidth, 'Height: ' + display.resolutionHeight])
			+ formatHeader('Dots per inch (DPI)')
			+ formatSubLines(['Horizontal: ' + display.dotsPerInchWidth, 'Vertical: ' + display.dotsPerInchHeight])
			+ formatHeader('Physical size')
			+ formatSubLines(['Width: ' + display.physicalWidth, 'Height: ' + display.physicalHeight])
			+ formatHeader('Brightness')
			+ formatSubLine('Current brightness: '+display.brightness);

		showDetailsDialog('Display', gInfo);
	}

	function onDeviceSuccess(device) {
		showDetailsDialog('Device', formatSubLines(['IMEI: ' + device.imei, 'Model: ' + device.model, 'Version: ' + device.version, 'Vendor: ' + device.vendor]));
	}

	function onNetworkSuccess(network) {
		var networkTypes = ["NONE", "2G", "2.5G","3G", "4G", "WIFI", "ETHERNET", "UNKNOWN"];
		showDetailsDialog('Network', formatSubLine("Current data network type: " + networkTypes[network.networkType]));
	}

	function onWifiSuccess(wifi) {
		showDetailsDialog('Wifi network', formatSubLines(["Status: " + wifi.status, "SSID: " + wifi.ssid, "IP address: " + wifi.ipAddress, "Signal strength: " + wifi.signalStrength]));
	}

	function onCellSuccess(cell) {
		showDetailsDialog('Cellular network', formatSubLines(
			["Status: " + cell.status,
				"Access Point Name (APN): " + cell.apn,
				"IP address: " + cell.ipAddress,
				"Mobile Country Code (MCC): " + cell.mcc,
				"Mobile Network Code (MNC): " + cell.mnc,
				"Cell ID: " + cell.cellid,
				"Location Area Code (LAC): " + cell.lac,
				"Roaming: " + (cell.isRoaming ? "Yes" : "No")]));
	}

	function onSimSuccess(sim) {
		showDetailsDialog('SIM', formatSubLines(
			["Operator Name String (ONS): " + sim.operatorName,
				"SIM card subscriber number: " + sim.msisdn,
				"Integrated Circuit Card ID: " + sim.iccid,
				"Mobile Country Code (MCC): " + sim.mcc,
				"Mobile Network Code (MNC): " + sim.mnc,
				"Mobile Subscription Identification Number (MSIN): " + sim.msin,
				"Service Provider Name (SPN): " + sim.spn]));
	}

	function formatHeader(headerName){
		return  '<b>' + headerName + '</b> <br />';
	}

	function formatSubLine(line){
		return  '<div style="text-align: left; width: 100%">' + line + '</div> <br/>';
	}

	function formatSubLines(lineArray){
		var result = '';
		for (var i = 0; i < lineArray.length; i++) {
			result += formatSubLine(lineArray[i]);
		}
		return  result;
	}
};

module.exports = tizenSystemInfo;
