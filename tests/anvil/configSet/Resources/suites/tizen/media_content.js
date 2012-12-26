/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish;
	var valueOf;
	var reportError;
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}
	
	this.name = "media content";
	this.tests = [
		 {name: "mediaSourceAPI"}
		,{name: "getFolder", timeout: 15000}
		,{name: "findItemsInImages",timeout: 15000}
		,{name: "findImageByMediaType", timeout: 15000}
		,{name: "findImageByTitle", timeout: 15000}
		,{name: "findImageByTitleFailed", timeout: 15000}
		,{name: "findAudioByTitle", timeout: 15000}
		,{name: "updateImage", timeout: 15000}
		,{name: "updateAudio", timeout: 15000}
		,{name: "findVideoByMediaType", timeout: 15000}
		,{name: "updateItemsBatch", timeout: 15000}
	]
	
	//helpers
	var finishError = function (testRun,errorMsg){
		Ti.API.info('The following error occurred: ' +  errorMsg);
		reportError(testRun,'The following error occurred: ' +  errorMsg);
		finish(testRun);
	};
	
	var removeFileFrom = function(testRun, destFolderName, fileName, nextCallback) {
		function errorCB(e){
			finishError(testRun, e.message);
		};
		
		function successCB(dir) {
			function successRemoved(){
				Ti.API.info('file ' + fileName +" removed");
				//pause for refreshing of media content
				setTimeout(function(){nextCallback && nextCallback(testRun);},2000);
			}
		
			try {
				dir.deleteFile(destFolderName+'/'+fileName, successRemoved, errorCB);
			} catch(e) {
				errorCB(e);
			}
		};
		
		tizen.filesystem.resolve(destFolderName, successCB, errorCB, "rw");
	};
		
	var copyFileTo = function(testRun, destFolderName, pathFrom, fileName, nextCallback) {
		var blob = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, pathFrom + '/' + fileName).read();
		function errorCB(e){
			finishError(testRun,e.message);
		};
		function successCB(dir) {
			var writeToStream = function (fileStream) {
				fileStream.writeBase64(blob._data);
				fileStream.close();
				//pause for refreshing of media content
				setTimeout(function(){nextCallback && nextCallback(testRun);},2000);
			};
				
			try {
				dir.createFile(fileName).openStream('rw', writeToStream,errorCB);
			} catch(e){
				errorCB(e);
			}
		};
		console.log(destFolderName);
		console.log(pathFrom);
		console.log(fileName);
		tizen.filesystem.resolve(destFolderName, successCB, errorCB, "rw");
	};
		
	var check_media_types = function(testRun, item) {
		valueOf(testRun, item.title).shouldBeString();
		valueOf(testRun, item.itemURI).shouldBeString();
		valueOf(testRun, item.mimeType).shouldBeString();
		valueOf(testRun, item.id).shouldBeString();
		valueOf(testRun, item.size).shouldBeNumber();
		valueOf(testRun, item.type).shouldBeString();	
		valueOf(testRun, item.releaseDate).shouldBeObject();
		valueOf(testRun, item.modifiedDate).shouldBeObject();	
		valueOf(testRun, item.description).shouldBeString();
		valueOf(testRun, item.rating).shouldBeNumber();	
		valueOf(testRun, item.thumbnailURIs[0]).shouldBeString();

		if (item.type == "IMAGE") {
			valueOf(testRun, item.type).shouldBe("IMAGE");	
			valueOf(testRun, item.width).shouldBeNumber();
			valueOf(testRun, item.height).shouldBeNumber();
			valueOf(testRun, item.geolocation.latitude).shouldBeNumber();
			valueOf(testRun, item.geolocation.longitude).shouldBeNumber();
		} else if (item.type == "VIDEO") {
			valueOf(testRun, item.type).shouldBe("VIDEO");	
			valueOf(testRun, item.width).shouldBeNumber();
			valueOf(testRun, item.height).shouldBeNumber();
			//valueOf(testRun, item.album).shouldBeString();
			//valueOf(testRun, item.artist).shouldBeString();
			valueOf(testRun, item.duration).shouldBeNumber();
			valueOf(testRun, item.playedTime).shouldBeNumber();
			valueOf(testRun, item.playCount).shouldBeNumber();
		} else if (item.type == "AUDIO") {
			valueOf(testRun, item.type).shouldBe("AUDIO");	
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
	}
	//Tests
	this.mediaSourceAPI = function(testRun) {
		Ti.API.info("Start mediaSourceAPI");
		valueOf(testRun, tizen.mediacontent).shouldNotBeNull();
		valueOf(testRun, tizen.mediacontent.getLocalMediaSource).shouldBeFunction();
		
		var source = tizen.mediacontent.getLocalMediaSource();
		
		valueOf(testRun, source).shouldNotBeNull();
		valueOf(testRun, source.getFolders).shouldBeFunction();
		valueOf(testRun, source.updateItem).shouldBeFunction();
		valueOf(testRun, source.updateItemsBatch).shouldBeFunction();
		valueOf(testRun, source.findItems).shouldBeFunction();
		
		Ti.API.info("Finish");
		finish(testRun);
	};
		
	this.getFolder = function(testRun) {
		function test() {
			Ti.API.info("Start getFolder");
			var mediaSource;
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message);});
			}

			function getFolderCB(folders){
				valueOf(testRun, folders.length).shouldBeGreaterThan(0);//at least images
				valueOf(testRun, folders[0].id).shouldNotBeNull();
				valueOf(testRun, folders[0].folderURI).shouldNotBeNull();
				valueOf(testRun, folders[0].title).shouldNotBeNull();
				valueOf(testRun, folders[0].storageType).shouldNotBeNull();
				
				//debug print 
				for (var i in folders) {
					Ti.API.info('folder id:'+folders[i].id+'; uri'+folders[i].folderURI + '; title:'+folders[i].title+'; storageType:'+folders[i].storageType);
				}
				
				//clear and finish
				clear_finish();
			}
		
			mediaSource = tizen.mediacontent.getLocalMediaSource();
			mediaSource.getFolders(getFolderCB,errorCB);
		}
		
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun,'images','suites/tizen/images', 'img1_for_anvil.png', test);
	};
	
	this.findItemsInImages = function(testRun) {
		function test() {
			Ti.API.info("Start findItemsInImages");
			var mediaSource;
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message);});
			}

			function getFolderCB(folders){
				function browseItemsInFolder(items) {
					//Check that array is not empty
					if (!items || items.length == 0) {
						errorCB({message:"Array items is empty"});
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
				
				var isFolderExisted=false;
				for (var i in folders) {
					Ti.API.info('folder id:'+folders[i].id+'; uri'+folders[i].folderURI + '; title:'+folders[i].title+'; storageType:'+folders[i].storageType);
					if (folders[i].title == 'Images') {
						isFolderExisted = true;
						mediaSource.findItems(browseItemsInFolder, errorCB, folders[i].id);
						break;
					}
				}
				
				if (!isFolderExisted) {
					errorCB({message:"Folder hasn`t been found"});
				}
			}
		
			mediaSource = tizen.mediacontent.getLocalMediaSource();
			mediaSource.getFolders(getFolderCB,errorCB);
		}
		
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};
	
	this.findImageByMediaType  = function(testRun) {
		function test() {
			Ti.API.info("Start findImageByMediaType");						
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					errorCB({message:"Array items is empty"});
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
			
			//source
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			//filter
			var mediaType = "IMAGE";
			var count = 1;
			var offset = 0;
			var filter = new tizen.AttributeFilter("type", "EXACTLY", mediaType);
			
			//find
			mediaSource.findItems(successCB, errorCB, null, filter, null, count, offset);
		}
		
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};
	
	this.findImageByTitle  = function(testRun) {
		function test() {
			Ti.API.info("Start findImageByTitle");			
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message);});
			}
			
			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					errorCB({message:"Array items is empty"});
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
			
			//create filter and find
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			var filter = new tizen.AttributeFilter("title", "EXACTLY", "img1_for_anvil.png");
			mediaSource.findItems(successCB,errorCB, null, filter);
		}
		
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};
	
	this.findImageByTitleFailed  = function(testRun) {
		Ti.API.info("Start findImageByTitleFailed");
		function test() {
			function errorCB(e) {
				finishError(testRun,e.message);
			}

			function successCB(items) {
				valueOf(testRun, items.length).shouldBeZero(0);
				//finish
				finish(testRun);
			}
			
			//create filter and find
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			var filter = new tizen.AttributeFilter("title", "EXACTLY", "img1_for_anvil.png");
			mediaSource.findItems(successCB,errorCB, null, filter);
		}
		
		test();
	};
	
	this.updateImage  = function(testRun) {
		Ti.API.info("Start updateImage");
		function test() {
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'images','img1_for_anvil.png', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'images','img1_for_anvil.png', function(){finishError(testRun,e.message);});
			}
			
			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					errorCB({message:"Array items is empty"});
					return;
				}
				//debug print 
				for (var i = 0; i < items.length; i++) {
					Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
				}
				//update
				var item = items[0];
				if (!isUpdated) {
					if (item.editableAttributes.indexOf("rating") >= 0) {
						try {
							rating = item.rating;
							item.rating++;
							mediaSource.updateItem(item); 
							isUpdated = true;
						} catch(e) {
							return errorCB(e);
						}
					} else {
						return errorCB({message:"Property 'rating' is not editable"});
					}
					
					//find again
					mediaSource.findItems(successCB,errorCB, null, filter);
				} else {
					//check rating
					valueOf(testRun, item.rating).shouldBe(rating+1);
					//clear and finish
					clear_finish();
				}
			}
			
			var isUpdated = false;
			var rating=0;
			//create filter and find by title
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			var filter = new tizen.AttributeFilter("title", "EXACTLY", "img1_for_anvil.png");
			mediaSource.findItems(successCB,errorCB, null, filter);
		}
		
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'images', 'suites/tizen/images', 'img1_for_anvil.png', test);
	};
	
	this.updateAudio  = function(testRun) {
		function test() {
			Ti.API.info("Start updateAudio");
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'music','Kalimba.mp3', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'music','Kalimba.mp3', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					errorCB({message:"Array items is empty"});
					return;
				}
				//debug print 
				for (var i = 0; i < items.length; i++) {
					Ti.API.info('Title=' + items[i].title + '; description=' + items[i].description + '; playCount=' + items[i].playCount+ '; rating=' + items[i].rating);
				}
				
				//update
				var item = items[0];
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
						mediaSource.updateItem(item); 
						isUpdated = true;
					} catch(e) {
						return errorCB(e);
					}
					//find again
					mediaSource.findItems(successCB,errorCB, null, filter);
				} else {
					//check rating
					valueOf(testRun, item.rating).shouldBe(1);
					valueOf(testRun, item.playCount).shouldBe(1);//it is not changed !!!
					//clear and finish
					clear_finish();
				}
			}
			
			var isUpdated = false;
			//create filter and find
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			var mediaType = "AUDIO";
			var filter = new tizen.AttributeFilter("type", "EXACTLY", mediaType);
			//var filter = new tizen.AttributeFilter("title", "EXACTLY", 'Kalimba.mp3');
			mediaSource.findItems(successCB,errorCB, null, filter);
		}
		
		//Start: copy file to opt/media/sounds and test
		copyFileTo(testRun, 'music', 'suites/tizen/sounds', 'Kalimba.mp3', test);//we must write 'music' instead of 'sounds' RRR !!!
	};
		
	this.updateItemsBatch = function(testRun) {
		function test() {
			Ti.API.info("Start updateItemsBatch");
			
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'music','Kalimba.mp3', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'music','Kalimba.mp3', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					finishError(testRun,"Array items is empty");
				}
				
				//debug print 
				for (var i = 0; i < items.length; i++) {
					Ti.API.info('Title=' + items[i].title + '; playCount=' + items[i].playCount + '; rating=' + items[i].rating);
				}
				
				//updateBatch, clear and finish
				var item = items[0];
				if (!isUpdated) {
					item.playCount = 1;
					item.rating = 1;
					item.description = 'updateBatch';
					isUpdated = true;
					mediaSource.updateItemsBatch([item], find/*find again*/, errorCB);
				} else {
					//check rating
					valueOf(testRun, item.rating).shouldBe(1);
					valueOf(testRun, item.playCount).shouldBe(1);//it is not changed !!!
					//clear and finish
					clear_finish();	
				}
				
			}
			
			function find() {
				mediaSource.findItems(successCB,errorCB, null, filter);
			}
			
			var isUpdated = false;
			//create filter and find
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			var mediaType = "AUDIO";
			var filter = new tizen.AttributeFilter("type", "EXACTLY", mediaType);
			//var filter = new tizen.AttributeFilter("title", "EXACTLY", 'Kalimba.mp3');
			
			find();//mediaSource.findItems(successCB,errorCB, null, filter);
		}
		
		//Start: copy file to opt/media/sounds and test
		copyFileTo(testRun, 'music', 'suites/tizen/sounds', 'Kalimba.mp3', test);//we have to write 'music' instead of 'sounds' RRR !!!
	};
	
	this.findVideoByMediaType  = function(testRun) {
		function test() {
			Ti.API.info("Start findVideoByMediaType");			
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'videos','video_for_anvil.mp4', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'videos','video_for_anvil.mp4', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					errorCB({message:"Array items is empty"});
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
			
			//source
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			//filter
			var mediaType = "VIDEO";
			var count = 1;
			var offset = 0;
			var filter = new tizen.AttributeFilter("type", "EXACTLY", mediaType);
			
			//find
			mediaSource.findItems(successCB, errorCB, null, filter, null, count, offset);
		}
		
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'videos', 'suites/tizen/videos', 'video_for_anvil.mp4', test);
	};
	
	this.findAudioByTitle  = function(testRun) {
		function test() {
			Ti.API.info("Start findAudioByTitle");				
			function clear_finish() {
				Ti.API.info("Finish");
				removeFileFrom(testRun, 'music','Kalimba.mp3', finish);
			}
			
			function errorCB(e) {
				removeFileFrom(testRun, 'music','Kalimba.mp3', function(){finishError(testRun,e.message);});
			}

			function successCB(items) {
				//Check that array is not empty
				if (!items || items.length == 0) {
					finishError(testRun,"Array items is empty");
				}
				
				for (var i = 0; i < items.length; i++) {
					Ti.API.info('Title=' + items[i].title + '; type=' + items[i].type + '; rating=' + items[i].rating);
				}
				
				check_media_types(testRun,items[0]);
				
				//clear and finish
				clear_finish();
			}
			
			//create filter and find by title
			var mediaSource = tizen.mediacontent.getLocalMediaSource();
			var filter = new tizen.AttributeFilter("title", "EXACTLY", "Kalimba");
			mediaSource.findItems(successCB,errorCB, null, filter);
		}
		
		//Start: copy file to opt/media/images and test
		copyFileTo(testRun, 'music', 'suites/tizen/sounds', 'Kalimba.mp3', test);
	};
}