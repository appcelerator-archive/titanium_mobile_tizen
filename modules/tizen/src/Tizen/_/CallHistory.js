// Wraps Tizen module "CallHistory".

define(['Ti/_/lang', 'Tizen/_/CallHistory/CallHistoryEntry', 'Ti/_/Evented'], function(lang, CallHistoryEntry, Evented) {

	function onError (e, callback) {
		callback({
			code: e.code,
			success: false,
			error: e.type + ': ' + e.message
		});
	}

	function onSuccess (callback) {
		callback({
			code: 0,
			success: true
		});
	}

	var listening;

	return lang.mixProps(require.mix({}, Evented), {

			find: function(callback, filter /*AbstractFilter*/, sortMode /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				// Tizen distinguishes between undefined optional parameters (this gives an error) and missing optional parameters (this is correct).
				var args = [
					function(entries) {
						var result = [],
							entriesCount = entries.length,
							i = 0;

						for (; i < entriesCount; i++) {
							result.push(new CallHistoryEntry(entries[i]));
						}

						callback({
							code: 0,
							success: true,
							entries: result
						});
					},
					function(e) {
						onError(e, callback);
					}
				];
				(typeof filter !== 'undefined') && args.push((filter && filter._obj) || filter);
				(typeof sortMode && sortMode._obj) && args.push((sortMode && sortMode._obj) || sortMode);
				(typeof limit !== 'undefined') && args.push(limit);
				(typeof offset !== 'undefined') && args.push(offset);

				tizen.callhistory.find.apply(tizen.callhistory, args);
			},

			remove: function(entry /*CallHistoryEntry*/) {
				tizen.callhistory.remove(entry._obj);
			},

			removeBatch: function(entries /*CallHistoryEntry*/, callback) {
				// Tizen distinguishes between undefined optional parameters (this gives an error) and missing optional parameters (this is correct).
				var i = 0,
					entriesCount = entries.length,
					result = [],
					args = [];

				for (; i < entriesCount; i++) {
					result.push(entries[i]._obj);
				}

				args.push(result);
				(typeof callback !== 'undefined') && args.push(function () {
						onSuccess(callback);
					},
					function(e) {
						onError(e, callback);
					}
				);
				tizen.callhistory.removeBatch.apply(tizen.callhistory, args);
			},

			removeAll: function(callback) {
				// Tizen distinguishes between undefined optional parameters (this gives an error) and missing optional parameters (this is correct).
				var args = [];
				(typeof callback !== 'undefined') && args.push(function () {
						onSuccess(callback);
					},
					function(e) {
						onError(e, callback);
					}
				);
				tizen.callhistory.removeAll.apply(tizen.callhistory, args);
			},

			addEventListener: function () {
				var self = this;

				Evented.addEventListener.apply(this, arguments);

				if (!listening) {
					listening = true;

					tizen.callhistory.addChangeListener({
						onadded: function (entries) {
							var i = 0,
								entriesCount = entries.length,
								result = [];

							for (; i < entriesCount; i++) {
								result.push(new CallHistoryEntry(entries[i]));
							}

							self.fireEvent('itemsadded', {
								items: result
							});
						},
						onchanged: function (entries) {
							var result = [],
								i = 0,
								entriesCount = entries.length;

							for (; i < entriesCount; i++) {
								result.push(new CallHistoryEntry(entries[i]));
							}

							self.fireEvent('itemschanged', {
								items: result
							});
						}
					});
				}
			}

		}, true);
});