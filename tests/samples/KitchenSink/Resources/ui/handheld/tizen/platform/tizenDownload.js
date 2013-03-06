function tizenDownload(title) {
	var messageWin = require('ui/handheld/tizen/tizenToast'),
		downloadId; // we we'll keep it undefined all time we are not downloading anything

	// simplify similar buttons creation
	function createButton(title, top, clickHandler) {
		var result = Titanium.UI.createButton({
			title: title,
			top: top,
			height: 39,
			width: '100%'
		});

		result.addEventListener('click', clickHandler);
		return result;
	}

	// simplify similar labels creation
	function createLabel(text, top){
		return Ti.UI.createLabel({
			text: text,
			color: '#000',
			textAlign: 'left',
			font: { fontSize: 12, fontWeight: 'bold' },
			top: top,
			height: 'auto',
			width: 'auto'
		});
	}

	var win = Ti.UI.createWindow({backgroundColor: '#fff'}),
		urlLabel = createLabel('Type here Url to download:', 10),
		statusLabel = createLabel('Start download to see status...', 290),
		stateLabel = createLabel('Download not started yet.', 330),
		startButton = createButton('start download', 70, function() { startDownload(); }),
		pauseButton = createButton('pause download', 110, function() { downloadId && Ti.Tizen.Download.pause(downloadId); }),
		resumeButton = createButton('resume download', 150, function() { downloadId && Ti.Tizen.Download.resume(downloadId) }),
		stopButton = createButton('stop download', 190, function(){ downloadId && Ti.Tizen.Download.cancel(downloadId); }),
		urlTextField = Titanium.UI.createTextField({
			value: 'http://download.tizen.org/sdk/InstallManager/tizen-sdk-2.0-ubuntu32.bin',
			top: 30,
			backgroundColor: 'white',
			color: 'black',
			height: 39,
			width: '100%',
			borderStyle: Ti.UI.INPUT_BORDERSTYLE_LINE
		});

	win.add(startButton);
	win.add(pauseButton);
	win.add(resumeButton);
	win.add(stopButton);
	win.add(statusLabel);
	win.add(stateLabel);
	win.add(urlLabel);
	win.add(urlTextField);

	checkState();
	return win;

	function startDownload(){
		// Listener object must be "local" for call "Ti.Tizen.Download.start". Don't move this declaration it out of this function.
		var listener = {
			onprogress : function(id, receivedSize, totalSize) {
				Titanium.API.info('"onprogress" event. id=' + id + ', receivedSize=' + receivedSize + ', totalSize=' + totalSize);
				var percentString = (totalSize > 0) ? String.formatDecimal((receivedSize * 100 / totalSize), '##.##' ) + '% ' : '';
				statusLabel.text = 'Completed ' + percentString + '['+receivedSize + '/' + totalSize + ' bytes]';
				checkState();
			},
			onpaused : function(id) {
				Titanium.API.info('"onpaused" event.');
				messageWin.showToast('Download paused. ', 3000);
				checkState();
			},
			oncanceled : function(id) {
				Titanium.API.info('"oncanceled" event.');
				messageWin.showToast('Download canceled. ', 3000);
				downloadId = void 0;
				checkState();
			},
			oncanceled : function(id, fullPath) {
				Titanium.API.info('"oncompleted" event.');
				messageWin.showToast('Download completed. Saved to file: ' + fullPath, 5000);
				downloadId = void 0;
				checkState();
			},
			onfailed : function(id, error) {
				Titanium.API.info('"onfailed" event.');
				messageWin.showToast('Download failed with error: ' + error.name, 3000);
				downloadId = void 0;
				checkState();
			}
		};

		try{
			if (downloadId){
				messageWin.showToast('Please, stop current download before start new one.', 3000);
			}else{
				var urlDownload = Ti.Tizen.Download.createDownloadRequest({
					url: urlTextField.value,
					//destination: 'wgt-private-tmp',
					destination: 'documents',
					fileName: 'tmp' + (new Date().getTime())
				});
				statusLabel.text = 'Starting...';
				downloadId = Ti.Tizen.Download.start(urlDownload, listener);
				Titanium.API.info('Download started. downloadId=' + downloadId);
				Titanium.API.info('Download started. State=' + Ti.Tizen.Download.getState(downloadId));
			}
		}catch(e) {
			messageWin.showToast('Exception on start download! /n' + e.message, 2500);
		}

		checkState();
	}

	// checks current download state and updates buttons and messages states according to it.
	function checkState(){
		try{
			// as downloadId has value only on some download in progress(or paused)
			// we can get basic states from it
			startButton.enabled = !downloadId;
			stopButton.enabled = !!downloadId;

			// state can be: "PAUSED", "ABORTED", "COMPLETED", "DOWNLOADING", "QUEUED"
			var state =  downloadId ? Ti.Tizen.Download.getState(downloadId) : 'NONE';
			stateLabel.text = 'current download state: ' + state;
			Titanium.API.info('current download state: ' + state);

			pauseButton.enabled = (state === 'DOWNLOADING');
			resumeButton.enabled = (state === 'PAUSED');
		}catch(e) {
			messageWin.showToast('Exception! ' + e.message, 2500);
			// on error reset download and state.
			downloadId = undefined;
			checkState();
		}
	}
};

module.exports = tizenDownload;