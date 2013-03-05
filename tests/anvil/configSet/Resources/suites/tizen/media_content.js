/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		reportError;
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}
	
	this.name = 'media content';
	this.tests = [
		{name: 'mediaSourceAPI'},
		{name: 'getFolder', timeout: 15000},
		{name: 'findItemsInImages', timeout: 15000},
		{name: 'findImageByMediaType', timeout: 15000},
		{name: 'findImageByTitle', timeout: 15000},
		{name: 'findImageByTitleFailed', timeout: 15000},
		{name: 'findAudioByTitle', timeout: 15000},
		{name: 'updateImage', timeout: 15000},
		{name: 'updateAudio', timeout: 15000},
		{name: 'findVideoByMediaType', timeout: 15000},
		{name: 'updateItemsBatch', timeout: 15000}
	]
	
	//helpers
	var finishError = function (testRun,errorMsg) {
		Ti.API.info('The following error occurred: ' +  errorMsg);
		reportError(testRun,'The following error occurred: ' +  errorMsg);
		finish(testRun);
	},
	
	removeFileFrom = function(testRun, destFolderName, fileName, nextCallback) {
		function errorCB(e){
			finishError(testRun, e.message);
		};
		
		function successCB(dir) {
			function successRemoved(){
				Ti.API.info('file ' + fileName +' removed');
				//pause for refreshing of media content
				setTimeout(function(){nextCallback && nextCallback(testRun);}, 2000);
			}

			try {
				dir.deleteFile(destFolderName+'/'+fileName, successRemoved, errorCB);
			} catch(e) {
				errorCB(e);
			}
		};

		Ti.Tizen.Filesystem.resolve(destFolderName, successCB, errorCB, 'rw');
	},
		
	copyFileTo = function(testRun, destFolderName, pathFrom, fileName, nextCallback) {

		// This function copies a file from the Local Storage to one of the
		// virtual roots of Tizen.
		// Note:
		// - Titanium.Filesystem.FileStream can open Local Storage files, but cannot open filesystem files.
		// - tizen.Filesystem.File cannot open Local Storage files, but can open filesystem files.
		// This is why, in order to copy the file from Local Storage to the desired location (that
		// MediaContent knows about), we have to use intermediate steps:
		// - open a Titanium file and read data;
		// - encode it in memory to base64, otherwise binary data will be mangled;
		// - write it to a Tizen file.

		var blob = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, pathFrom + '/' + fileName).read();
		function errorCB(e){
			finishError(testRun,e.message);
		};
		function successCB(dir) {
			var writeToStream = function (fileStream) {
				var res = '';
				for(var i= 0, len = blob._data.length; i<len; i++) {
					var charcode = blob._data.charCodeAt(i) & 255;
					res+= String.fromCharCode(charcode);
				}
				try {
					fileStream.writeBase64(btoa(res));
				} catch(e) {
					Ti.API.info('writeBase64: '+e.message);
				}
				fileStream.close();
				//pause for refreshing of media content
				setTimeout(function(){nextCallback && nextCallback(testRun)}, 2000);
			};

			try {
				dir.createFile(fileName).openStream('rw', writeToStream,errorCB);
			} catch(e){
				errorCB(e);
			}
		};
		Ti.API.info(destFolderName);
		Ti.API.info(pathFrom);
		Ti.API.info(fileName);

		Ti.Tizen.Filesystem.resolve(destFolderName, successCB, errorCB, 'rw');
	},

	check_media_types = function(testRun, item) {
		valueOf(testRun, item.title).shouldBeString();
		valueOf(testRun, item.contentURI).shouldBeString();
		valueOf(testRun, item.mimeType).shouldBeString();
		valueOf(testRun, item.id).shouldBeString();
		valueOf(testRun, item.size).shouldBeNumber();
		valueOf(testRun, item.type).shouldBeString();
		valueOf(testRun, item.releaseDate).shouldBeObject();
		valueOf(testRun, item.modifiedDate).shouldBeObject();
		valueOf(testRun, item.description).shouldBeString();
		valueOf(testRun, item.rating).shouldBeNumber();
		valueOf(testRun, item.thumbnailURIs[0]).shouldBeString();

		if (item.type == 'IMAGE') {
			valueOf(testRun, item.type).shouldBe('IMAGE');
			valueOf(testRun, item.width).shouldBeNumber();
			valueOf(testRun, item.height).shouldBeNumber();
			valueOf(testRun, item.geolocation.latitude).shouldBeNumber();
			valueOf(testRun, item.geolocation.longitude).shouldBeNumber();
		} else if (item.type == 'VIDEO') {
			valueOf(testRun, item.type).shouldBe('VIDEO');
			valueOf(testRun, item.width).shouldBeNumber();
			valueOf(testRun, item.height).shouldBeNumber();
			//valueOf(testRun, item.album).shouldBeString();
			//valueOf(testRun, item.artist).shouldBeString();
			valueOf(testRun, item.duration).shouldBeNumber();
			valueOf(testRun, item.playedTime).shouldBeNumber();
			valueOf(testRun, item.playCount).shouldBeNumber();
		} else if (item.type == 'AUDIO') {
			valueOf(testRun, item.type).shouldBe('AUDIO');
			valueOf(testRun, item.album).shouldBeString();
			valueOf(testRun, item.artists[0]).shouldBeString();
			valueOf(testRun, item.composers[0]).shouldBeString();
			valueOf(testRun, item.genres[0]).shouldBeString();
			valueOf(testRun, item.copyright).shouldBeString();
			valueOf(testRun, item.bitrate).shouldBeNumber();
			valueOf(testRun, item.trackNumber).shouldBeNumber();
			valueOf(testRun, item.duration).shouldBeNumber();
			valueOf(testRun, item.playedTime).shouldBeNumber();
			valueOf(testRun, item.playCount).shouldBeNumber();
		}
	};

	//Tests
	this.mediaSourceAPI = function(testRun) {
		valueOf(testRun, Ti.Tizen.Content).shouldNotBeNull();

		valueOf(testRun, Ti.Tizen.Content.getDirectories).shouldBeFunction();
		valueOf(testRun, Ti.Tizen.Content.update).shouldBeFunction();
		valueOf(testRun, Ti.Tizen.Content.updateBatch).shouldBeFunction();
		valueOf(testRun, Ti.Tizen.Content.find).shouldBeFunction();

		Ti.API.info('Finish');
		finish(testRun);
	};

	this.getFolder = function(testRun) {
		function test() {
			Ti.API.info('Start getFolder');
			var mediaSource;
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message)});
			}

			function getFolderCB(folders){
				valueOf(testRun, folders.length).shouldBeGreaterThan(0);//at least images
				valueOf(testRun, folders[0].id).shouldNotBeNull();
				valueOf(testRun, folders[0].directoryURI).shouldNotBeNull();
				valueOf(testRun, folders[0].title).shouldNotBeNull();
				valueOf(testRun, folders[0].storageType).shouldNotBeNull();

				//debug print
				for (var i in folders) {
					Ti.API.info('folder id:'+folders[i].id+'; uri'+folders[i].directoryURI + '; title:'+folders[i].title+'; storageType:'+folders[i].storageType);
				}

				//clear and finish
				clear_finish();
			}

			Ti.Tizen.Content.getDirectories(getFolderCB, errorCB);
		}

		//Start: copy file to opt/media/images and test
		copyFileTo(testRun,'images','suites/tizen/images', 'img1_for_anvil.png', test);
	};

	this.findItemsInImages = function(testRun) {
		function test() {
			Ti.API.info('Start findItemsInImages');
			var mediaSource;
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message);});
			}

			function getFolderCB(folders){
				function browseItemsInFolder(items) {
					//Check that array is not empty
					if (!items || items.length == 0) {
						errorCB({message:'Array items is empty'});
						return;
					}

					//debug print
					for (var i = 0; i < items.length; i++) {
						Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
					}
					valueOf(testRun, items.length).shouldBeGreaterThan(0);

					check_media_types(testRun,items[0]);

					//clear and finish
					clear_finish();
				}

				var isFolderExisted, i;
				for (i in folders) {
					Ti.API.info('folder id:' + folders[i].id + '; uri'+ folders[i].folderURI + '; title:' + folders[i].title + '; storageType:' + folders[i].storageType);
					if (folders[i].title == 'Images') {
						isFolderExisted = true;
						Ti.Tizen.Content.find(browseItemsInFolder, errorCB, folders[i].id);
						break;
					}
				}

				if (!isFolderExisted) {
					errorCB( {message: 'Folder hasn`t been found'} );
				}
			}

			Ti.Tizen.Content.getDirectories(getFolderCB,errorCB);
		}

		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};

	this.findImageByMediaType  = function(testRun) {
		function test() {
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function() { finishError(testRun,e.message); });
			}

			function successCB(items) {

				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.ImageContent).shouldBeTrue();

				//Check that array is not empty
				if (!items || items.length == 0) {
					errorCB({message:'Array items is empty'});
					return;
				}
				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.Content).shouldBeTrue();
				//debug print
				for (var i = 0, len = items.length; i < len; i++) {
					Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
				}
				valueOf(testRun, items.length).shouldBeGreaterThan(0);
				check_media_types(testRun,items[0]);

				//clear and finish
				clear_finish();
			}
			var mediaType = 'IMAGE',
				count = 1,
				offset = 0,
				filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'type',
					matchFlag: 'EXACTLY',
					matchValue: mediaType
				});

			// Find
			Ti.Tizen.Content.find(successCB, errorCB, null, filter, null, count, offset);
		}

		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};

	this.findImageByTitle  = function(testRun) {
		function test() {
			Ti.API.info('Start findImageByTitle');
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {

				//Check that array is not empty
				if (!items || items.length == 0) {
					// Test currently fails here, because (from the Tizen documentation):
					// "If a content file is copied or moved, you cannot find the content items because a scan is not
					// performed automatically in this version. In the next version, the feature will be added."
					// (https://developer.tizen.org/help/topic/org.tizen.web.appprogramming/html/guide/content_guide/mediacontent.htm)
					errorCB({message:'Array items is empty'});
					return;
				}

				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.ImageContent).shouldBeTrue();

				//debug print
				for (var i = 0, len = items.length; i < len; i++) {
					Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
				}
				valueOf(testRun, items.length).shouldBeGreaterThan(0);

				check_media_types(testRun,items[0]);

				//clear and finish
				clear_finish();
			}

			// Create filter and find
			var filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'title',
					matchFlag: 'EXACTLY',
					matchValue: 'img1_for_anvil.png'
				});

			Ti.Tizen.Content.find(successCB,errorCB, null, filter);
		}

		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};

	this.findImageByTitleFailed  = function(testRun) {
		Ti.API.info('Start findImageByTitleFailed');
		function test() {
			function errorCB(e) {
				finishError(testRun, e.message);
			}

			function successCB(items) {
				valueOf(testRun, items.length).shouldBeZero(0);
				finish(testRun);
			}

			// Create filter and find
			var filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'title',
					matchFlag: 'EXACTLY',
					matchValue: 'img1_for_anvil.png'
				});

			Ti.Tizen.Content.find(successCB, errorCB, null, filter);
		}

		test();
	};

	this.updateImage  = function(testRun) {
		Ti.API.info('Start updateImage');
		function test() {
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function() {finishError(testRun,e.message);});
			}

			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					// Test currently fails here, because (from the Tizen documentation):
					// "If a content file is copied or moved, you cannot find the content items because a scan is not
					// performed automatically in this version. In the next version, the feature will be added."
					// (https://developer.tizen.org/help/topic/org.tizen.web.appprogramming/html/guide/content_guide/mediacontent.htm)
					errorCB({message:'Array items is empty'});
					return;
				}

				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.ImageContent).shouldBeTrue();

				var item = items[0], i = 0, len = items.length;

				//debug print
				for (; i < len; i++) {
					Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
				}
				//update
				if (!isUpdated) {
					if (item.editableAttributes.indexOf('rating') >= 0) {
						try {
							rating = item.rating;
							item.rating++;
							Ti.Tizen.Content.update(item);
							isUpdated = true;
						} catch(e) {
							return errorCB(e);
						}
					} else {
						return errorCB( {message: 'Property "rating" is not editable'} );
					}

					//find again
					Ti.Tizen.Content.find(successCB,errorCB, null, filter);
				} else {
					//check rating
					valueOf(testRun, item.rating).shouldBe(rating+1);
					//clear and finish
					clear_finish();
				}
			}

			var isUpdated,
				rating = 0,
				filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'title',
					matchFlag: 'EXACTLY',
					matchValue: 'img1_for_anvil.png'
				});
			Ti.Tizen.Content.find(successCB,errorCB, null, filter);
		}
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};

	//Fails TDIST-160 - https://bugs.tizen.org/jira/browse/TDIST-160
	this.updateAudio  = function(testRun) {
		function test() {
			Ti.API.info('Start updateAudio');
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'music','Kalimba.mp3', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'music','Kalimba.mp3', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {

				//Check that array is not empty
				if (!items || items.length == 0) {
					// Test currently fails here, because (from the Tizen documentation):
					// "If a content file is copied or moved, you cannot find the content items because a scan is not
					// performed automatically in this version. In the next version, the feature will be added."
					// (https://developer.tizen.org/help/topic/org.tizen.web.appprogramming/html/guide/content_guide/mediacontent.htm)
					errorCB({message:'Array items is empty'});
					return;
				}

				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.AudioContent).shouldBeTrue();

				var item = items[0], i = 0, len = items.length;
				//debug print
				for (; i < len; i++) {
					Ti.API.info('Title=' + items[i].title + '; description=' + items[i].description + '; playCount=' + items[i].playCount+ '; rating=' + items[i].rating);
				}

				//update
				if (!isUpdated) {
					//editable attributes
					valueOf(testRun, item.editableAttributes.length ).shouldBeGreaterThan(0);
					//other properties
					check_media_types(testRun,item);

					try {
						item.playCount=1;
						item.rating=1;
						item.description = 'updated';
						item.title = 'title changed';
						Ti.Tizen.Content.update(item);
						isUpdated = true;
					} catch(e) {
						return errorCB(e);
					}
					//find again
					Ti.Tizen.Content.find(successCB,errorCB, null, filter);
				} else {
					//check rating
					valueOf(testRun, item.rating).shouldBe(1);
					valueOf(testRun, item.playCount).shouldBe(1);//it is not changed !!!
					//clear and finish
					clear_finish();
				}
			}

			var isUpdated,
				mediaType = 'AUDIO',
				filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'type',
					matchFlag: 'EXACTLY',
					matchValue: mediaType
				});

			Ti.Tizen.Content.find(successCB,errorCB, null, filter);
		}

		//Start: copy file to opt/media/sounds and test
		copyFileTo(testRun, 'music', 'suites/tizen/sounds', 'Kalimba.mp3', test);//we must write 'music' instead of 'sounds', Why ???
	};

	//Fails TDIST-160 - https://bugs.tizen.org/jira/browse/TDIST-160
	this.updateItemsBatch = function(testRun) {
		function test() {
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'music','Kalimba.mp3', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'music','Kalimba.mp3', function() { finishError(testRun,e.message); });
			}

			function successCB(items) {

				//Check that array is not empty
				if (!items || items.length == 0) {
					// Test currently fails here, because (from the Tizen documentation):
					// "If a content file is copied or moved, you cannot find the content items because a scan is not
					// performed automatically in this version. In the next version, the feature will be added."
					// (https://developer.tizen.org/help/topic/org.tizen.web.appprogramming/html/guide/content_guide/mediacontent.htm)
					finishError(testRun,'Array items is empty');
				}

				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.AudioContent).shouldBeTrue();

				//debug print
				var item = items[0],
					i = 0,
					len = items.length;

				for (; i < len; i++) {
					Ti.API.info('Title=' + items[i].title + '; playCount=' + items[i].playCount + '; rating=' + items[i].rating);
				}

				//updateBatch, clear and finish
				if (!isUpdated) {
					item.playCount = 1;
					item.rating = 1;
					item.description = 'updateBatch';
					isUpdated = true;
					Ti.Tizen.Content.updateBatch([item], find/*find again*/, errorCB);
				} else {
					//check rating
					valueOf(testRun, item.rating).shouldBe(1);
					valueOf(testRun, item.playCount).shouldBe(1);//it is not changed !!!
					//clear and finish
					clear_finish();
				}
			}

			function find() {
				Ti.Tizen.Content.find(successCB,errorCB, null, filter);
			}

			var isUpdated,
				mediaType = 'AUDIO',
				filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'type',
					matchFlag: 'EXACTLY',
					matchValue: mediaType
				});

			find();
		}
		//Start: copy file to opt/media/sounds and test
		copyFileTo(testRun, 'music', 'suites/tizen/sounds', 'Kalimba.mp3', test);//we have to write 'music' instead of 'sounds', Why ?
	};

	this.findVideoByMediaType  = function(testRun) {
		function test() {
			Ti.API.info('Start findVideoByMediaType');
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'videos','video_for_anvil.mp4', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'videos','video_for_anvil.mp4', function() { finishError(testRun,e.message); });
			}

			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					// Test currently fails here, because (from the Tizen documentation):
					// "If a content file is copied or moved, you cannot find the content items because a scan is not
					// performed automatically in this version. In the next version, the feature will be added."
					// (https://developer.tizen.org/help/topic/org.tizen.web.appprogramming/html/guide/content_guide/mediacontent.htm)
					errorCB({message:'Array items is empty'});
					return;
				}

				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.VideoContent).shouldBeTrue();

				//debug print
				for (var i = 0, len = items.length; i < len; i++) {
					Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
				}

				valueOf(testRun, items.length).shouldBeGreaterThan(0);
				check_media_types(testRun,items[0]);

				//clear and finish
				clear_finish();
			}

			//source
			var mediaType = 'VIDEO',
				count = 1,
				offset = 0,
				filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'type',
					matchFlag: 'EXACTLY',
					matchValue: mediaType
				});

			Ti.Tizen.Content.find(successCB, errorCB, null, filter, null, count, offset);
		}
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'videos', 'suites/tizen/videos', 'video_for_anvil.mp4', test);
	};

	this.findAudioByTitle  = function(testRun) {
		function test() {
			Ti.API.info('Start findAudioByTitle');
			function clear_finish() {
				Ti.API.info('Finish');
				removeFileFrom(testRun, 'music','Kalimba.mp3', finish);
			}

			function errorCB(e) {
				removeFileFrom(testRun, 'music','Kalimba.mp3', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {

				// Check that array is not empty
				if (!items || items.length == 0) {
					// Test currently fails here, because (from the Tizen documentation):
					// "If a content file is copied or moved, you cannot find the content items because a scan is not
					// performed automatically in this version. In the next version, the feature will be added."
					// (https://developer.tizen.org/help/topic/org.tizen.web.appprogramming/html/guide/content_guide/mediacontent.htm)
					finishError(testRun,'Array items is empty');
				}

				valueOf(testRun, items[0] instanceof Ti.Tizen.Content.AudioContent).shouldBeTrue();
				
				for (var i = 0, len = items.length; i < len; i++) {
					Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
				}
				
				check_media_types(testRun,items[0]);

				clear_finish();
			}
			
			// Create filter and find by title
			var filter = Ti.Tizen.createAttributeFilter({
					attributeName: 'title',
					matchFlag: 'EXACTLY',
					matchValue: 'Kalimba'
				});

			Ti.Tizen.Content.find(successCB,errorCB, null, filter);
		}

		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'music', 'suites/tizen/sounds', 'Kalimba.mp3', test);
	};
}
