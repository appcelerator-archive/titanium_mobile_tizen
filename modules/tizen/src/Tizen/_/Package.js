define(['Ti/_/lang', 'Tizen/_/Package/PackageInformation', 'Ti/_/Evented'], function(lang, PackageInformation, Evented) {

	function onError (e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

	var listening;

	return lang.mixProps(require.mix({}, Evented), {

		install: function(path /*DOMString*/, callback /*PackageProgressCallback*/) {
			return tizen.package.install(path, {
				onprogress: callback && function(id, progress) {
					callback({
						code: 0,
						success: true,
						id: id,
						progress: progress,
						onprogress: true,
						oncomplette: false
					});
				},
				oncomplette: callback && function(id) {
					callback({
						code: 0,
						success: true,
						id: id,
						progress: 100,
						onprogress: false,
						oncomplette: true
					});
				}

			}, callback && function(e) {
				onError(e, callback);
			});
		},

		uninstall: function(id /*PackageId*/, progressCallback /*PackageProgressCallback*/) {
			return tizen.package.uninstall(id, {
				onprogress: callback && function(id, progress) {
					callback({
						code: 0,
						success: true,
						id: id,
						progress: progress,
						onprogress: true,
						oncomplette: false
					});
				},
				oncomplette: callback && function(id) {
					callback({
						code: 0,
						success: true,
						id: id,
						onprogress: false,
						oncomplette: true
					});
				}

			}, callback && function(e) {
				onError(e, callback);
			});
		},

		getPackagesInfo: function(callback /*PackageInformationArraySuccessCallback*/) {
			return tizen.package.getPackagesInfo(callback && function(informationArray) {
				var result = [],
					i = 0,
					length = informationArray.length;
				for (; i < length; i++) {
					result.push(new PackageInformation(void 0, informationArray[i]));
				}

				callback({
					code: 0,
					success: true,
					informationArray: result
				});

			}, callback && function(e) {
				onError(e, callback);
			});
		},

		getPackageInfo: function(id /*PackageId*/) {
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			var args = [];
			(typeof id !== 'undefined') && args.push(id);
			var packageInfo = tizen.package.getPackageInfo.apply(tizen.package, args);
			return new PackageInformation(void 0, packageInfo);
		},

		addEventListener: function() {
			var self = this;
			Evented.addEventListener.apply(this, arguments);
			if (! listening) {
				tizen.package.setPackageInfoEventListener({
					oninstalled: function(info) {
						self.fireEvent('packageinstalled', {
							info: new PackageInformation(void 0, info)
						});
					},
					onupdated: function(info) {
						self.fireEvent('packageupdated', {
							info: new PackageInformation(void 0, info)
						});
					},
					onuninstalled: function(id) {
						self.fireEvent('packageuninstalled', {
							id: id
						});
					}
				});
			}
		}

	}, true);
});