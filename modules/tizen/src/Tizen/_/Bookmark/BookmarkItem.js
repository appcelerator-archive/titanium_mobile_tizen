// Wraps Tizen interface "BookmarkItem" that resides in Tizen module "Bookmark".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Bookmark/BookmarkFolder'], function(declare, Evented, BookmarkFolder) {

	var BookmarkItem = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				this._obj = new tizen.BookmarkItem(args.title, args.url);
			}
		},

		constants: {
			parent: {
				get: function() {
					return new BookmarkFolder(this._obj.parent);
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

	BookmarkItem.prototype.declaredClass = 'Tizen.Bookmark.BookmarkItem';
	return BookmarkItem;
});