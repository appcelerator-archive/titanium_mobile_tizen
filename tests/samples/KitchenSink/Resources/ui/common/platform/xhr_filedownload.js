function xhr_download() {
	var win = Titanium.UI.createWindow();
	
	var ind=Titanium.UI.createProgressBar({
		width:200,
		height:50,
		min:0,
		max:1,
		value:0,
		top:10,
		message:'Downloading ' + (Ti.Platform.name == 'android'||Titanium.Platform.name == 'tizen'? 'PNG' : 'PDF') + ' File',
		font:{fontSize:12, fontWeight:'bold'},
		color:'#888'
	});
	
	Ti.Platform.name === 'iPhone' && (ind.style = Titanium.UI.iPhone.ProgressBarStyle.PLAIN);
	
	win.add(ind);
	ind.show();
	
	var b1 = Titanium.UI.createButton({
		title:'Set Web View (url)',
		height:40,
		width:200,
		top:70
	});
	win.add(b1);
	var c = null;
	
	b1.addEventListener('click', function()
	{
		ind.value = 0;
		c = Titanium.Network.createHTTPClient();
		c.setTimeout(10000);
		
		var filename;
		if (Titanium.Platform.name == 'android') {
			filename = 'test.png';
		} else if (Titanium.Platform.name == 'tizen') {
			filename = 'test.html';
			ind.message = 'Downloading html File';
		} else {
			filename = 'test.pdf';
		}
		
		c.onload = function()
		{
			Ti.API.info('IN ONLOAD ');
			ind.value = 1.0;
			var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
			if (Titanium.Platform.name == 'android') {
				f.write(this.responseData);
			}
			
			//WebView does`t work with HTML5-based files on Tizen/MobileWeb, only url to files on Tizen`s device or web.    
			var wv = Ti.UI.createWebView({
				url:f.nativePath,
				bottom:0,
				left:0,
				right:0,
				top:170
			});
			win.add(wv);
		};
		c.ondatastream = function(e)
		{
			ind.value = e.progress ;
			Ti.API.info('ONDATASTREAM1 - PROGRESS: ' + e.progress);
		};
		c.onerror = function(e)
		{
			Ti.API.info('XHR Error ' + e.error);
		};
	
		// open the client
		if (Titanium.Platform.name == 'android') {
			//android's WebView doesn't support embedded PDF content
			c.open('GET', 'http://developer.appcelerator.com/blog/wp-content/themes/newapp/images/appcelerator_avatar.png?s=48');
		} else if (Titanium.Platform.name == 'tizen') {
			c.open('GET','https://mobile.twitter.com/session/new');
			//Property "file" is path to file. It is not object "file" !!!
			//See documentation about Titanium.Network.HTTPClient
			c.file=filename; 
		}else {
			c.open('GET','http://www.appcelerator.com/assets/The_iPad_App_Wave.pdf');
			//Maybe it is wrong because "c.file" must be 'String'.  
			c.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,filename);
		}
		
		// send the data
		c.send();
	
	});
	
	var b2 = Titanium.UI.createButton({
		title:'Set Web View (data)',
		height:40,
		width:200,
		top:120
	});
	
	
	b2.addEventListener('click', function()
	{
		ind.value = 0;
		Titanium.Platform.name === 'tizen' && (ind.message = 'Downloading png File');
		
		c = Titanium.Network.createHTTPClient();

		c.onload = function()
		{
			var data;
			// Android only supports data of html-string
			if (Titanium.Platform.name == 'android') {
				//toBase64 ??? there is not this function in Blob
				var text = "<img src=\"data:image/png;base64," + this.responseData.toBase64() + "\" />";
				var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "test.html");
				f.write(text);
				data = f.read();
			} else if (Titanium.Platform.name == 'tizen') {
				//like Android but without "this.responseData.toBase64()" !!!
				var text = "<img src=\"" + this.responseData + "\" />";
				var f = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, "test.html");
				f.write(text);
				data = f.read();
			} else {
				data = this.responseData;
			}

			var wv = Ti.UI.createWebView({
				data:data,
				bottom:0,
				left:0,
				right:0,
				top:170
			});
			win.add(wv);
		};
		c.ondatastream = function(e)
		{
			ind.value = e.progress ;
			Ti.API.info('ONDATASTREAM2 - PROGRESS: ' + e.progress);
		};
	
		// open the client
		if (Titanium.Platform.name == 'android' || Titanium.Platform.name == 'tizen') {
			//android's WebView doesn't support embedded PDF content
			c.open('GET', 'http://developer.appcelerator.com/blog/wp-content/themes/newapp/images/appcelerator_avatar.png?s=48');
		} else {
			c.open('GET','http://www.appcelerator.com/assets/The_iPad_App_Wave.pdf');
		}
	
		// send the data
		c.send();
	});
	
	win.add(b2);
	
	var abort = Titanium.UI.createButton({
		title:'Abort',
		height:40,
		width:200,
		top:170
	});
	win.add(abort);
	
	abort.addEventListener('click', function()
	{
		if (!c)	{
			c = Titanium.Network.createHTTPClient();
		}
		
		c.abort();
		ind.value = 0;
	});
	
	var largeFile = Titanium.UI.createButton({
		title:'Large File Download',
		height:40,
		width:200,
		top:220
	});
	
	win.add(largeFile);
	
	
	largeFile.addEventListener('click', function()
	{
		ind.value = 0;
		c = Titanium.Network.createHTTPClient();
		c.setTimeout(10000);
		c.onload = function(e)
		{
			Ti.API.info("ONLOAD = "+e);
		};
		c.ondatastream = function(e)
		{
			ind.value = e.progress ;
			Ti.API.info('ONDATASTREAM1 - PROGRESS: ' + e.progress);
		};
		c.onerror = function(e)
		{
			Ti.UI.createAlertDialog({title:'XHR', message:'Error: ' + e.error}).show();
		};
		
		c.open('GET','http://titanium-studio.s3.amazonaws.com/latest/Titanium_Studio.exe');
		if ( Titanium.Platform.name !== 'tizen') {
			//Maybe it is wrong because "c.file" must be 'String'.  
			c.file = Titanium.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'tiStudio.exe');
		} else {
			ind.message = 'Downloading large file';

			//Property "file" is path to file. It is not object "file" !!!
			//See documentation about Titanium.Network.HTTPClient
			c.file = 'tiStudio.exe';
		}
		c.send();
	});
	
	
	return win;
};

module.exports = xhr_download;