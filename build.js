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
console.log("cli args: " + process.argv);

var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	appc = require('node-appc'),
	xmldom = require('xmldom'),
	wrench = require('wrench'),
	tmpFileUtil = require("file-utils").File,
	scriptArgs = process.argv.slice(2),
	workingDir = void 0,
	//scriptArgs[1],
	titaniumTizenDir = __dirname,
	sdkRoot, resultPath, buildLinuxSdk = true;

console.log('[DEBUG] scriptArgs(zip, working directory): ' + scriptArgs);

async.series([

function(next) {
	//Validation
	if(validateArgs(scriptArgs)) {
		var archiveName = path.basename(scriptArgs[0]);
		//build name for output zip with SDK
		archiveName = archiveName.replace('.zip', '-tizen.zip');
		resultPath = path.join(path.dirname(scriptArgs[0]), archiveName);
		if(resultPath.indexOf('win32') != -1) {
			//initialize everything for linux sdk
			buildLinuxSdk = false;
		}
		console.log('[DEBUG] created output file name: ' + resultPath);
		if(process.platform === 'win32') {
			//create temporary dir to unzip and modify sdk content. The dir is removed when the process finishes
			var settings = {
				directory: scriptArgs[1]
			};
			tmpFileUtil.createTempFolder(settings, function(error, folder) {
				if(folder == null) {
					next("Cannot create temporary directory", 'failed');
				}
				console.log('[DEBUG] created temporary directory:' + folder.toString());
				workingDir = folder.toString();
				next(null, 'ok');
			});
		} else {
			workingDir = scriptArgs[1];
			next(null, 'ok');
		}
	}
}, function(next) {
	console.log('[DEBUG] Start unzip');
	//Unzip callback
	var resultCb = function(errorMsg) {
			if(errorMsg) {
				console.log('[DEBUG] unzip finished with error: ' + errorMsg);
				next(null, 'ok');
			} else {
				next(null, 'ok');
			}
		};
	if(process.platform === 'win32') {
		unzip7za(scriptArgs[0], workingDir, resultCb);
	} else {
		appc.zip.unzip(scriptArgs[0], workingDir, resultCb);
	}
}, function(next) {
	console.log('[DEBUG] Create tizen platform, initially copy it from mobileweb');
	copymobilWebToTizen(function() {
		console.log('[DEBUG] copymobilWebToTizen calling next()');
		next(null, 'ok');
	});
}, function(next) {
	console.log('[DEBUG] fixing manifest.json');
	fixManifest();
	next(null, 'ok');
}, function(next) {
	executeDependenciesAnalyzer(function() {
		next(null, 'ok');
	});
}, function(next) {
	if(process.platform === 'win32') {
		console.log('Start packaging on win32');
		packagingSDK7z(function() {
			next(null, 'ok');
		});
	} else {
		packagingSDKLinux(function() {
			next(null, 'Packaging on linux ok');
		});
	}
}], function(err) {
	if(err) {
		console.log(err);
	}
	console.log('Finished.');

});

//validating input parameters


function validateArgs(params) {
	var workOk = true;
	if(!fs.existsSync(params[0])) {
		console.log('Error: param 1 should point existng zip archive. Current value: ' + params[0]);
		workOk = false;
	}
	var stats = fs.statSync(params[1]);
	if(!stats.isDirectory()) {
		console.log('Error: param 3 should point existing directory. Current value: ' + params[1]);
		workOk = false;
	}
	return workOk;
}

function copymobilWebToTizen(finish) {
	var basePath;
	if(buildLinuxSdk) {
		basePath = path.join(workingDir, 'mobilesdk', 'linux');
		if(!fs.existsSync(basePath)) {
			basePath = path.join(workingDir, 'mobilesdk', 'osx');
		}
	} else {
		basePath = path.join(workingDir, 'mobilesdk', 'win32');
	}
	console.log('[DEBUG] Looking for sdk in  folder:' + basePath);
	appc.fs.visitDirs(basePath, function(name, dpath) {
		sdkRoot = dpath;
		console.log('[DEBUG] Full path to SDK folder:' + sdkRoot);
	}, function() {
		//visitDirs finished, sdk root detected, create initiali version of tizen directory that really is copy of mobileweb
		console.log('[DEBUG] wrench.copyDirSyncRecursive from ' + path.join(sdkRoot, 'mobileweb') + " to " + path.join(sdkRoot, 'tizen'));
		wrench.copyDirSyncRecursive(path.join(sdkRoot, 'mobileweb'), path.join(sdkRoot, 'tizen'));

		console.log('[DEBUG] copyDirSyncRecursiveEx from ' + path.join(titaniumTizenDir, 'titanium', 'Ti') + " to " + path.join(sdkRoot, 'tizen', 'titanium', 'Ti'));
		copyDirSyncRecursiveEx(path.join(titaniumTizenDir, 'titanium', 'Ti'), path.join(sdkRoot, 'tizen', 'titanium', 'Ti'));

		copyDirSyncRecursiveEx(path.join(titaniumTizenDir, 'cli', 'commands'), path.join(sdkRoot, 'tizen', 'cli', 'commands'));

		copyFileSync(path.join(titaniumTizenDir, 'titanium', 'Ti.js'), path.join(sdkRoot, 'tizen', 'titanium', 'Ti.js'));

		//config.tmpl template for
		copyFileSync(path.join(titaniumTizenDir, 'templates', 'app', 'config.tmpl'), path.join(sdkRoot, 'tizen', 'templates', 'app', 'config.tmpl'));


		wrench.copyDirSyncRecursive(path.join(titaniumTizenDir, 'templates', 'app', 'default', 'Resources', 'tizen'), path.join(sdkRoot, 'tizen', 'templates', 'app', 'default', 'Resources', 'tizen'));

		copyFileSync(path.join(titaniumTizenDir, 'src', 'loader.js'), path.join(sdkRoot, 'tizen', 'src', 'loader.js'));
		copyFileSync(path.join(titaniumTizenDir, 'src', 'index.html'), path.join(sdkRoot, 'tizen', 'src', 'index.html'));

		copyDirSyncRecursiveEx(path.join(titaniumTizenDir, 'dependencyAnalyzer'), path.join(sdkRoot, 'tizen', 'dependencyAnalyzer'));

		copyDirSyncRecursiveEx(path.join(titaniumTizenDir, 'themes'), path.join(sdkRoot, 'tizen', 'themes'));

		//signer app for tizen
		fs.mkdirSync(path.join(sdkRoot, 'tizen', 'utils'));
		copyFileSync(path.join(titaniumTizenDir, 'utils', 'signapp.jar'), path.join(sdkRoot, 'tizen', 'utils', 'signapp.jar'));

		//Tizen does not support Facebook, remove module
		wrench.rmdirSyncRecursive(path.join(sdkRoot, 'tizen', 'titanium', 'Ti', 'Facebook'), false);
		fs.unlinkSync(path.join(sdkRoot, 'tizen', 'titanium', 'Ti', 'Facebook.js'));

		//remove Apple specific resources, we using modified index.html so may remove this directory
		wrench.rmdirSyncRecursive(path.join(sdkRoot, 'tizen', 'templates', 'app', 'default', 'Resources', 'mobileweb', 'apple_startup_images'), false);

		finish();
	});
}

function applyPatches() {
	//make temp dir
	//generate patche
	//apply patch
}

function fixManifest() {
	var manifestPath = path.join(sdkRoot, "manifest.json");
	var manifestStr = fs.readFileSync(manifestPath, 'utf8').toString();
	var manifestObject = JSON.parse(manifestStr);
	manifestObject.platforms.push("tizen");
	fs.writeFileSync(manifestPath, JSON.stringify(manifestObject), 'utf8');
}

function executeDependenciesAnalyzer(finished) {
	console.log('[DEBUG] executeDependenciesAnalyzer ');
	var runner = require('child_process');
	var scriptpath = path.join(sdkRoot, 'tizen', 'dependencyAnalyzer', 'dependencyAnalyzer.js');
	var analyzerCmd = 'node "' + scriptpath + '"';

	console.log('starting dependency analyzer: ' + analyzerCmd);
	options = {
		cwd: path.join(sdkRoot, 'tizen', 'dependencyAnalyzer')
	};
	runner.exec(
	analyzerCmd, function(err, stdout, stderr) {
		console.log(stdout);
		if(err != null) {
			console.log('[Error] executeDependenciesAnalyzer failed');
			console.log(stderr);
		} else {
			console.log('executeDependenciesAnalyzer ok');
		}
		finished();
	});
}

function copyFileSync(srcFile, destFile) {
	console.log('[DEBUG] copyFileSync from ' + srcFile + " to " + destFile);
	var bytesRead, fdr, fdw, pos;
	var BUF_LENGTH = 64 * 1024;
	var _buff = new Buffer(BUF_LENGTH);
	fdr = fs.openSync(srcFile, 'r');
	fdw = fs.openSync(destFile, 'w');
	bytesRead = 1;
	pos = 0;
	while(bytesRead > 0) {
		bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
		fs.writeSync(fdw, _buff, 0, bytesRead);
		pos += bytesRead;
	}
	fs.closeSync(fdr);
	return fs.closeSync(fdw);
}

function copyDirSyncRecursiveEx(sourceDir, newDirLocation) {
	console.log('[DEBUG] copyDirSyncRecursiveEx src ' + sourceDir + " destination " + newDirLocation); /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
	var checkDir = fs.statSync(sourceDir);
	try {
		if(!fs.existsSync(newDirLocation)) {
			fs.mkdirSync(newDirLocation, checkDir.mode);
		}
	} catch(e) {
		//if the directory already exists, that's okay
		if(e.code !== 'EEXIST') throw e;
	}

	var files = fs.readdirSync(sourceDir);
	console.log('[DEBUG] copyDirSyncRecursiveEx created filelist for ' + sourceDir + " it contains " + files.length);
	for(var i = 0; i < files.length; i++) {
		var currFile = fs.lstatSync(sourceDir + "/" + files[i]);
		if(currFile.isDirectory()) { /*  recursion this thing right on back. */
			copyDirSyncRecursiveEx(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
		} else if(currFile.isSymbolicLink()) {
			console.log('[WARRNING] copyDirSyncRecursiveEx symlink instead of file: ' + sourceDir + "/" + files[i]);
			var symlinkFull = fs.readlinkSync(sourceDir + "/" + files[i]);
			fs.symlinkSync(symlinkFull, newDirLocation + "/" + files[i]);
		} else { /*  At this point, we've hit a file actually worth copying... so copy it on over. */
			copyFileSync(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
		}
	}
}

function find7za() {
	var zippath = path.normalize(path.join(path.dirname(require.resolve('node-appc')), '..', 'tools', '7zip', '7za.exe'));
	console.log('7za.exe detected. Path is ' + path.normalize(zippath));

	if(fs.existsSync(zippath)) {
		return zippath;
	} else {
		console.log('Not found 7za.exe path is wrong ' + path.normalize(zippath));
	}
}

function packagingSDK7z(finish) {
	console.log('Packaging application into zip');
	var packer = require('child_process');
	// Create the tasks to unzip each entry in the zip file
	var child, stdout = '',
		stderr = '';

	child = packer.spawn(path.resolve(find7za().toString()), ['a', resultPath, workingDir + '/*', '-tzip']);
	child.stdout.on('data', function(data) {
		stdout += data.toString();
	});
	child.on('exit', function(code, signal) {
		if(finish) {
			if(code) {
				// if we're on windows, the error message is actually in stdout, so scan for it
				if(process.platform === 'win32') {
					var foundError = false,
						err = [];

					stdout.split('\n').forEach(function(line) {
						if(/^Error\:/.test(line)) {
							foundError = true;
						}
						if(foundError) {
							line && err.push(line.trim());
						}
					});
					if(err.length) {
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
		if(callback) {
			if(code) {
				// if we're on windows, the error message is actually in stdout, so scan for it
				if(process.platform === 'win32') {
					var foundError = false,
						err = [];

					stdout.split('\n').forEach(function(line) {
						if(/^Error\:/.test(line)) {
							foundError = true;
						}
						if(foundError) {
							line && err.push(line.trim());
						}
					});

					if(err.length) {
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
	var cmdzip = 'zip -r "' + resultPath + '" *';
	console.log('zip cmd: ' + cmdzip);
	packer.exec(
	cmdzip, {
		cwd: workingDir
	}, function(err, stdout, stderr) {
		console.log(stdout);
		if(err != null) {
			console.log(stderr);
		} else {
			console.log('compressing ok');
		}
		finish(null);
	});
}