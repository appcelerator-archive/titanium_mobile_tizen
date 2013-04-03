define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Apps/ApplicationInformation', 'Tizen/_/Apps/RequestedApplicationControl'],
	function(declare, Evented, ApplicationInformation, RequestedApplicationControl) {

		var application = declare(Evented, {

			constructor: function(args) {
				this._obj = args;
				this.constants.__values__.appInfo = new ApplicationInformation(this._obj.appInfo);
			},

			exit: function() {
				this._obj.exit();
			},

			hide: function() {
				this._obj.hide();
			},

			getRequestedAppControl: function() {
				return new RequestedApplicationControl(this._obj.getRequestedAppControl());
			},

			constants: {
				appInfo: {},
				contextId: {
					get: function() {
						return this._obj.contextId;
					}
				}
			}

		});

		application.prototype.declaredClass = 'Tizen.Apps.Application';
		return application;
	});