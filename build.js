#!/usr/bin/env node

// simple hack to enable debugger output
process.env.DEBUG = process.env.DEBUG || 'BUILD:info';

require('shelljs/global');

var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	debug = require('debug'),
	args = process.argv.slice(2),
	branchName, repoPath, titaniumTizenSdk;

// silence shelljs output
config.silent = true;

// create info logger
var info = debug('BUILD:info');

info('Starting');

// command-line arguments:
// args[0]: path to a titanium_mobile repo
// args[1]: target branch, master by default
repoPath = args[0];
titaniumTizenSdk = path.join(repoPath, 'tizen');
branchName = args[1] || 'master';

// Validating path to repo
if (!fs.existsSync(repoPath)) {
	info('Error: param 1 should point to an existng zip archive. Current value: ' + args[0]);
	process.exit(1);
}

async.series(
[

	function(next) {
		// check out and switch branch
		gitCheckout(repoPath, branchName, function(){
			next(null, 'ok');
		});

	}, function(next) {
		// Some mobileweb modules/files are excluded from Tizen:
		//  - MobileWeb-specific Facebook support implemetation cannot work on Tizen
		//  - iOS specific startup images are unneeded on Tizen
		var exclude = [
				path.join(titaniumTizenSdk, 'titanium/Ti/Facebook'),
				path.join(titaniumTizenSdk, 'titanium/Ti/Facebook.js'),
				path.join(titaniumTizenSdk, 'resources/apple_startup_images'),
				path.join(titaniumTizenSdk, 'templates/app/default/Resources/mobileweb/apple_startup_images')
		],
		createDirs = [		// Lists directories that will be created
				'utils'
		],
		supportFiles = [	// Additional directories that will be copied to the result
			'support/mobileweb/closureCompiler',
			'support/mobileweb/imageResizer',
			'support/mobileweb/minify',
			'support/mobileweb/resources'
		],

		// Files that override original MobileWeb files on Tizen.
		// (signapp.jar is unique for Tizen and implements wgt signing.)
		overrideFiles = [
				{src : 'titanium/Ti/*', dst : 'titanium/Ti/'},
				{src : 'cli/commands/*', dst : 'cli/commands/'},
				{src : 'titanium/Ti.js', dst : 'titanium/'},
				{src : 'templates/*', dst : 'templates/'},
				{src : 'src/*', dst : 'src/'},
				{src : 'dependencyAnalyzer/*', dst : 'dependencyAnalyzer/'},
				{src : 'themes/*', dst : 'themes/'},
				{src : 'package.json', dst : 'package.json'},
				{src : 'utils/signapp.jar', dst : 'utils/'}
			];

		info('Clean up, deleting ' + titaniumTizenSdk);
		rm('-rf', titaniumTizenSdk);

		// MobileWeb is base for Tizen.
		cp('-fR', path.join(repoPath, 'mobileweb', '*'), titaniumTizenSdk);

		// This script works before Titanium SDK build process creates a ready-to-use mobileweb directory. 
		// So we have to copy supporting files on our own.
		supportFiles.forEach( function (pth) {
			info('copy ' + path.join(repoPath, pth) + ' into ' + titaniumTizenSdk);
			cp('-fR', path.join(repoPath, pth), titaniumTizenSdk);
		});

		createDirs.forEach( function (dirpath) {
			mkdir(path.join(titaniumTizenSdk, dirpath));
		});

		// Remove directories marked for exclusion
		rm('-rf', exclude);

		// Override MobileWeb files
		overrideFiles.forEach( function (patch) {
			info('copy ' + path.join(__dirname, patch.src) + ' into ' + path.join(titaniumTizenSdk, patch.dst));
			cp('-fR', path.join(__dirname, patch.src), path.join(titaniumTizenSdk, patch.dst));
		});

		next(null, 'ok');

	}, function(next) {
		try{
			// Generating with dependencyAnalyzer tool
			info('Loading dependencyAnalyzer.js');
			var depCheck = require('./dependencyAnalyzer/dependencyAnalyzer');
			depCheck(repoPath + '/');
		} catch(e) {
			info('dependencyAnalyzer failed: ' + e);
		}
		next(null, 'ok');

	}, function(next) {
		// Package the Tizen wrapper module and place it into titanium_mobile/support/module/packaged
		var packer = require('child_process'),
			packagesModules = path.join(repoPath, 'support','module','packaged'),
			random = Math.random ().toString ().substring (2),
			workingDir = path.join(tempdir(), random),
			cmdzip = 'zip -q -r  "' + path.join(packagesModules,'tizen-tizen-3.0.0.zip') + '" *';

		// remove tizen-tizen-3.0.0.zip if it exists
		rm('-rf', path.join(packagesModules,'tizen-tizen-3.0.0.zip'));

		//create temporary dir and its structire
		fs.mkdirSync(workingDir);
		fs.mkdirSync(path.join(workingDir, 'modules'));
		fs.mkdirSync(path.join(workingDir, 'modules', 'tizen'));
		fs.mkdirSync(path.join(workingDir, 'modules', 'tizen','tizen'));
		fs.mkdirSync(path.join(workingDir, 'modules', 'tizen','tizen','3.0.0'));

		cp('-R', path.join(__dirname, 'modules', 'tizen') + '/*',  path.join(workingDir, 'modules', 'tizen', 'tizen','3.0.0'));

		// Create archive with the Tizen wrapper module
		info('zip cmd: ' + cmdzip);
		packer.exec(
		cmdzip, {
			cwd: workingDir
		}, function(err, stdout, stderr) {
			info(stdout);
			// remove the temporary directory
			rm('-rf', workingDir);
			next(null, 'ok');
		});
	}

], function(err) {
	if (err) {
		info(err);
	}
	info('Preparing Tizen for Titanium SDK finished.');
});

function gitCheckout(workingDir, branch, finish) {
	var executor = require('child_process'),
		cmd = 'git checkout -f ' + branch;
	info('git cmd: ' + cmd);
	executor.exec(
	cmd, {
		cwd: workingDir
	}, function(err, stdout, stderr) {
		info(stdout);
		if (stdout) {
			info(stdout);
		}
		if (err) {
			info(stderr);
		} else {
			info('git ok');
		}
		finish(null);
	});
}
