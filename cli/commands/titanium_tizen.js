/*
 * stand alone builder fo Titanium Tizen
 * requires pre installer TIZEN SDK (2.0.0 for now)
 * call 
 * mode titanium.js <path to project>
 *
 */

console.log("command line args: " + process.argv);
//TODO: pass it as parameters, hardcoded are ok for sample only

var fs = require('fs');
var path = require('path');

var sdkpath;
var titaniumSdk = "C:\\Users\\aod\\Application Data\\Titanium\\mobilesdk\\win32\\3.1.0.v20121016132513";
var targetTitaniumSdkVersion="3.1.0.v20121016132513";
//detecting current working dir
var targetProject = process.cwd();

if(!fs.existsSync(targetProject + '\\tiapp.xml')){
	console.log("cannot file file  " + targetProject + '\\tiapp.xml' + 'in current directory. Will it is not Titanium project');
	process.exit(1);//error code for exit
}

var myArgs = process.argv.slice(2);
 console.log('myArgs: ', myArgs);

var async = require('async');

	async.series([
		function(next){//packaging
			//Detect Tizen SDK
			//TODO: check OS, supporting windows only(for now useing registry to find path)
			// read key HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Explorer\Shell Folders
			// key "Local AppData" has path e.g. "C:\Users\aod\AppData\Local\tizen-sdk-data\tizensdkpathirst line from it 
			//"C:\Users\aod\AppData\Local\tizen-sdk-data\tizensdkpath
			var keyvalue = null;
			var reg = require("child_process");
			reg.exec(
				'reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Shell Folders" -v "Local AppData"', 
				function (err, stdout, stderr) {

					if(stdout !== null && (typeof stdout != 'undefined')){
						console.log('obj type' + typeof stdout);
						var arr = stdout.split(" ");
						keyvalue = arr[arr.length-1];//last parameter is path
						keyvalue = keyvalue.slice(0, -4);
						keyvalue = keyvalue + '\\tizen-sdk-data\\tizensdkpath';
						console.log('reading file: ' + keyvalue);
						//fs = require('fs');
						fs.readFile(keyvalue, 'utf8', function (err,data) {
							if (err) {
								return console.log(err);
							}
							var arr = data.split("=");
							sdkpath =  arr[1];
							console.log("Tizen SDK found at: " + sdkpath);
							//next tick
							next(null, 'ok');
						});

					}else{
						console.log("error: cannot read values from windows rgistry");
					}
				});			

		}
		, function(next){
			if(myArgs.length > 0){
				switch (myArgs[0]) {
				case 'build':
					console.log('starting build process');
					startTitaniumMobileBuild();
					break;
				case 'install':
					installWgt(myArgs[1]);
					break;
				case 'runemulator':
					console.log('run on tizen emulator: ' + myArgs[1]);
					runWgtOnEmulator(myArgs[1], myArgs[2]);
					break;
				case 'runsimulator':
					console.log('run on tizen simulator');
					break;
				default:
					console.log('Sorry, that is not something I know how to do.');
				}
			}
		}
		], function(err){
			if(err) 
				console.log(err)
			else {
				// Waits for defined functions to finish
				console.log('Failed')
			}
	});

function startTitaniumMobileBuild(){
	//sdkpath - path to tizen sdk
	//titaniumSdk path to titanium sdk
	//targetProject - build this project

	console.log('startTitaniumMobileBuild');
	var builder = require("child_process");
	//titanium build --platform=mobileweb --project-dir=D:\research\titatiumtizen\repo\MobileWebProject --sdk=3.1.0.v20121016132513
	builder.exec(
		//'titanium',['build','--platform=mobileweb', "--project-dir=" + targetProject, "--sdk=" + targetTitaniumSdkVersion],
		//'titanium build --platform=mobileweb --project-dir=D:\\research\\titatiumtizen\\repo\\MobileWebProject --sdk=3.1.0.v20121016132513 --log-level=debug',
		//'titanium build --platform=mobileweb --project-dir='+targetProject+ ' --sdk=' + targetTitaniumSdkVersion + ' --log-level=debug',
		'titanium build --platform=mobileweb --project-dir='+ targetProject + ' --log-level=debug',
		function (err, stdout, stderr) {
			console.log(stdout);
			if(err != null){
				console.log('failed build for mobileweb platform for ' + targetProject);
				console.log(stderr);
			}else{
				//next tick
				createTizenProject();
			}
	});
}
 
function createTizenProject(){
	var tizenBuildDir = targetProject + '\\build\\tizen';
	
	console.log('startTitaniumMobileBuild: tizenBuildDir:' + tizenBuildDir);

	var fs = require('fs');
	var wrench = require('wrench');
	if(fs.existsSync(tizenBuildDir)){
		wrench.rmdirSyncRecursive(tizenBuildDir, true);
	}
	//copy mobileweb into tizen

	fs.renameSync(targetProject + '\\build\\mobileweb', tizenBuildDir);
	//TODO: generate config.xml from content of tiapp.xml
	copyFileSync( __dirname + '\\..\\..\\templates\\app\\config.xml', tizenBuildDir+'\\config.xml');
	
	copyFileSync( __dirname + '\\..\\..\\templates\\app\\default\\Resources\\tizen\\appicon.png', tizenBuildDir+'\\icon.png');
	wgtPackaging7z();
}

function copyFileSync(srcFile, destFile) {
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

function wgtPackaging7z(){
	var tizenBuildDir = targetProject + '\\build\\tizen';

	var packer = require("child_process");
	var cmd = '7z a ' + tizenBuildDir + '\\tizenapp.zip' + ' ' + tizenBuildDir+'\\*';
	console.log('7z cmd: ' + cmd);

	var async = require('async');

	async.series([
		function(next){
			//packaging
			//TODO: xml signing will required late
			packer.exec(
				cmd,
				function (err, stdout, stderr) {
					console.log(stdout);
					if(err != null){
						console.log('failed packaging for tizen platform');
						console.log(stderr);
						next(err, 'failed');
					}else{
						console.log('compressing ok');
						next(null, 'ok');
					}
				});	
		}
		, function(next){
			//rename .zip into wgt
			var fs = require('fs');
			console.log('rename zip into wgt');
			fs.renameSync(tizenBuildDir + '\\tizenapp.zip', tizenBuildDir + '\\tizenapp.wgt');			
		}
		], function(err){
			if(err) 
				console.log(err)
			else {
				// Waits for defined functions to finish
				console.log('Failed')
			}
	});
}    

function installWgt(pathToWgt){
	var runner = require("child_process");
	var cmd = sdkpath + '\\tools\\ide\\bin\\'  + 'web-install.bat --id=http://yourdomain/Harness --widget=' + pathToWgt;		
	console.log('install cmd: ' + cmd);
	runner.exec(
		cmd,
		function (err, stdout, stderr) {
			console.log(stdout);
			if(err != null){
				console.log('failed install wgt');
				console.log(stderr);
			}else{
				console.log('Installed wgt: ' + pathToWgt);
			}
	});	
}

function runWgtOnEmulator(widgetId, pathToWgt){
	var runner = require("child_process");
	var cmd = sdkpath + '\\tools\\ide\\bin\\'  + 'web-run.bat -id ' + widgetId + ' -w ' + pathToWgt;		
	console.log('Run widget cmd: ' + cmd);
	runner.exec(
		cmd,
		function (err, stdout, stderr) {
			console.log(stdout);
			if(err != null){
				console.log('failed run wgt');
				console.log(stderr);
			}else{
				console.log('Run ok ');
			}
	});	
}