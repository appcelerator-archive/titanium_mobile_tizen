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
    var VR = 'documents';    
    var errorCB = function(e, testRun, type){
        Ti.API.info('The following error occurred from - '+type+'. Error: ' +  e.message);
        reportError(testRun,'The following error occurred from - '+type+'. Error: ' +  e.message);
        finish(testRun);
    };
    //delete files
    var deleteFiles = function(dir, arrayFiles, finish){
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
    //delete directories and sub-dirs
    var deleteDirectories = function(dir, arrayDirectories, finish){
        var n = arrayDirectories.length-1;
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
        
    this.name = "filesystem";
    this.tests = [
    {
        name: "read_write", 
        timeout: 5000
    },

    {
        name: "create_delete", 
        timeout: 5000
    },

    {
        name: "move", 
        timeout: 5000
    },
    {
        name: "copy", 
        timeout: 5000
    },
    {
        name: "file_property", 
        timeout: 5000
    },
    {
        name: "read_write_bytes", 
        timeout: 5000
    },
    {
        name: "read_write_bytes64", 
        timeout: 5000
    },
    {
        name: "storages", 
        timeout: 5000
    },
    {
        name: "big_file_create_delete_create", 
        timeout: 20000
    }
    ];

    this.read_write = function(testRun) {
        var docDir, 
        text = 'Some text',

        fN = 'testFile.txt',
        file,
        contents,

        fNnew = 'testFile1.txt',
        fileNew,
        newContents;
        //read from second file, delete files. Check if content from 
        //second file is the same with a start content    
        var readToStreamNewFile = function(stream){
            var startBytes = stream.bytesAvailable;
            valueOf(testRun, stream.eof).shouldBeFalse();
            valueOf(testRun, stream.position).shouldBeEqual(0);
            valueOf(testRun, startBytes).shouldBeGreaterThan(0);
            //read from stream 
            newContents = stream.read(stream.bytesAvailable);
            
            valueOf(testRun, stream.eof).shouldBeTrue();
            valueOf(testRun, stream.bytesAvailable).shouldBeLessThanEqual(startBytes);
            valueOf(testRun, stream.position).shouldBeEqual(startBytes-1);
            
            stream.close();
            
            deleteFiles(docDir, [file.fullPath, fileNew.fullPath], function(){
                //Check if content from second file is the same with a start content
                valueOf(testRun, newContents).shouldBeEqual(text);
                finish(testRun);
            });
        };
        //Write the second file from String - text;
        var writeToStreamNewFile = function(stream){
            stream.write(contents);
            stream.close();

            fileNew.openStream(
                'r',
                readToStreamNewFile,
                function(e){
                    errorCB(e, testRun, 'Read second file')
                    } 
                );
        };
        //Read the first file
        var readToStream = function(stream) {
            contents = stream.read(stream.bytesAvailable);
            stream.close();

            try {
                fileNew = docDir.createFile(fNnew);
            } catch (exc) {
                if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                    fileNew = docDir.resolve(fNnew);
                } else {
                    errorCB(exc, testRun, 'Create file');
                }
            }
            fileNew.openStream(
                'w',
                writeToStreamNewFile,
                function(e){
                    errorCB(e, testRun, 'Write second file')
                    } 
                );
        }
        //Write the first file from String - text; 
        var writeToStream = function(stream){
            stream.write(text);
            stream.close();

            file.openStream(
                'r',
                readToStream,
                function(e){
                    errorCB(e, testRun, 'Read first file')
                    } 
                );
        };
        //resolve virtual root callback
        var resolveSCB = function(dir){
            docDir = dir;
            try {
                file = docDir.createFile(fN);
            } catch (exc) {
                if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                    file = docDir.resolve(fN);
                } else {
                    errorCB(exc, testRun, 'Create file')
                }
            }
            file.openStream(
                'w',
                writeToStream,
                function(e){
                    errorCB(e, testRun, 'Write first file')
                    } 
                ); 
        };
        //resolve to virtual root 
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
                }, 
            'rw');
    };
	
    this.create_delete = function(testRun) {
        var docDir,
        
        file,
        directory,
        dN = 'testDir',
        fN = 'textFile.txt';
       
        var resolveSCB = function(dir) {
            var directory;
            var file;
            docDir = dir;
            //create directory, if exist - delete and create new
            function createDir(){
                try {
                    directory = docDir.resolve(dN);
                    deleteDirectories(docDir, [directory.fullPath], function(){
                        createDir();
                    });
                } catch (exc) {
                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                        directory = docDir.createDirectory(dN);
                        file = directory.createFile(fN);
                        
                        function listFilesAfterRemovingCB(files){
                            valueOf(testRun, files.length).shouldBeEqual(0);
                            deleteDirectories(docDir, [directory.fullPath], function(){
                                try {
                                    directory = docDir.resolve(dN);
                                } catch (exc) {
                                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                                        finish(testRun);
                                    } else {
                                        errorCB(exc, testRun, 'Create file');
                                    }
                                }
                            });
                        }
                        
                        function listFilesAfterAddingCB(files){
                            valueOf(testRun, files.length).shouldBeEqual(1);
                                deleteFiles(docDir, [files[0].fullPath], function(){
                                    //list of files after removing the file    
                                    directory.listFiles(
                                        listFilesAfterRemovingCB,
                                        function(e){
                                            errorCB(e, testRun, 'List of files after deleting the file')
                                            }
                                        );
                                });
                        }
                        //list of files after adding the file
                        directory.listFiles(
                            listFilesAfterAddingCB,
                            function(e){
                                errorCB(e, testRun, 'List of files after creating the file')
                            }    
                            )
                    } else {
                        errorCB(exc, testRun, 'Create file')
                    }
                }
            }
            createDir();
        };    
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
            }, 
            'rw');
    };
	
    this.move = function(testRun) {
        var docDir,
        file,
        directory,
        directory1,
        dN = 'testDir',
        dNInner = 'testDirInner',
        fN = 'textFile.txt',
        resolveSCB = function(dir) {
            var directory;
            var file;
            docDir = dir;
            function createDir(){
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
                            if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
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
                    //create a new directory in this directory
                    directory1 = directory.createDirectory(dNInner);
                    //move this file to new directory
                    directory.moveTo(
                        file.fullPath,
                        directory1.fullPath + '/' + file.name,
                        false,
                        moveToCB,
                        function(e){
                            errorCB(e, testRun, 'Move To')
                        }
                        )
                }
            }
            createDir();
        };
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
            }, 
            'rw');
    };
    
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
            function createDir(){
                //create directory, if exist - delete and create new
                try {
                    directory = docDir.resolve(dN);
                    deleteDirectories(docDir, [directory.fullPath], function(){
                        createDir();
                    });
                } catch (exc) {
                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
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
                        directory.copyTo(
                            file.fullPath,
                            directory1.fullPath + '/' + file.name,
                            false,
                            copyToCB,
                            function(e){
                                errorCB(e, testRun, 'Move To')
                            }
                            )
                    } else {
                        errorCB(exc, testRun, 'Create file');
                    }     
                }
            }
            createDir();
        };
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
            }, 
            'rw');
    };
    this.file_property = function(testRun) {
        var docDir,
        file,
        directory,
        text = 'Some text',
        dN = 'testDir',
        fN = 'textFile.txt',
        resolveSCB = function(dir) {
            var directory;
            docDir = dir;
            function createDir(){
                //create directory, if exist - delete and create new
                try {
                    directory = docDir.resolve(dN);
                    deleteDirectories(docDir, [directory.fullPath], function(){
                        createDir();
                    });
                } catch (exc) {
                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                        var writeToStream = function(stream){
                            stream.write(text);
                            stream.close();

                            valueOf(testRun, file.isFile).shouldBeTrue();
                            valueOf(testRun, file.isDirectory).shouldBeFalse();
                            valueOf(testRun, file.readOnly).shouldBeFalse();
                            valueOf(testRun, file.fileSize).shouldBeGreaterThan(0);
                            valueOf(testRun, file.toURI()).shouldBeEqual('file:///opt/media/Documents/testDir/textFile.txt'); // file:///opt/media/Documents/testDir/textFile.txt
                            valueOf(testRun, file.name).shouldBeEqual(fN);
                            valueOf(testRun, file.path).shouldBeEqual('documents/testDir/'); // documents/testDir/
                            valueOf(testRun, file.fullPath).shouldBeEqual('documents/testDir/textFile.txt'); // documents/testDir/textFile.txt
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
                                },
                                "UTF-8"
                            )
                        }
                        //create a new test directory 
                        directory = docDir.createDirectory(dN);
                        //create a file in this directory
                        file = directory.createFile(fN);
                        //write something to file
                        file.openStream(
                            'w',
                            writeToStream,
                            function(e){
                                errorCB(e, testRun, 'Write file')
                                } 
                            );
                    } else {
                        errorCB(exc, testRun, 'Create file');
                    }          
                }
            }
            createDir();
        };
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
            }, 
            'rw');
    };
    this.read_write_bytes = function(testRun) {
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
            function createDir(){
                //create directory, if exist - delete and create new
                try {
                    directory = docDir.resolve(dN);
                    deleteDirectories(docDir, [directory.fullPath], function(){
                        createDir();
                    });
                } catch (exc) {
                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                        //read bytes
                        var readToStream = function(stream){
                            var content = stream.readBytes(stream.bytesAvailable); 
                            stream.close();
                            valueOf(testRun, content.length).shouldBeEqual(bytesA.length);
                            for(var i=0,len = content.length; i<len; i++) {
                                valueOf(testRun, content[i]).shouldBeEqual(bytesA[i]);
                            }
                            deleteDirectories(docDir, [directory.fullPath], function(){
                                finish(testRun);
                            });
                        }
                        //write bytes
                        var writeToStream = function(stream){
                            stream.writeBytes(bytes);
                            stream.close();
                            file.openStream(
                                'r',
                                readToStream,
                                function(e){
                                    errorCB(e, testRun, 'Read file')
                                    } 
                                );
                        }
                        //create a new test directory 
                        directory = docDir.createDirectory(dN);
                        //create a file in this directory
                        file = directory.createFile(fN);
                        //write something to file
                        file.openStream(
                            'w',
                            writeToStream,
                            function(e){
                                errorCB(e, testRun, 'Write file')
                                } 
                            );
                    } else {
                        errorCB(exc, testRun, 'Create file or directory');
                    }        
                }
            }
            createDir();
        };
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
            }, 
            'rw');
    };
    this.read_write_bytes64 = function(testRun) {
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
            function createDir(){
                //create directory, if exist - delete and create new
                try {
                    directory = docDir.resolve(dN);
                    deleteDirectories(docDir, [directory.fullPath], function(){
                        createDir();
                    });
                } catch (exc) {
                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                        var readToStreamBase64 = function(stream){
                            var content = stream.readBase64(stream.bytesAvailable);
                            stream.close();
                             //checking for readBase64 
                            valueOf(testRun, content).shouldBeEqual(bytes);
                            deleteDirectories(docDir, [directory.fullPath], function(){
                                finish(testRun);
                            });
                        }
                        var readToStream = function(stream){
                            var content = stream.read(stream.bytesAvailable); 
                            stream.close();
                            //checking for writeBase64 
                            valueOf(testRun, content).shouldBeEqual(text);
                                
                            file.openStream(
                                'r',
                                readToStreamBase64,
                                function(e){
                                    errorCB(e, testRun, 'Read file')
                                    } 
                                );
                        }
                        var writeToStream = function(stream){
                            stream.writeBase64(bytes);
                            stream.close();
                            file.openStream(
                                'r',
                                readToStream,
                                function(e){
                                    errorCB(e, testRun, 'Read file')
                                    } 
                                );
                        }
                        //create a new test directory 
                        directory = docDir.createDirectory(dN);
                        //create a file in this directory
                        file = directory.createFile(fN);
                        //write something to file
                        file.openStream(
                            'w',
                            writeToStream,
                            function(e){
                                errorCB(e, testRun, 'Write file')
                                } 
                            );
                    } else {
                        errorCB(exc, testRun, 'Create file or directory');
                    }        
                }
            }
            createDir();
        };
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
            }, 
            'rw');
    },
    this.storages = function(testRun) {
        valueOf(testRun, tizen.filesystem.maxPathLength).shouldBeGreaterThan(0);
        var labels = ['wgt-private-tmp', 'wgt-private', 'wgt-package', 'videos', 'music', 'images', 'downloads', 'documents', 'removable2', 'removable1', 'internal0'],
            types = ['INTERNAL', 'EXTERNAL'],
            states = ['MOUNTED', 'REMOVED', 'UNMOUNTABLE'],
            allStorages;
        function checkCorruptedRemovableDrives(storages) { 
            allStorages = storages;
            valueOf(testRun, storages.length).shouldBeGreaterThan(0);
            checkStorages(storages);
        }
        tizen.filesystem.listStorages(checkCorruptedRemovableDrives);
        //check the access for each storages 
        function checkStorages(storages) {
            var n=storages.length-1;
            
            function checkStorage(storage){
                var resolveSCB = function(storage) {
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
                tizen.filesystem.getStorage(
                    storage.label,    
                    resolveSCB, 
                    function(e){
                        errorCB(e, testRun, 'Resolve to virtual root')
                    });
                
            } 
            checkStorage(allStorages[n])
        }    
    },
    this.big_file_create_delete_create = function(testRun) {
        var docDir,
        file,
        text,
        fN = 'test.mp4',
        resolveSCB = function(dir) {
            docDir = dir;
            function createDir(){
                //create directory, if exist - delete and create new
                try {
                    file = docDir.resolve(fN);
                    deleteFiles(docDir, [file.fullPath], function(){
                        createDir();
                    });
                } catch (exc) {
                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
                        var writeToStream = function(stream){
                            stream.write(text);
                            stream.close();
                            
                            //delete the big file
                            deleteFiles(docDir, [file.fullPath], function(){
                               try {
                                    //after deleting try to create 
                                    file = docDir.createFile(fN);
                                    //and delete again
                                    deleteFiles(docDir, [file.fullPath], function(){
                                        finish(testRun);
                                    });
                                } catch (exc) {
                                    if(exc.type == "IOError" && (exc.message == "Node already exists." || exc.message == "Node does not exist or access denied.")) {
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
                         file.openStream(
                            'w',
                            writeToStream,
                            function(e){
                                errorCB(e, testRun, 'Write file')
                                } 
                            );
                    } else {
                        errorCB(exc, testRun, 'Create file');
                    }          
                }
            }
            createDir();
        };
        tizen.filesystem.resolve(
            VR,    
            resolveSCB, 
            function(e){
                errorCB(e, testRun, 'Resolve to virtual root')
            }, 
            'rw');
    }
}