// Wraps Tizen interface "BookmarkFolder" that resides in Tizen module "Bookmark".

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var BookmarkFolder = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				this._obj = new tizen.BookmarkItem(args.title);
			}
		},

		constants: {
			parent: {
				get: function() {
					return this._obj.parent ? new BookmarkFolder(void 0, this._obj.parent) : this._obj.parent;
				}
			},

			title: {
				get: function() {
					return this._obj.title;
				}
			}
		}

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	BookmarkFolder.prototype.declaredClass = 'Tizen.Bookmark.BookmarkFolder';
	return BookmarkFolder;
});