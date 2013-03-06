/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		reportError,
		VR = 'documents',
		errorCB = function(e, testRun, type) {
			Ti.API.info('The following error occurred from - '+type+'. Error: ' +  e.message);
			reportError(testRun,'The following error occurred from - '+type+'. Error: ' +  e.message);
			finish(testRun);
		};

	var deleteFiles = function(dir, arrayFiles, finish) {
		var n = arrayFiles.length-1;
		function deleteFile(filePath) {
			dir.deleteFile(
				filePath,
				function() {
					if(n > 0) {
						n--;
						deleteFile(arrayFiles[n]);
					} else {
						finish && finish();
					}
				},
				function(e){
						errorCB(e, testRun, 'Delete file' + filePath)
					}
				);
		}
		deleteFile(arrayFiles[n]);
	}

	var deleteDirectories = function(dir, arrayDirectories, finish) {
		var n = arrayDirectories.length - 1;
		function deleteDirectory(directoryPath) {
			dir.deleteDirectory(
				directoryPath,
				true,
				function() {
					if(n > 0) {
						n--;
						deleteDirectory(arrayDirectories[n]);
					} else {
						finish && finish();
					}
				},
				function(e){
					errorCB(e, testRun, 'Delete directory' + directoryPath)
					}
				);
		}
		deleteDirectory(arrayDirectories[n]);
	}
		
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	};
		
	this.name = 'filesystem';
	this.tests = [
		{name: 'readWrite', timeout: 5000},
		{name: 'createDelete', timeout: 5000},
		{name: 'move', timeout: 5000},
		{name: 'copy', timeout: 5000},
		{name: 'fileProperty', timeout: 5000},
		{name: 'readWriteBytes', timeout: 5000},
		{name: 'readWriteBytes64', timeout: 5000},
		{name: 'storages', timeout: 5000},
		{name: 'bigFileCreateDeleteCreate', timeout: 20000}
	];

	this.readWrite = function(testRun) {
		var docDir, 
			text = 'Some text',
			fN = 'testFile.txt',
			file,
			contents,
			fNnew = 'testFile1.txt',
			fileNew,
			newContents,
			
			readToStreamNewFile = function(stream) {
				
				valueOf(testRun, stream instanceof Ti.Tizen.Filesystem.FileStream).shouldBeTrue();
				
				//read from second file, delete files. Check if content from 
				//second file is the same with a start content 
				var startBytes = stream.bytesAvailable;
				valueOf(testRun, stream.eof).shouldBeFalse();
				valueOf(testRun, stream.position).shouldBeEqual(0);
				valueOf(testRun, startBytes).shouldBeGreaterThan(0);
				//read from stream 
				newContents = stream.read(stream.bytesAvailable);
				
				valueOf(testRun, stream.eof).shouldBeTrue();
				valueOf(testRun, stream.bytesAvailable).shouldBeLessThanEqual(startBytes);
				valueOf(testRun, stream.position).shouldBeEqual(startBytes-1);
//				console.log('stream.position: '+stream.position);
				stream.close();
				
				deleteFiles(docDir, [file.fullPath, fileNew.fullPath], function() {
					//Check if content from second file is the same with a start content
					valueOf(testRun, newContents).shouldBeEqual(text);
					finish(testRun);
				});
			},
			
			writeToStreamNewFile = function(stream) {
				
				valueOf(testRun, stream instanceof Ti.Tizen.Filesystem.FileStream).shouldBeTrue();
				
				//Write the second file from String - text;
				stream.write(contents);
				stream.close();

				fileNew.openStream('r', readToStreamNewFile, function(e) {errorCB(e, testRun, 'Read second file')});
			},

			readToStream = function(stream) {
			
				valueOf(testRun, stream instanceof Ti.Tizen.Filesystem.FileStream).shouldBeTrue();
					
				//Read the first file
				contents = stream.read(stream.bytesAvailable);
				stream.close();

				try {
					fileNew = docDir.createFile(fNnew);
				} catch (exc) {
					if(exc.type == 'NotFoundError') {
						fileNew = docDir.resolve(fNnew);
					} else {
						errorCB(exc, testRun, 'Create file');
					}
				}
				fileNew.openStream('w', writeToStreamNewFile, function(e) {errorCB(e, testRun, 'Write second file')});
			},

			writeToStream = function(stream) {
				//Write the first file from String - text
				stream.write(text);
				stream.close();

				file.openStream('r', readToStream, function(e) {errorCB(e, testRun, 'Read first file')});
			},

			resolveSCB = function(dir) {
				//resolve virtual root callback
				docDir = dir;
				
				valueOf(testRun, docDir instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
				
				try {
					file = docDir.createFile(fN);
				} catch (exc) {
					if(exc.type == 'NotFoundError') {
						file = docDir.resolve(fN);
					} else {
						errorCB(exc, testRun, 'Create file')
					}
				}
				file.openStream('w', writeToStream, function(e) { errorCB(e, testRun, 'Write first file') }); 
			};

		//resolve to virtual root
		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e) { errorCB(e, testRun, 'Resolve to virtual root') }, 'rw');
	}
	
	this.createDelete = function(testRun) {
		var docDir,		
			file,
			directory,
			dN = 'testDir',
			fN = 'textFile.txt',
	   
			resolveSCB = function(dir) {
				var directory, file;
				docDir = dir;
				valueOf(testRun, docDir instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
				function createDir() {
					//create directory, if exist - delete and create new
					try {
						directory = docDir.resolve(dN);
						deleteDirectories(docDir, [directory.fullPath], function() { createDir(); });
					} catch (exc) {
						if (exc.type == 'NotFoundError') {
							directory = docDir.createDirectory(dN);
							file = directory.createFile(fN);
							
							function listFilesAfterRemovingCB(files) {
								valueOf(testRun, files.length).shouldBeEqual(0);
								deleteDirectories(docDir, [directory.fullPath], function() {
									try {
										directory = docDir.resolve(dN);
									} catch (exc) {
										if(exc.type == 'NotFoundError') {
											finish(testRun);
										} else {
											errorCB(exc, testRun, 'Create file');
										}
									}
								});
							}
							
							function listFilesAfterAddingCB(files) {
								valueOf(testRun, files.length).shouldBeEqual(1);
								
								valueOf(testRun, files[0] instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
								
								deleteFiles(docDir, [files[0].fullPath], function() {
									//list of files after removing the file    
									directory.listFiles(listFilesAfterRemovingCB, function(e) {errorCB(e, testRun, 'List of files after deleting the file')});
								});
							}
							
							valueOf(testRun, directory instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
							
							directory.listFiles(listFilesAfterAddingCB, function(e) {errorCB(e, testRun, 'List of files after creating the file')});
						} else {
							errorCB(exc, testRun, 'Create file');
						}
					}
				}
				createDir();
			};
			
		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e){errorCB(e, testRun, 'Resolve to virtual root')}, 'rw');
	}
	
	this.move = function(testRun) {
		var docDir,
			file,
			directory,
			directory1,
			dN = 'testDir',
			dNInner = 'testDirInner',
			fN = 'textFile.txt',
			
			resolveSCB = function(dir) {
				var directory,
					file,
					docDir = dir;
					
				function createDir() {
					//create directory, if exist - delete and create new
					try {
						directory = docDir.resolve(dN);
						deleteDirectories(docDir, [directory.fullPath], function(){
							createDir();
						});
					} catch (exc) {
						var moveToCB = function(){
							try {
								directory.resolve(fN);
								errorCB(exc, testRun, 'File did not deleted')
							} catch (exc) {
								if(exc.type == 'NotFoundError') {
									try {
										directory1.resolve(fN);
										deleteDirectories(docDir, [directory.fullPath], function(){
											finish(testRun);
										});
									} catch (exc) {
										errorCB(exc, testRun, 'File does not exist');
									}
								} else {
									errorCB(exc, testRun, 'Create file');
								}
								
							}
							
						}
						//create a new test directory 
						directory = docDir.createDirectory(dN);
						//create a file in this directory
						file = directory.createFile(fN);
						
						valueOf(testRun, file instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
						
						//create a new directory in this directory
						directory1 = directory.createDirectory(dNInner);
						
						valueOf(testRun, directory1 instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
						
						//move this file to new directory
						directory.moveTo(
							file.fullPath,
							directory1.fullPath + '/' + file.name,
							false,
							moveToCB,
							function(e){
								errorCB(e, testRun, 'Move To')
							})
					}
				};
				createDir();
			};

		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e) {errorCB(e, testRun, 'Resolve to virtual root')}, 'rw');
	}
	
	this.copy = function(testRun) {
		var docDir,
			file,
			directory,
			directory1,
			dN = 'testDir',
			dNInner = 'testDirInner',
			fN = 'textFile.txt',

			resolveSCB = function(dir) {
				docDir = dir;
				function createDir() {
					//create directory, if exist - delete and create new
					try {
						directory = docDir.resolve(dN);
						deleteDirectories(docDir, [directory.fullPath], function() {
							createDir();
						});
					} catch (exc) {
						if(exc.type == 'NotFoundError') {
							var copyToCB = function(){
								try {
									directory.resolve(fN);
									try {
										directory1.resolve(fN);
										deleteDirectories(docDir, [directory.fullPath], function(){
											finish(testRun);
										});
									} catch (exc) {
										errorCB(exc, testRun, 'File does not exist after copying in new place');
									}
								} catch (exc) {
									errorCB(exc, testRun, 'File does not exist after copying in old place');
								}

							}
							//create a new test directory 
							directory = docDir.createDirectory(dN);
							//create a file in this directory
							file = directory.createFile(fN);
							//create a new directory in this directory
							directory1 = directory.createDirectory(dNInner);
							//copy this file to new directory
							directory.copyTo(file.fullPath, directory1.fullPath + '/' + file.name, false, copyToCB, function(e) {errorCB(e, testRun, 'Move To')});
						} else {
							errorCB(exc, testRun, 'Create file');
						}     
					}
				}
				createDir();
			};
			
		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e) { errorCB(e, testRun, 'Resolve to virtual root') }, 'rw');
	}

	this.fileProperty = function(testRun) {
		var docDir,
			file,
			directory,
			text = 'Some text',
			dN = 'testDir',
			fN = 'textFile.txt',

			resolveSCB = function(dir) {
				var directory;
				docDir = dir;

				function createDir() {
					//create directory, if exist - delete and create new
					try {
						directory = docDir.resolve(dN);
						deleteDirectories(docDir, [directory.fullPath], function() { createDir(); });
					} catch (exc) {
						if(exc.type == 'NotFoundError') {
							var writeToStream = function(stream) {
								stream.write(text);
								stream.close();
								valueOf(testRun, file.isFile).shouldBeTrue();
								valueOf(testRun, file.isDirectory).shouldBeFalse();
								valueOf(testRun, file.readOnly).shouldBeFalse();
								valueOf(testRun, file.fileSize).shouldBeGreaterThan(0);
								valueOf(testRun, file.toURI()).shouldBeEqual('file:///opt/usr/media/Documents/testDir/textFile.txt');
								valueOf(testRun, file.name).shouldBeEqual(fN);
								valueOf(testRun, file.path).shouldBeEqual('documents/testDir/');
								valueOf(testRun, file.fullPath).shouldBeEqual('documents/testDir/textFile.txt');
								valueOf(testRun, directory.length).shouldBeEqual(1);
								valueOf(testRun, file.length).shouldBeUndefined();
								valueOf(testRun, file.created.constructor).shouldBeExactly(Date);
								valueOf(testRun, file.modified.constructor).shouldBeExactly(Date);							
								file.readAsText(
									function(str) {
									   valueOf(testRun, str).shouldBeEqual(text);
									   deleteDirectories(docDir, [directory.fullPath], function(){
											finish(testRun);
									   });
									},
									function(e){
										errorCB(e, testRun, 'Read as text Error');
									},'UTF-8')
							}
							//create a new test directory 
							directory = docDir.createDirectory(dN);
							//create a file in this directory
							file = directory.createFile(fN);
							//write something to file
							file.openStream('w', writeToStream, function(e) {errorCB(e, testRun, 'Write file')});
						} else {
							errorCB(exc, testRun, 'Create file');
						}          
					}
				}
				createDir();
			};

		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e){errorCB(e, testRun, 'Resolve to virtual root')}, 'rw');
	}

	this.readWriteBytes = function(testRun) {
		var docDir,
			file,
			directory,
			bytes = [42, 17, 1, 3, 5, 7, 127, 250],
			bytesA = new Uint8Array(bytes),
			dN = 'testDir',
			fN = 'textFile.txt',
			
			resolveSCB = function(dir) {
				var directory;
				docDir = dir;
				function createDir() {
					//create directory, if exist - delete and create new
					try {
						
						directory = docDir.resolve(dN);
						deleteDirectories(docDir, [directory.fullPath], function() {createDir();});
					} catch (exc) {
						
						if(exc.type == 'NotFoundError') {
							//read bytes
							var readToStream = function(stream) {
							
								valueOf(testRun, stream instanceof Ti.Tizen.Filesystem.FileStream).shouldBeTrue();
								
								var content = stream.readBytes(stream.bytesAvailable),
									i = 0, len = content.length; 
								stream.close();
								valueOf(testRun, len).shouldBeEqual(bytesA.length);
								for(; i < len; i++) {
									valueOf(testRun, content[i]).shouldBeEqual(bytesA[i]);
								}
								deleteDirectories(docDir, [directory.fullPath], function() {
									finish(testRun);
								});
							}
							//write bytes
							var writeToStream = function(stream) {
								valueOf(testRun, stream instanceof Ti.Tizen.Filesystem.FileStream).shouldBeTrue();
								stream.writeBytes(bytes);
								stream.close();
								file.openStream('r', readToStream, function(e) {errorCB(e, testRun, 'Read file')});
							}
							
							//create a new test directory 
							directory = docDir.createDirectory(dN);
							
							valueOf(testRun, directory instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
							
							valueOf(testRun, directory instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
							
							//create a file in this directory
							file = directory.createFile(fN);
							
							valueOf(testRun, file instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
							
							//write something to file
							
							file.openStream('w', writeToStream, function(e) {errorCB(e, testRun, 'Write file')});
						} else {
							errorCB(exc, testRun, 'Create file or directory');
						}        
					}
				}
				createDir();
			};

		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e) {errorCB(e, testRun, 'Resolve to virtual root')}, 'rw');
	}

	this.readWriteBytes64 = function(testRun) {
		var docDir,
		file,
		directory,
		bytes = 'U29tZSB0ZXh0',
		text = 'Some text',
		dN = 'testDir',
		fN = 'textFile.txt',
		
		resolveSCB = function(dir) {
			var directory;
			docDir = dir;
			function createDir() {
				//create directory, if exist - delete and create new
				try {
					directory = docDir.resolve(dN);
					deleteDirectories(docDir, [directory.fullPath], function(){
						createDir();
					});
				} catch (exc) {
					if(exc.type == 'NotFoundError') {
						var readToStreamBase64 = function(stream) {
							var content = stream.readBase64(stream.bytesAvailable);
							stream.close();
							 //checking for readBase64 
							valueOf(testRun, content).shouldBeEqual(bytes);
							deleteDirectories(docDir, [directory.fullPath], function() {
								finish(testRun);
							});
						},
						readToStream = function(stream) {
							
							valueOf(testRun, stream instanceof Ti.Tizen.Filesystem.FileStream).shouldBeTrue();
						
							var content = stream.read(stream.bytesAvailable); 
							stream.close();
							//checking for writeBase64 
							valueOf(testRun, content).shouldBeEqual(text);
							file.openStream('r', readToStreamBase64, function(e) { errorCB(e, testRun, 'Read file') });
						},
						writeToStream = function(stream) {
							
							valueOf(testRun, stream instanceof Ti.Tizen.Filesystem.FileStream).shouldBeTrue();
							
							stream.writeBase64(bytes);
							stream.close();
							file.openStream('r', readToStream, function(e) { errorCB(e, testRun, 'Read file') });
						};
						//create a new test directory 
						directory = docDir.createDirectory(dN);
						//create a file in this directory
						file = directory.createFile(fN);
						//write something to file
						
						valueOf(testRun, file instanceof Ti.Tizen.Filesystem.File).shouldBeTrue();
						
						file.openStream('w', writeToStream, function(e) { errorCB(e, testRun, 'Write file') });
					} else {
						errorCB(exc, testRun, 'Create file or directory');
					}        
				}
			}
			createDir();
		};
		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e) {errorCB(e, testRun, 'Resolve to virtual root')}, 'rw');
	}

	this.storages = function(testRun) {
		valueOf(testRun, Ti.Tizen.Filesystem.maxPathLength).shouldBeGreaterThan(0);
		var labels = ['wgt-private-tmp', 'wgt-private', 'wgt-package', 'videos', 'music', 'images', 'downloads', 'documents', 'removable2', 'removable1', 'internal0'],
			types = ['INTERNAL', 'EXTERNAL'],
			states = ['MOUNTED', 'REMOVED', 'UNMOUNTABLE'],
			allStorages;
		
		function checkCorruptedRemovableDrives(storages) {
			
			valueOf(testRun, storages[0] instanceof Ti.Tizen.Filesystem.FileSystemStorage).shouldBeTrue();
			
			allStorages = storages;
			valueOf(testRun, storages.length).shouldBeGreaterThan(0);
			checkStorages(storages);
		}
		
		
		
		Ti.Tizen.Filesystem.listStorages(checkCorruptedRemovableDrives);
		
		function checkStorages(storages) {
			//check the access for each storages 
			var n=storages.length-1;
			
			function checkStorage(storage){
				var resolveSCB = function(storage) {
					
					valueOf(testRun, storage instanceof Ti.Tizen.Filesystem.FileSystemStorage).shouldBeTrue();
				
					//checking the properties for all storages
					valueOf(testRun, (labels.indexOf(storage.label) > -1)).shouldBeTrue();
					valueOf(testRun, (types.indexOf(storage.type) > -1)).shouldBeTrue();
					valueOf(testRun, (states.indexOf(storage.state) > -1)).shouldBeTrue();
					
					if(n>0) {
						n--;
						checkStorage(allStorages[n]);
					} else {
						finish(testRun);
					}
				};
				Ti.Tizen.Filesystem.getStorage(
					storage.label,    
					resolveSCB, 
					function(e){
						errorCB(e, testRun, 'Resolve to virtual root')
					});
				
			} 
			checkStorage(allStorages[n])
		}    
	}

	this.bigFileCreateDeleteCreate = function(testRun) {
		var docDir,
			file,
			text,
			fN = 'test.mp4',
			
			resolveSCB = function(dir) {
				docDir = dir;
				function createDir() {
					//create directory, if exist - delete and create new
					try {
						file = docDir.resolve(fN);
						deleteFiles(docDir, [file.fullPath], function() {
							createDir();
						});
					} catch (exc) {
						if(exc.type == 'NotFoundError') {
							var writeToStream = function(stream) {
								stream.write(text);
								stream.close();
								
								//delete the big file
								deleteFiles(docDir, [file.fullPath], function() {
								   try {
										//after deleting try to create 
										file = docDir.createFile(fN);
										//and delete again
										deleteFiles(docDir, [file.fullPath], function() {
											finish(testRun);
										});
									} catch (exc) {
										if(exc.type == 'NotFoundError') {
											errorCB(exc, testRun, 'File alredy exist');
										} else {
											errorCB(exc, testRun, 'Problem with creating the file');
										}
									}
								});
							}
							//create a file in this directory
							file = docDir.createFile(fN);
							text = new Array(5000000).join('A'); 
							 //write large content to the file
							 file.openStream('w', writeToStream, function(e) { errorCB(e, testRun, 'Write file') });
						} else {
							errorCB(exc, testRun, 'Create file');
						}          
					}
				}
				createDir();
		};
		Ti.Tizen.Filesystem.resolve(VR, resolveSCB, function(e) { errorCB(e, testRun, 'Resolve to virtual root') }, 'rw');
	}
}
