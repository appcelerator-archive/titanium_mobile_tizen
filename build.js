#!/usr/bin/env node

// simple hack to enable debugger output

process.env.DEBUG = process.env.DEBUG || 'BUILD:info';

/**
 * Module dependencies.
 */

var shell = require('shelljs/global')
	, debug = require('debug')
	,	Zip = require('adm-zip');

// silence shelljs output

config.silent = true;

// create info logger
var info = debug('BUILD:info');

// parse argv

var args = process.argv.slice(2);

// set zip file path

var zipFile = new Zip(args[0]);

// create temp folder to unzip base sdk

var TMP_DIR = tempdir() + 'tizen_sdk/';

// remove tmp dir if exists

try { rm('-rf', TMP_DIR); } catch(e){}

// extract base titanium sdk to temp directory

info(' start extracting zip contents');
zipFile.extractAllTo(TMP_DIR, true);
info(' done extracting zip contents');

// get sdk OS type

var OS = (ls(TMP_DIR + 'mobilesdk' ))[0];

// get sdk os version

var SDK_VER = (ls(TMP_DIR + 'mobilesdk/' + OS + '/'))[0];

// set output directory path

var outFile = (args[1] || '') + 'tizen-' + SDK_VER + '-' + OS + '.zip';

// set path file and sdk base directory paths

var PATH = {
	PATCH_DIR: pwd() + '/',
	SDK_DIR: TMP_DIR + 'mobilesdk/' + OS + '/' + SDK_VER + '/'
};

// rename mobileweb sdk to tizen

info('renaming base sdk folder');
mv('-f', PATH.SDK_DIR + 'mobileweb', PATH.SDK_DIR + 'tizen_sdk');
mv('-f', PATH.SDK_DIR + 'tizen_sdk/templates/app/default/Resources/mobileweb', PATH.SDK_DIR + 'tizen_sdk/templates/app/default/Resources/tizen');

// patch file paths

var src = [
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

// files to exclude from base sdk

var exclude = [
	PATH.SDK_DIR + 'tizen_sdk/Ti/Facebook',
	PATH.SDK_DIR + 'tizen_sdk/titanium/Ti/Facebook.js',
	PATH.SDK_DIR + 'tizen_sdk/resources/tizen/apple_startup_images',
	PATH.SDK_DIR + 'tizen_sdk/templates/app/default/Resources/tizen/apple_startup_images'
];

// remove excluded files and dirs

info('removing excluded files and folders');
rm('-rf', exclude);

// patch base sdk

info('patching base sdk');
mkdir(PATH.SDK_DIR + 'tizen_sdk/utils');
src.forEach( function (patch) {
	var patchFile = PATH.PATCH_DIR + patch;
	var patchParts = patch.split('/');
	patchParts.pop();
	var patchPath = patchParts.join('/');
	cp('-fR', patchFile, PATH.SDK_DIR + 'tizen_sdk/' + patchPath);
});

// generate dependency JSON file

info('start dependency analyzer');
try{
	var depCheck = require(PATH.PATCH_DIR + 'dependencyAnalyzer/dependencyAnalyzer');
	depCheck(PATH.SDK_DIR);
} catch(e) {
	info('ERROR! ' + e);
}
info('done dependency analyzer');

// package tizen sdk

info('packaging tizen ' + SDK_VER + ' sdk ');

try{ rm('-rf', outFile); }catch(e){}
pushd(PATH.SDK_DIR);

var cmd = (which('zip'))
	?	'zip -r ' + PATH.PATCH_DIR + outFile + ' ./tizen_sdk/*'
	: path.normalize(path.join(path.dirname(require.resolve('node-appc')), '..', 'tools', '7zip', '7za.exe')) +' a ' + PATH.PATCH_DIR + outFile + ' ./tizen_sdk/* -tzip';

exec(cmd);
info('done packaging ' + outFile);