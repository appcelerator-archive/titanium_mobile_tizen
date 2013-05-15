// Wraps Tizen module "Bookmark".

define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/Bookmark/BookmarkItem', 'Tizen/_/Bookmark/BookmarkFolder'],
	function(lang, Evented, BookmarkItem, BookmarkFolder) {

		return lang.mixProps(require.mix({}, Evented), {

			getBookmarks: function(parentFolder /*BookmarkFolder*/, recursive /*boolean*/) {
				parentFolder = (parentFolder && parentFolder._obj) || null;
				recursive = recursive || false;
				var i = 0,
					result = [],
					bookmarks = tizen.bookmark.get(parentFolder, recursive),
					length = bookmarks && bookmarks.length;
				for (; i < length; i++) {
					if (bookmarks[i] instanceof tizen.BookmarkItem) {
						result.push(new BookmarkItem(bookmarks[i]));
					} else if (bookmarks[i] instanceof tizen.BookmarkFolder) {
						result.push(new BookmarkFolder(bookmarks[i]));
					}
				}

				return result;
			},

			add: function(bookmark /*BookmarkItem or BookmarkFolder*/, parentFolder /*ParentFolder*/) {
				parentFolder = parentFolder._obj || null;
				tizen.bookmark.add(bookmark, parentFolder);
			},

			remove: function(bookmark /*BookmarkItem or BookmarkFolder*/) {
				bookmark = bookmark._obj || null;
				tizen.bookmark.remove(bookmark);
			},

			createBookmarkItem: function(dict) {
				return new BookmarkItem(dict);
			},

			createBookmarkFolder: function(dict) {
				return new BookmarkFolder(dict);
			}

		}, true);
	});
