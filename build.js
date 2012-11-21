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
// working directory

console.log("cli args: " + process.argv);

var fs = require('fs');
var path = require('path');
var async = require('async');
var appc = require('node-appc');
var xmldom = require('xmldom');
var wrench = require('wrench');
var scriptArgs = process.argv.slice(2);
var workingDir = scriptArgs[1];
var titaniumTizenDir = __dirname;
var sdkRoot;

console.log('[DEBUG] scriptArgs(zip, working): ' + scriptArgs);

async.series([
	function(next){
		//Validation
		if(validateArgs(scriptArgs)){
			next(null, 'ok');
		}
	}
	, function(next){
		console.log('Start unzip');
		//Unzip
		appc.zip.unzip(scriptArgs[0], scriptArgs[1], function(errorMsg){
			if(errorMsg){
				//next('Unzip failed' + errorMsg, 'ok');
				//TODO: do not ignore error, right now it is required for windows
				console.log('[DEBUG] unzip finished with error: ' + errorMsg);
				next(null, 'ok');
			}else{
				next(null, 'ok');
			}
		});
	}
	, function(next){
		console.log('[DEBUG] Create tizen platform, initially copy it from mobileweb');
 		copymobilWebToTizen(function(){
 			console.log('[DEBUG] copymobilWebToTizen calling next()');
 			next(null, 'ok');
 		});
	}
	, function(next){
		console.log('[DEBUG] fixing manifest.json');			
		fixManifest();
		next(null, 'ok');
	}
	], function(err){
		if(err) 
			console.log(err)
		else {
			// Waits for defined functions to finish
			console.log('Finished')
		}
});


function validateArgs(params){
	var workOk = true;
	if(!fs.existsSync(params[0])){
		console.log('Error: param 1 should point existng zip archive. Current value: ' + params[0]);
		workOk = false;
	}
	var stats = fs.statSync(params[1]);
	if(!stats.isDirectory() ){
		console.log('Error: param 3 should point existing directory. Current value: ' + params[1]);
		workOk = false;
	}	
	return workOk;
}

function copymobilWebToTizen(finish){
	//todo: need same for linux
	var basePath = path.join(workingDir, 'mobilesdk', 'win32');
	console.log('[DEBUG] Looking for sdk in  folder:' + basePath);
	appc.fs.visitDirs(basePath, 
		function(name, dpath){
			sdkRoot = dpath;
			console.log('[DEBUG] Full path to SDK folder:' + sdkRoot);
		}, 
		function(){
			//visitDirs finished, sdk root detected, do copy
			console.log('[DEBUG] wrench.copyDirSyncRecursive from ' + path.join(sdkRoot, 'mobileweb') + " to "+ path.join(sdkRoot, 'tizen'));
			wrench.copyDirSyncRecursive(path.join(sdkRoot, 'mobileweb'), path.join(sdkRoot, 'tizen'));
			
			console.log('[DEBUG] copyDirSyncRecursiveEx from ' +path.join(titaniumTizenDir, 'titanium', 'Ti') + " to "+ path.join(sdkRoot, 'tizen', 'titanium', 'Ti'));
			copyDirSyncRecursiveEx(path.join(titaniumTizenDir, 'titanium', 'Ti'), path.join(sdkRoot, 'tizen', 'titanium', 'Ti'));

			copyFileSync(path.join(titaniumTizenDir, 'titanium', 'Ti.js'), path.join(sdkRoot, 'tizen', 'titanium', 'Ti.js'));

			//remove tizen/templates/app/default/resources/mobileweb directory		
			console.log('[DEBUG]rmdirSyncRecursive from ' + path.join(sdkRoot, 'tizen', 'templates', 'app', 'default', 'Resources', 'mobileweb'));
			wrench.rmdirSyncRecursive(path.join(sdkRoot, 'tizen', 'templates', 'app', 'default', 'Resources', 'mobileweb'), false);
			
			wrench.copyDirSyncRecursive(path.join(titaniumTizenDir,'templates', 'app', 'default', 'Resources', 'tizen'), path.join(sdkRoot, 'tizen', 'templates', 'app', 'default', 'Resources', 'tizen'));

			finish();		
		}
	);
}

function fixManifest(){
	var manifestPath = path.join(sdkRoot, "manifest.json");
	var manifestStr = fs.readFileSync(manifestPath, 'utf8').toString();
	var manifestObject = JSON.parse(manifestStr);
	manifestObject.platforms.push("tizen");
	fs.writeFileSync(manifestPath, JSON.stringify(manifestObject), 'utf8');
}

function copyFileSync(srcFile, destFile) {
	console.log('[DEBUG] copyFileSync from ' + srcFile + " to "+ destFile);
	var bytesRead, fdr, fdw, pos;
	var BUF_LENGTH = 64 * 1024;
	var _buff = new Buffer(BUF_LENGTH);
	fdr = fs.openSync(srcFile, 'r');
	fdw = fs.openSync(destFile, 'w');
	bytesRead = 1;
	pos = 0;
	while (bytesRead > 0) {
		bytesRead = fs.readSync(fdr, _buff, 0, BUF_LENGTH, pos);
		fs.writeSync(fdw, _buff, 0, bytesRead);
		pos += bytesRead;
	}
	fs.closeSync(fdr);
	return fs.closeSync(fdw);
};

function copyDirSyncRecursiveEx(sourceDir, newDirLocation) {
	console.log('[DEBUG] copyDirSyncRecursiveEx src ' + sourceDir + " destination "+ newDirLocation);
    /*  Create the directory where all our junk is moving to; read the mode of the source directory and mirror it */
    var checkDir = fs.statSync(sourceDir);
    try {
    	if(!fs.existsSync(newDirLocation)){
        	fs.mkdirSync(newDirLocation, checkDir.mode);
    	}
    } catch (e) {
        //if the directory already exists, that's okay
        if (e.code !== 'EEXIST') throw e;
    }

    var files = fs.readdirSync(sourceDir);
	console.log('[DEBUG] copyDirSyncRecursiveEx created filelist for ' + sourceDir + " it contains "+ files.length);
    for(var i = 0; i < files.length; i++) {
        var currFile = fs.lstatSync(sourceDir + "/" + files[i]);
        if(currFile.isDirectory()) {
            /*  recursion this thing right on back. */
            copyDirSyncRecursiveEx(sourceDir + "/" + files[i], newDirLocation + "/" + files[i]);
        } else if(currFile.isSymbolicLink()) {
        	console.log('[WARRNING] copyDirSyncRecursiveEx symlink instead of file: ' + sourceDir + "/" + files[i]);
            var symlinkFull = fs.readlinkSync(sourceDir + "/" + files[i]);
            fs.symlinkSync(symlinkFull, newDirLocation + "/" + files[i]);
        } else {
            /*  At this point, we've hit a file actually worth copying... so copy it on over. */
            // var contents = fs.readFileSync(sourceDir + "/" + files[i]);
            // fs.writeFileSync(newDirLocation + "/" + files[i], contents);
            copyFileSync(sourceDir + "/" + files[i], newDirLocation + "/" + files[i])
        }
    }
};
