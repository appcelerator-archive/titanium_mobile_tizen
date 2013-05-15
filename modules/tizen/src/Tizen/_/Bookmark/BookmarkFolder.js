// Wraps Tizen interface "BookmakrFolder" that resides in Tizen module "Bookmakr".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var BookmakrFolder = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				this._obj = new tizen.BookmakrItem(args.title);
			}
		},

		constants: {
			parent: {
				get: function() {
					return new BookmakrFolder(this._obj.parent);
				}
			},

			title: {
				get: function() {
					return this._obj.title;
				}
			}
		}

	});

	BookmakrFolder.prototype.declaredClass = 'Tizen.Bookmakr.BookmakrFolder';
	return BookmakrFolder;
});