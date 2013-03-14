#!/usr/bin/env node

// 1) validate a zip file argument was supplied
// 2) unzip the zip file using node_appc
// 3) copy the "mobileweb" directory to "tizen"
// 4) remove tizen/templates/app/default/resources/mobileweb directory
// 4) copy tizen files (cli, templates, titanium) on top of "tizen" directory
// 5) copy titanium-sdk/lib/tiappxml.js on top of node_modules/titanium-sdk/lib
// 6) read manifest.json, parse json, add "tizen" to platforms, stringify json, write manifest
// 7) run dependencies.json builder using titanium_mobile/support/mobileweb/dependencyAnalyzer
// 8) re-zip distribution file with "VERSION-tizen.zip"
//input parameters:
// path to zip
// output file name
// working directory unzip original sdk

// simple hack to enable debugger output
process.env.DEBUG = process.env.DEBUG || 'BUILD:info';

var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	appc = require('node-appc'),
	xmldom = require('xmldom'),
	wrench = require('wrench'),
	fileUtils = require("file-utils").File,
	shell = require('shelljs/global'),
	debug = require('debug'),
	admzip = require('adm-zip'),
	args = process.argv.slice(2),
	runningOnWin32 = (process.platform === 'win32'),
	workingDir = void 0,
	titaniumTizenDir = __dirname,
	sdkRoot, resultPath;

// silence shelljs output
config.silent = true;

// create info logger
var info = debug('BUILD:info');

info('Starting');

async.series([

function(next) {
	if (validateArgs(args)) {
		//build name for output zip with SDK
		var archiveName = path.basename(args[0]);
		archiveName = archiveName.replace('.zip', '-tizen.zip');

		//TODO: get rid of file-utils
		//Logic on on Windows and Linux are different:
		//win32: file-utils will remove temporary dir 
		//linux: cannot use file-utils because 
		if (runningOnWin32) {
			//create temporary dir to unzip and modify sdk content. The dir is removed when the process finishes
			var settings = {
				directory: tempdir()
			};
			fileUtils.createTempFolder(settings, function(error, folder) {
				if (folder == null) {
					next('Cannot create temporary directory', 'failed');
				}
				info('created temporary directory:' + folder.toString());
				workingDir = folder.toString();

				next(null, 'ok');
			});
		} else {
			//use mktemp command
			var random = Math.random ().toString ().substring (2);
			workingDir = path.join(tempdir(), random);
			fs.mkdirSync(workingDir);
			next(null, 'ok');
		}
	}
}, function(next) {
	info('Start unzip');
	//Unzip callback
	var unzip,
		resultCb = function(errorMsg) {
			if (errorMsg) {
				info('unzip finished with error: ' + errorMsg);
			}
			//ignoring error, with current beta builds we have it always, due to zip content
			next(null, 'ok');
		};
	unzip = runningOnWin32 ? unzip7za : appc.zip.unzip;
	unzip(args[0], workingDir, resultCb);
}, function(next) {
	info('Create tizen platform, initially copy it from mobileweb');
	copyMobileWebToTizen(function() {
		next(null, 'ok');
	});
}, function(next) {
	executeDependenciesAnalyzer(function() {
		next(null, 'ok');
	});
}, function(next) {
	if (runningOnWin32) {
		info('Start packaging on win32');
		packagingSDK7z(function() {
			next(null, 'ok');
		});
	} else {
		packagingSDKLinux(function() {
			next(null, 'Packaging on linux ok');
		});
	}
}, function(next) {
	//cleanup
	if (!runningOnWin32) {
		info('Deleting temporary directory ' + workingDir);
		rm('-rf', workingDir);
	} 
}], function(err) {
	if (err) {
		info(err);
	}
	info('Finished.');
});

//validating input parameters
function validateArgs(params) {
	var workOk = true;
	if (!fs.existsSync(params[0])) {
		info('Error: param 1 should point existng zip archive. Current value: ' + params[0]);
		workOk = false;
	}

	if(params[1]){
		var stats = fs.statSync(params[1]);
		if (!stats.isDirectory()) {
			info('Error: param 2 should point existing directory. Current value: ' + params[1]);
			workOk = false;
		}
	}
	return workOk;
}

function copyMobileWebToTizen(finish) {

	var os = (ls(workingDir + '/' + 'mobilesdk' ))[0];
	// get sdk os version
	info('os:' + os);

	var sdkVersion = (ls(workingDir + '/' + 'mobilesdk/' + os + '/'))[0];
	info('sdkVersion:' + sdkVersion);

	// create output directory path and
	resultPath = (args[1] || '.') + '/tizen-' + sdkVersion + '-' + os + '.zip';
	info('outFile:' + resultPath);
	if (fs.existsSync(resultPath)) {
		fs.unlinkSync(resultPath);
	}

	sdkRoot = path.join(workingDir, 'mobilesdk', os, sdkVersion);
	info('sdkRoot:' + sdkRoot);

	var createDirs = [
		'utils'
	];
	var overrideFiles = [
		'titanium/Ti',
		'cli/commands',
		'titanium/Ti.js',
		'templates/app/config.tmpl',
		'templates/app/default/Resources/tizen',
		'src/loader.js',
		'src/index.html',
		'dependencyAnalyzer',
		'themes',
		'utils/signapp.jar'
	];

	var exclude = [
		'titanium/Ti/Facebook',
		'titanium/Ti/Facebook.js',
		'resources/apple_startup_images',
		'templates/app/default/Resources/mobileweb/apple_startup_images'		
	];

	var pathToTizenInInSdk = path.join(sdkRoot, 'tizen');
	//Directory tizen may already exists in archive if we re-pack sdk with tizen support. Remove it
	if (fs.existsSync(pathToTizenInInSdk)) {
		wrench.rmdirSyncRecursive(pathToTizenInInSdk, true);
	}

	info('wrench.copyDirSyncRecursive from ' + path.join(sdkRoot, 'mobileweb') + " to " + pathToTizenInInSdk);
	wrench.copyDirSyncRecursive(path.join(sdkRoot, 'mobileweb'), pathToTizenInInSdk);

	createDirs.forEach( function (dirpath) {
		fs.mkdirSync(path.join(pathToTizenInInSdk, dirpath));
	});

	overrideFiles.forEach( function (patch) {
		var source = path.join(titaniumTizenDir, patch);
		var stats = fs.statSync(source);
		info('Copy ' + source + ' into '+ path.join(pathToTizenInInSdk, patch));
		if (stats.isDirectory()) {
			copyDirSyncRecursiveEx(source, path.join(pathToTizenInInSdk, patch));
		} else {
			copyFileSync(source, path.join(pathToTizenInInSdk, patch));
		}
	});

	exclude.forEach( function (target) {
		var source = path.join(pathToTizenInInSdk, target)
		var stats = fs.statSync(source);
		info('Deleting ' + source);
		if (stats.isDirectory()) {
			wrench.rmdirSyncRecursive(source, false);
		} else {
			fs.unlinkSync(source);
		}
	});

	finish();
}

function executeDependenciesAnalyzer(finished) {
	try{
		info('Loading dependencyAnalyzer.js');
		var depCheck = require('./dependencyAnalyzer/dependencyAnalyzer');
		depCheck(sdkRoot + '/');
	} catch(e) {
		info('dependencyAnalyzer failed: ' + e);
	}
	finished();
}

function copyFileSync(srcFile, destFile) {
	//info('copyFileSync from ' + srcFile + " to " + destFile);
	var bytesRead = 1, 
		fdr, fdw, 
		pos = 0,
		BUF_LENGTH = 64 * 1024,
		buff = new Buffer(BUF_LENGTH);
	fdr = fs.openSync(srcFile, 'r');
	fdw = fs.openSync(destFile, 'w');
	while (bytesRead > 0) {
		bytesRead = fs.readSync(fdr, buff, 0, BUF_LENGTH, pos);
		fs.writeSync(fdw, buff, 0, bytesRead);
		pos += bytesRead;
	}
	fs.closeSync(fdr);
	return fs.closeSync(fdw);
}

function copyDirSyncRecursiveEx(sourceDir, newDirLocation) {
	//info('copyDirSyncRecursiveEx src ' + sourceDir + " destination " + newDirLocation); /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
	var checkDir = fs.statSync(sourceDir);
	try {
		if (!fs.existsSync(newDirLocation)) {
			fs.mkdirSync(newDirLocation, checkDir.mode);
		}
	} catch(e) {
		//if the directory already exists, that's okay
		if (e.code !== 'EEXIST') throw e;
	}

	var files = fs.readdirSync(sourceDir);
	//info('copyDirSyncRecursiveEx created filelist for ' + sourceDir + " it contains " + files.length);
	for(var i = 0; i < files.length; i++) {
		var currFile = fs.lstatSync(sourceDir + "/" + files[i]);
		if (currFile.isDirectory()) { /*  recursion this thing right on back. */
			copyDirSyncRecursiveEx(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
		} else if (currFile.isSymbolicLink()) {
			info('[WARRNING] copyDirSyncRecursiveEx symlink instead of file: ' + sourceDir + "/" + files[i]);
			var symlinkFull = fs.readlinkSync(sourceDir + "/" + files[i]);
			fs.symlinkSync(symlinkFull, newDirLocation + "/" + files[i]);
		} else { /*  At this point, we've hit a file actually worth copying... so copy it on over. */
			copyFileSync(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
		}
	}
}

function find7za() {
	var zippath = path.normalize(path.join(path.dirname(require.resolve('node-appc')), '..', 'tools', '7zip', '7za.exe'));
	info('7za.exe detected. Path is ' + path.normalize(zippath));

	if (fs.existsSync(zippath)) {
		return zippath;
	} else {
		info('Cannot find 7za.exe at ' + path.normalize(zippath));
	}
}

function packagingSDK7z(finish) {
	info('Packaging application into zip');
	var packer = require('child_process');
	// Create the tasks to unzip each entry in the zip file
	var child, stdout = '',
		stderr = '';

	child = packer.spawn(path.resolve(find7za().toString()), ['a', resultPath, workingDir + '/*', '-tzip']);
	child.stdout.on('data', function(data) {
		stdout += data.toString();
	});
	child.on('exit', function(code, signal) {
		if (finish) {
			if (code) {
				// if we're on windows, the error message is actually in stdout, so scan for it
				if (runningOnWin32) {
					var foundError = false,
						err = [];

					stdout.split('\n').forEach(function(line) {
						if (/^Error\:/.test(line)) {
							foundError = true;
						}
						if (foundError) {
							line && err.push(line.trim());
						}
					});
					if (err.length) {
						stderr = err.join('\n') + stderr;
					}
				}
				finish();
			} else {
				finish();
			}
		}
	});
}

function unzip7za(src, dest, callback) {
	var packer = require('child_process');
	// Create the tasks to unzip each entry in the zip file
	var child, stdout = '',
		stderr = '';

	child = packer.spawn(path.resolve(find7za().toString()), ['x', src, '-o' + dest, '-y', '-bd']);
	child.stdout.on('data', function(data) {
		stdout += data.toString();
	});
	child.on('exit', function(code, signal) {
		if (callback) {
			if (code) {
				// if we're on windows, the error message is actually in stdout, so scan for it
				if (runningOnWin32) {
					var foundError = false,
						err = [];

					stdout.split('\n').forEach(function(line) {
						if (/^Error\:/.test(line)) {
							foundError = true;
						}
						if (foundError) {
							line && err.push(line.trim());
						}
					});

					if (err.length) {
						stderr = err.join('\n') + stderr;
					}
				}
				callback(null);
			} else {
				callback(null);
			}
		}
	});
}

function packagingSDKLinux(finish) {
	var packer = require('child_process');
	var cmdzip = 'zip -q -r  "' + resultPath + '" *';
	info('zip cmd: ' + cmdzip);
	packer.exec(
	cmdzip, {
		cwd: workingDir
	}, function(err, stdout, stderr) {
		info(stdout);
		if (err != null) {
			//info(stderr);
		} else {
			info('compressing ok');
		}
		finish(null);
	});
}
