// Wraps Tizen module "Bookmark".

define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/Bookmark/BookmarkItem', 'Tizen/_/Bookmark/BookmarkFolder'],
	function(lang, Evented, BookmarkItem, BookmarkFolder) {

		return lang.mixProps(require.mix({}, Evented), {

			getBookmarks: function(parentFolder /*BookmarkFolder*/, recursive /*boolean*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [];
				(typeof parentFolder !== 'undefined') && args.push((parentFolder && parentFolder._obj) || parentFolder);
				(typeof recursive !== 'undefined') && args.push(recursive);
				var i = 0,
					result = [],
					bookmarks = tizen.bookmark.get.apply(tizen.bookmark, args),
					length = bookmarks && bookmarks.length;
				for (; i < length; i++) {
					if (bookmarks[i] instanceof tizen.BookmarkItem) {
						result.push(new BookmarkItem(void 0, bookmarks[i]));
					} else if (bookmarks[i] instanceof tizen.BookmarkFolder) {
						result.push(new BookmarkFolder(void 0, bookmarks[i]));
					}
				}

				return result;
			},

			add: function(bookmark /*BookmarkItem or BookmarkFolder*/, parentFolder /*ParentFolder*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [ bookmark._obj ];
				(typeof parentFolder !== 'undefined') && args.push((parentFolder && parentFolder._obj) || parentFolder);
				tizen.bookmark.add.apply(tizen.bookmark, args);
			},

			remove: function(bookmark /*BookmarkItem or BookmarkFolder*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [];
				(typeof bookmark !== 'undefined') && args.push((bookmark && bookmark._obj) || bookmark);
				tizen.bookmark.remove.apply(tizen.bookmark, args);
			},

			createBookmarkItem: function(dict) {
				return new BookmarkItem(dict);
			},

			createBookmarkFolder: function(dict) {
				return new BookmarkFolder(dict);
			}

		}, true);
	});
