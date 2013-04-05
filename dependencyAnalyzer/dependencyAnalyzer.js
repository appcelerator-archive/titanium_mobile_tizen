
module.exports = function(sdkPath) {

	// Get the list of files
	var path = require('path'),
		fs = require('fs'),
		uglify = require('uglify-js'),
		debug = require('debug'),
		info = debug('BUILD:info'),
		sourceDir = (sdkPath) ? sdkPath + 'tizen/titanium' : path.resolve(path.join(__dirname,'..','..','tizen','titanium')),
		fileList = require('wrench').readdirSyncRecursive(sourceDir),
		match,
		dependencies,
		dependencyMap = {},
		i, j, len,
		ast,
		temp,
		jsExtensionRegex = /^(.*)\.js$/;


	for (i = 0, len = fileList.length; i < len; i++) {
		match = fileList[i].match(jsExtensionRegex);
		if (match) {
			try {
				dependencyMap[match[1]] = [];
				dependencies = uglify.parser.parse(fs.readFileSync(path.join(sourceDir, match[0])).toString(), false, true)[1][0];
				if (dependencies[0].name === 'stat') {
					dependencies = dependencies[1];
					if (dependencies[0].name === 'call' && dependencies[1][1] === 'define') {
						dependencies = dependencies[2]; // This is the arguments being passed
						if (dependencies[0] && dependencies[0][0].name === 'array') {
							dependencies = dependencies[0][1];
						} else if (dependencies[1] && dependencies[1][0].name === 'array') {
							dependencies = dependencies[1][1];
						} else {
							continue;
						}
						for (j = 0; j < dependencies.length; j++) {
							dependencies[j] = dependencies[j][1];
							if (~dependencies[j].indexOf('!')) {
								temp = dependencies[j].split('!');
								dependencies.splice(j, 1, temp[0], temp[1]);
								j++;
								dependencies[j - 1] = dependencies[j - 1].replace(/\.js$/, '');
								dependencies[j] = dependencies[j].replace(/\.js$/, '');
							} else {
								dependencies[j] = dependencies[j].replace(/\.js$/, '');
							}
						}
						dependencyMap[match[1]] = dependencies;
					}
				}
			} catch (e) {
				info(' ERROR! parse error in ' + match[0] + ': ' + e.message);
			}
		}
	}
	
	var resultDep = JSON.stringify(dependencyMap, null, '\t');
	if(process.platform === 'win32') {
		// This script was designed for Unix-like systems initially and assumes forward slash as a separator. 
		// On Windows, it gets backslashes in paths, and escapes them several times over. So, here the separators
		// are replaced to the regular forward slashes. This fix allows us to build SDK on Win32.
		resultDep = resultDep.replace(/\\\\/gi, '/');
	}
	
	fs.writeFileSync(path.join(sourceDir, 'dependencies.json'), resultDep);
};