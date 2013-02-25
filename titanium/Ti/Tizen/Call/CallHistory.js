define(['Ti/_/lang', 'Ti/Tizen/Call/CallHistoryEntry', 'Ti/Tizen/WebAPIError'], function(lang, CallHistoryEntry, WebAPIError){

	return lang.setObject('Ti.Tizen.Call.CallHistory', {

		find: function(successCallback /*CallHistoryEntryArraySuccessCallback*/, errorCallback /*ErrorCallback*/, filter /*AbstractFilter*/, sortMode /*SortMode*/, limit /*unsigned long*/, offset /*unsigned long*/) {
			tizen.call.history.find(function(histories) {
				var result = [],
					historiesCount = histories.length,
					i = 0;
				for (; i < historiesCount; i++) {
					result.push(new CallHistoryEntry(histories[i]));
				}
				successCallback.call(null, result);
			}, function(error) {
				errorCallback.call(null, new WebAPIError(error));
			}, filter ? filter._obj : filter, sortMode ? sortMode._obj : sortMode, limit, offset);
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

			return tizen.call.history.removeBatch(result, successCallback, function(error) {
				errorCallback.call(null, new WebAPIError(error));
			});
		},

		removeAll: function(successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.call.history.removeAll(successCallback, function(error) {
				errorCallback.call(null, new WebAPIError(error));
			});
		},

		deleteRecording: function(historyEntry /*CallHistoryEntry*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			return tizen.call.history.deleteRecording(historyEntry._obj, successCallback, function(error) {
				errorCallback.call(null, new WebAPIError(error));
			});
		},

		addListener: function(observer /*CallHistoryChangeCallback*/) {
			var object = {
				onadded: function(entries) {
					if (observer.onadded) {
						Ti.API.info('Execute onadded');
						var result = [],
							i = 0,
							entriesCount = entries.length;
						for(; i < entriesCount; i++) {
							result.push(new CallHistoryEntry(entries[i]));
						}
						Ti.API.info('Before native call');
						observer.onadded.call(null, result);
					}
				},
				onchange: function(entries) {
					if (observer.onchange) {
						var result = [],
							i = 0,
						entriesCount = entries.length;
						for (; i < entriesCount; i++) {
							result.push(new CallHistoryEntry(entries[i]));
						}
						observer.onchange.call(this, result);
					}
				}
			}
			return tizen.call.history.addListener(object);
		},

		removeListener: function(handle /*long*/) {
			return tizen.call.history.removeListener(handle);
		}
	});
});