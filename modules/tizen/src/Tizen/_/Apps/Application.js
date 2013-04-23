// Wraps Tizen interface "Application" that resides in Tizen module "Application".
// Module "Application" is renamed as "Apps" in this wrapper.

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Apps/ApplicationInformation', 'Tizen/_/Apps/RequestedApplicationControl'],
	function(declare, Evented, ApplicationInformation, RequestedApplicationControl) {

		var application = declare(Evented, {

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
				// automatically initialize appInfo
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

		// Initialize declaredClass, so that toString() works properly on such objects.
		// Correct operation of toString() is required for proper wrapping and automated testing.
		application.prototype.declaredClass = 'Tizen.Apps.Application';
		return application;
	});
