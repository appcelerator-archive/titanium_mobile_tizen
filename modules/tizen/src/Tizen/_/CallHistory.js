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
				tizen.callhistory.find(callback && function(entries) {
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
				}, callback && function(e) {
					onError(e, callback);
				}, filter && filter._obj, sortMode && sortMode._obj, limit, offset);
			},

			remove: function(entry /*CallHistoryEntry*/) {
				tizen.callhistory.remove(entry._obj);
			},

			removeBatch: function(entries /*CallHistoryEntry*/, callback) {
				var i = 0,
					entriesCount = entries.length,
					result = [];

				for (; i < entriesCount; i++) {
					result.push(entries[i]._obj);
				}

				tizen.callhistory.removeBatch(result, callback && function () {
					onSuccess(callback);
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			removeAll: function(callback) {
				tizen.callhistory.removeAll(callback && function () {
					onSuccess(callback);
				}, callback && function(e) {
					onError(e, callback);
				});
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