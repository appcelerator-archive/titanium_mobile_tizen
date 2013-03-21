define(['Ti/_/lang', 'CallHistory/CallHistoryEntry', 'WebAPIError', 'Ti/_/Evented'], function(lang, CallHistoryEntry, WebAPIError, Evented) {
	return lang.mixProps(
		require.mix({}, Evented), 
		{
			find: function(successCallback /*CallHistoryEntryArraySuccessCallback*/, errorCallback /*ErrorCallback*/, filter /*AbstractFilter*/, sortMode /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
				tizen.callhistory.find(function(histories) {
					var result = [],
						historiesCount = histories.length,
						i = 0;

					for (; i < historiesCount; i++) {
						result.push(new CallHistoryEntry(histories[i]));
					}

					successCallback(result);
				}, errorCallback && function(error) {
					errorCallback(new WebAPIError(error));
				}, filter && filter._obj, sortMode && sortMode._obj, limit, offset);
			},

			remove: function(entry /*CallHistoryEntry*/) {
				tizen.callhistory.remove(entry._obj);
			},

			removeBatch: function(entries /*CallHistoryEntry*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
				var i = 0,
					entriesCount = entries.length,
					result = [];

				for (; i < entriesCount; i++) {
					result.push(entries[i]._obj);
				}

				tizen.callhistory.removeBatch(result, successCallback, errorCallback && function(error) {
					errorCallback(new WebAPIError(error));
				});
			},

			removeAll: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
				tizen.callhistory.removeAll(successCallback, errorCallback && function(error) {
					errorCallback(new WebAPIError(error));
				});
			},

			addChangeListener: function(observer /*CallHistoryChangeCallback*/) {
				var object = {
					onadded: function(entries) {
						var result = [],
							i = 0,
							entriesCount = entries.length;

						for(; i < entriesCount; i++) {
							result.push(new CallHistoryEntry(entries[i]));
						}

						observer.onadded(result);
					},
					onchange: function(entries) {
						var result = [],
							i = 0,
							entriesCount = entries.length;

						for (; i < entriesCount; i++) {
							result.push(new CallHistoryEntry(entries[i]));
						}

						observer.onchange(result);
					}
				}

				return tizen.callhistory.addChangeListener(object);
			},

			removeChangeListener: function(handle /*long*/) {
				tizen.callhistory.removeChangeListener(handle);
			}
		}, 
		true
	);
});