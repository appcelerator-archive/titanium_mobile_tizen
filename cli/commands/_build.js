/*
 * build.js: Titanium Tizen CLI build command
 *
 * Copyright (c) 2012, Appcelerator, Inc.  All Rights Reserved.
 * See the LICENSE file for more information.
 */

var ti = require('titanium-sdk'),
	targets = ['simulator', 'device'];

exports.config = function (logger, config, cli) {
	return {
		options: {
			'target': {
				abbr: 'T',
				default: 'simulator',
				desc: __('the target to build for'),
				hint: __('target'),
				required: true,
				values: targets // others?
			}
		}		
	};
};

exports.validate = function (logger, config, cli) {
	ti.validateProjectDir(logger, cli, cli.argv, 'project-dir');
	if (!ti.validateCorrectSDK(logger, config, cli)) {
		// we're running the build command for the wrong SDK version, gracefully return
		return false;
	}
	
	if (targets.indexOf(cli.argv.target) == -1) {
		logger.error(__('Invalid target "%s"', cli.argv.target) + '\n');
		appc.string.suggest(cli.argv.target, targets, logger.log, 3);
		process.exit(1);
	}
};

exports.run = function (logger, config, cli, finished) {
	// TODO:
	// - run mobileweb's _build.js
	// - create the config.xml from tiapp.xml (icon, permissions, name)
	//   - you MUST update titanium_mobile/support/node_modules/titanium-sdk/lib/tiappxml.js
	
	finished();
};
