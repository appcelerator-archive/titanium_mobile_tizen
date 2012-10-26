exports.cliVersion = '>=3.X';

exports.init = function (logger, config, cli) {

	cli.addHook('build.post.compile', {
		priority: 10000,
		post: function (build, finished) {
			if (cli.argv.target != 'simulator') return finished();
			
			if (cli.argv['build-only']) {
				logger.info(__('Performed build only, skipping running of the application'));
				return finished();
			}
			
			logger.info(__('Running application in Tizen Simulator'));
			
			// TODO!
			// - which simulator/emulator are we running? we need a cli option!
		}
	});

};