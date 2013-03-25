#!/usr/bin/env node

// simple hack to enable debugger output
process.env.DEBUG = process.env.DEBUG || 'BUILD:info';



var fs = require('fs'),
	path = require('path'),
	async = require('async'),
	wrench = require('wrench'),
	shell = require('shelljs/global'),
	debug = require('debug'),
	args = process.argv.slice(2),
	branchName, repoPath, titaniumTizenSdk;

// silence shelljs output
config.silent = true;

// create info logger
var info = debug('BUILD:info');

info('Starting');

//args[0] path to titanium_mobile repo
//args[1] target branch, master by default
repoPath = args[0];
titaniumTizenSdk = path.join(repoPath, 'tizen');
branchName = args[1] || 'master';

//validate path to repo
if (!fs.existsSync(repoPath)) {
	info('Error: param 1 should point existng zip archive. Current value: ' + args[0]);
	process.exit(1);
}

async.series([

function(next) {
	//check out and switch branch
	gitCheckout(repoPath, branchName, function(){
		next(null, 'ok');
	});

}, function(next) {
	var exclude = [
			path.join(titaniumTizenSdk, 'titanium/Ti/Facebook'),
			path.join(titaniumTizenSdk, 'titanium/Ti/Facebook.js'),
			path.join(titaniumTizenSdk, 'resources/apple_startup_images'),
			path.join(titaniumTizenSdk, 'templates/app/default/Resources/mobileweb/apple_startup_images')
	],
	createDirs = [
			'utils'
	],
	supportFiles = [
		'support/mobileweb/closureCompiler',
		'support/mobileweb/imageResizer',
		'support/mobileweb/minify',
		'support/mobileweb/resources'
	]
	overrideFiles = [
			{src : 'titanium/Ti/*', dst : 'titanium/Ti/'},
			{src : 'cli/commands/*', dst : 'cli/commands/'},
			{src : 'titanium/Ti.js', dst : 'titanium/'},
			{src : 'templates/*', dst : 'templates/'},
			{src : 'src/*', dst : 'src/'},
			{src : 'dependencyAnalyzer/*', dst : 'dependencyAnalyzer/'},
			{src : 'themes/*', dst : 'themes/'},
			{src : 'utils/signapp.jar', dst : 'utils/'},
		]

	info('Clean up, deleting ' + titaniumTizenSdk);
	rm('-rf', titaniumTizenSdk);//cleanup

	cp('-fR', path.join(repoPath, 'mobileweb','*'), titaniumTizenSdk);

	supportFiles.forEach( function (pth) {
		info('copy ' + path.join(repoPath, pth) + ' into ' + titaniumTizenSdk);
		cp('-fR', path.join(repoPath, pth), titaniumTizenSdk);
	});
	
	createDirs.forEach( function (dirpath) {
		//fs.mkdirSync(path.join(titaniumTizenSdk, dirpath));
		mkdir(path.join(titaniumTizenSdk, dirpath));
	});
	rm('-rf', exclude);
	overrideFiles.forEach( function (patch) {
		info('copy ' + path.join(__dirname, patch.src) + ' into ' + path.join(titaniumTizenSdk, patch.dst));
		cp('-fR', path.join(__dirname, patch.src), path.join(titaniumTizenSdk, patch.dst));
	});
	next(null, 'ok');

}, function(next) {
	try{
		info('Loading dependencyAnalyzer.js');
		var depCheck = require('./dependencyAnalyzer/dependencyAnalyzer');
		depCheck(repoPath + '/');
	} catch(e) {
		info('dependencyAnalyzer failed: ' + e);
	}	
	next(null, 'ok');
}, function(next) {
	var packer = require('child_process'),
		packagesModules = path.join(repoPath, 'support','module','packaged'),		
		random = Math.random ().toString ().substring (2),
		workingDir = path.join(tempdir(), random),
		cmdzip = 'zip -q -r  "' + path.join(packagesModules,'tizen-tizen-3.0.0.zip') + '" *';

	//remove  tizen-tizen-3.0.0.zip if it exists
	rm('-rf', path.join(packagesModules,'tizen-tizen-3.0.0.zip'));
	
	//create temporary dir and its structire
	fs.mkdirSync(workingDir);
	fs.mkdirSync(path.join(workingDir, 'modules'));
	fs.mkdirSync(path.join(workingDir, 'modules', 'tizen'));
	
	cp('-R', path.join(__dirname, 'modules') + '/*',  path.join(workingDir, 'modules', 'tizen'));

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
		//remove temporary directory
		rm('-rf', workingDir);
		next(null, 'ok');
	});		
}], function(err) {
	if (err) {
		info(err);
	}
	info('Finished.');
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
		if (err != null) {
			info(stderr);
		} else {
			info('git ok');
		}
		finish(null);
	});
}
