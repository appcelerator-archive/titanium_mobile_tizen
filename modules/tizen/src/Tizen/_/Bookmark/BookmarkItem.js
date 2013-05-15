// Wraps Tizen interface "BookmakrItem" that resides in Tizen module "Bookmakr".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bookmark/BookmarkFolder'], function(declare, Evented, BookmakrFolder) {

	var BookmakrItem = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				this._obj = new tizen.BookmakrItem(args.title, args.url);
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
			},

			url: {
				get: function() {
					return this._obj.url;
				}
			}
		}

	});

	BookmakrItem.prototype.declaredClass = 'Tizen.Bookmakr.BookmakrItem';
	return BookmakrItem;
});