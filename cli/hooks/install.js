/*
 * install.js: Titanium Tizen CLI post-builds hooks
 *
 * Copyright (c) 2012, Appcelerator, Inc.  All Rights Reserved.
 * See the LICENSE file for more information.
 */

exports.cliVersion = '>=3.X';

var tizenSdkDir,
	fs = require('fs'),
	appc = require('node-appc'),
	path = require('path'),
	runner = require('child_process'),	// for executing child processes (archiving, etc)
	afs = appc.fs,
	series = appc.async.series;

exports.init = function (logger, config, cli) {
	
	cli.addHook('build.post.compile', {
		priority: 8000,
		post: function (data, finished) {
			//test
			//logger.info('data:\n' + JSON.stringify(data));
			
			logger.info('hook build.post.compile');

			series(this, [
				function (next) {
					logger.info('Detecting SDK');
					detectTizenSDK(logger, next);
				}, function (next) {
					logger.info('data.runDevice = ' + data.runDevice);
					if (data.runDevice) {
						// Need to uninstall the old version of the widget before installing a new version of it.
						// If the widget is not installed, will do nothing.
						uninstallWidgetForce(logger, data, function () {
								next(null, 'ok');
							});
					} else {
						next(null, 'ok');
					}
				}, function (next) {
					logger.info('Installing data.runDevice = ' + data.runDevice);
					if (data.runDevice && data.runDevice != 'none') {
						// Install the widget on the device/emulator.
						installOnDevice(
							logger,
							data,
							function () { next(null, 'ok');});
					} else {
						next(null, 'ok');
					}
				}, function (next) {
					logger.info('running data.runDevice = ' + data.runDevice);
					if (data.runDevice && data.runDevice != 'none') {
						if(data.debugFlag){
							debugOnDevice(logger, data, function () {next(null, 'ok');});
						} else {
							runOnDevice(logger, data, function () {next(null, 'ok');});
						}
					} else {
						next(null, 'ok');
					}
				}
				], function (err) {
					if (err) {
						logger.log('Failed:' + err);
					}
					finished && finished.call(this);
				}
			);
		}
	});
	
};

// Find the Tizen SDK installation on this computer and store it in "tizenSdkDir".
// Parameters:
// - logger: the logger object
// - next: the function to call upon completion
function detectTizenSDK(logger, next) {
	var self = this;
	if (process.platform === 'win32') {
		// Find the path to Tizen SDK using the registry.
		// 1. read key HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders;
		//    the key "Local AppData" has the path of the file that contains the path of the SDK
		//    (e.g. "C:\Users\aod\AppData\Local\tizen-sdk-data\tizensdkpath)
		// 2. read the file to obtain the path to the SDK

		var keyvalue = null;
		runner.exec(
			'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders" -v "Local AppData"', 
			function (err, stdout, stderr) {
				if (stdout !== null && (typeof stdout != 'undefined')) {
					var arr = stdout.split(' ');
					keyvalue = arr[arr.length-1]; // the last parameter is the path
					keyvalue = keyvalue.slice(0, -4);
					keyvalue = keyvalue + '\\tizen-sdk-data\\tizensdkpath';
					logger.info('Reading Tizen SDK location from: ' + keyvalue);
					fs.readFile(keyvalue, 'utf8', function (err,data) {
						if (err) {
							logger.info(err);
							return;
						}
						var arr = data.split('=');
						tizenSdkDir =  arr[1];
						logger.info('Tizen SDK found at: ' + tizenSdkDir);
						next(null, 'ok');
					});
				} else {
					logger.error('Error while looking for installed Tizen SDK. Cannot read values from windows registry');
					next('Tizen SDK not found', 'failed');
				}
			});
	} else {
		// Tizen SDK on Linux is installed in /home/tizen-sdk by default.
		tizenSdkDir = path.join(process.env.HOME, 'tizen-sdk');			
		if (afs.exists(path.join(process.env.HOME, 'tizen-sdk-data', 'tizensdkpath'))) {
			fs.readFile(path.join(process.env.HOME, 'tizen-sdk-data', 'tizensdkpath'),
				'utf8',
				function (err,data) {
					if (err) {
						logger.info(err);
						next('Failed to find installed Tizen SDK for Linux', 'failed');
						return;
					}
					var arr = data.split('=');
					tizenSdkDir =  arr[1];
					logger.info('Tizen SDK found at: ' + tizenSdkDir);
					next(null, 'ok');
				});
		} else {
			next('Failed to find Installed Tizen SDK for Linux', 'failed');
		}
	}
}

// Execute a Tizen CLI command (refer to https://developer.tizen.org/help/topic/org.tizen.web.appprogramming/html/ide_sdk_tools/command_line_interface.htm)
// Parameters:
// - command: the CLI command (e.g. "web-run")
// - params: the parameters of the CLI command (e.g. "--device=eumlator-26100")
// - logger: the logger object
// - callback: the function to call upon completion
function executeTizenCLICommand(command, params, logger, callback) {
	var pathToCmd = path.join(tizenSdkDir, 'tools', 'ide', 'bin', process.platform === 'win32' ? command + '.bat' : command) + ' ' +params;
	logger.info('Executing: %s', pathToCmd);
	runner.exec(
			pathToCmd,
			function (err, stdout, stderr) {
				logger.info(stdout);
				if (err != null) {
					logger.info('CLI command failed with error output:');
					logger.info(stderr);
				}
				callback();
		});
}

// Force uninstalling a widget from Tizen.
// Parameters:
// - logger: the logger object
// - data : data object received from hook caller
// - callback: the function to call upon completion
function uninstallWidgetForce(logger, data, callback) {
	if (data.runDevice) {
		executeTizenCLICommand(
			'web-uninstall',
			'-t 10 -i ' + data.tiapp.tizen.appid + ' --device=' + data.runDevice,
			logger,
			callback);
	} else {
		callback();
	}
}

// Install the created widget on Tizen.
// Parameters:
// - logger: the logger object
// - data : data object received from hook caller
// - callback: the function to call upon completion
function installOnDevice(logger, data, callback) {
	if (data.runDevice && data.runDevice != 'none') {
		executeTizenCLICommand(
			'web-install',
			'-t 10 ' + ' --widget="' + path.join(data.buildDir, 'tizenapp.wgt') + '"' + ' --device=' + data.runDevice,
			logger,
			callback);
	} else {
		callback();
	}		
}

// Run the created widget on Tizen.
// Parameters:
// - logger: the logger object
// - data : data object received from hook caller
// - callback: the function to call upon completion
function runOnDevice(logger, data, callback) {
	if (data.runDevice && data.runDevice != 'none') {
		executeTizenCLICommand(
			'web-run',
			'-t 10 -i ' + data.tiapp.tizen.appid + ' --device=' + data.runDevice,
			logger,
			callback);
	} else {
		callback();
	}		
}

// Debug the created widget on Tizen.
// Parameters:
// - logger: the logger object
// - callback: the function to call upon completion
function debugOnDevice(logger, data, callback) {
	if (data.debugFlag) {
		executeTizenCLICommand(
			'web-debug',
			'-t 10 -i ' + data.tiapp.tizen.appid + ' --device=' + data.runDevice,
			logger,
			callback);
	} else {
		callback();
	}
}