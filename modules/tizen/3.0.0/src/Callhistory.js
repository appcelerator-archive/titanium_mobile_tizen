define(['Ti/_/lang', 'Ti/Tizen/Callhistory/CallHistoryEntry', 'Ti/Tizen/WebAPIError', 'Ti/_/Evented'], function(lang, CallHistoryEntry, WebAPIError, Evented) {
	return lang.setObject('Tizen.Callhistory', Evented, {

		find: function(successCallback /*CallHistoryEntryArraySuccessCallback*/, errorCallback /*ErrorCallback*/, filter /*AbstractFilter*/, sortMode /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
			tizen.callhistory.find(successCallback && function(histories) {
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
			return tizen.callhistory.remove(entry._obj);
		},

		removeBatch: function(entries /*CallHistoryEntry*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var i = 0,
				entriesCount = entries.length,
				result = [];

			for (; i < entriesCount; i++) {
				result.push(entries[i]._obj);
			}

			return tizen.callhistory.removeBatch(result, successCallback, errorCallback && function(error) {
				errorCallback(new WebAPIError(error));
			});
		},

		removeAll: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.callhistory.removeAll(successCallback, errorCallback && function(error) {
				errorCallback(new WebAPIError(error));
			});
		},

		addChangeListener: function(observer /*CallHistoryChangeCallback*/) {
			var object = {
				onadded: observer.onadded && function(entries) {
					var result = [],
						i = 0,
						entriesCount = entries.length;
					for(; i < entriesCount; i++) {
						result.push(new CallHistoryEntry(entries[i]));
					}
					observer.onadded(result);
				},
				onchange: observer.onchange && function(entries) {
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
			return tizen.callhistory.removeChangeListener(handle);
		},

	});
});