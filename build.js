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
var workingDir = scriptArgs[2];
var titaniumTizenDir = __dirname;
var sdkRoot;

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
		appc.zip.unzip(scriptArgs[0], scriptArgs[2], function(errorMsg){
			if(errorMsg){
				//next('Unzip failed' + errorMsg, 'ok');
				//TODO: do not ignore error, right now it is required for windows
				next(null, 'ok');
			}else{
				next(null, 'ok');
			}
		});
	}
	, function(next){
		console.log('[DEBUG] Create tizen platform, initially copy it from mobileweb');
 		copymobilWebToTizen(function(){

 			next(null, 'ok');
 		});
	}
	], function(err){
		if(err) 
			console.log(err)
		else {
			// Waits for defined functions to finish
			console.log('Failed')
		}
});


function validateArgs(params){
	var workOk = true;
	if(!fs.existsSync(params[0])){
		console.log('Error: param 1 should point existng zip archive. Current value: ' + params[0]);
		workOk = false;
	}
	var stats = fs.statSync(params[2]);
	if(!stats.isDirectory() ){
		console.log('Error: param 3 should point existing directory. Current value: ' + params[2]);
		workOk = false;
	}	
	return workOk;
}

function copymobilWebToTizen(finish){
	var basePath = path.join(workingDir, 'mobilesdk', 'win32');
	appc.fs.visitDirs(basePath, function(name, dpath){
		sdkRoot = dpath;
		console.log('[DEBUG] Full path to SDK folder:' + sdkRoot);
	}, 
	function(){
		//visitDirs finished
	})
}