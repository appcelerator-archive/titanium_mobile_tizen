define(['Ti/_/lang', 'Ti/Tizen/Call/CallHistoryEntry'], function(lang, CallHistoryEntry){
	return lang.setObject('Ti.Tizen.Call.CallHistory', {
		find: function(successCallback /*CallHistoryEntryArraySuccessCallback*/, errorCallback /*ErrorCallback*/, filter /*AbstractFilter*/, sortMode /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
			tizen.call.history.find(function(histories) {
				var result = [],
					historiesCount = histories.length,
					i = 0,
					self = this;
				for (; i < historiesCount; i++) {
					result.push(new CallHistoryEntry(histories[i]));
				}
				successCallback.call(self, result);
			}, errorCallback, filter ? filter._obj : filter, sortMode ? sortMode._obj : sortMode, limit, offset);
		},

		remove: function(entry /*CallHistoryEntry*/) {
			return tizen.call.history.remove(entry._obj);
		},

		removeBatch: function(entries /*CallHistoryEntry*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var i = 0,
				entriesCount = entries.length,
				result = [];
			for (; i < entriesCount; i++) {
				result.push(entries[i]._obj);
			}
			return tizen.call.history.removeBatch(result, successCallback, errorCallback);
		},

		removeAll: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.call.history.removeAll(successCallback, errorCallback);
		},

		deleteRecording: function(historyEntry /*CallHistoryEntry*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.call.history.deleteRecording(historyEntry._obj, successCallback, errorCallback);
		},

		addListener: function(observer /*CallHistoryChangeCallback*/) {
			return tizen.call.history.addListener(observer);
		},

		removeListener: function(handle /*long*/) {
			return tizen.call.history.removeListener(handle);
		}
	});
});