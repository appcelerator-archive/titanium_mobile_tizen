define(['Ti/_/declare', 'Ti/Tizen/Calendar/CalendarEvent', 'Ti/Tizen/Calendar/CalendarItem'], function(declare, CalendarEvent, CalendarItem) {
	return declare('Ti.Tizen.Calendar.Calendar', null, {
		constructor: function(args) {
			this._obj = args;
		},

		constants: {
			id: {
				get: function() {
					return this._obj.id;
				}
			},
			name: {
				get: function() {
					return this._obj.name;
				}
			},
		},

		get: function(id /*CalendarItemId*/) {
			return new CalendarEvent(this._obj.get(id._obj));
		},

		add: function(item /*CalendarItem*/) {
			this._obj.add(item._obj);
		},

		addBatch: function(items /*CalendarItem*/, successCallback /*CalendarItemArraySuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var i = 0,
				itemsCount = items.length,
				unwrappedItems = [];

			for (; i < itemsCount; i++) {
				unwrappedItems.push(items[i]._obj);
			}

			function calendarItemsSuccessCallback(objects) {
				var objectsCount = objects.length,
					wrappedItems = [];

				for (i = 0; i < objectsCount; i++) {
					wrappedItems.push(new CalendarItem(objects[i]));
				} 

				successCallback.call(this, wrappedItems);
			}

			function wrappedErrorCallback(error) {
				errorCallback.call(null, new WebAPIError(error));
			}

			this._obj.addBatch(unwrappedItems, successCallback && calendarItemsSuccessCallback, errorCallback && wrappedErrorCallback);
		},

		update: function(item /*CalendarItem*/, updateAllInstances /*boolean*/) {
			this._obj.update(item._obj, updateAllInstances);
		},

		updateBatch: function(items /*CalendarItem*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/, updateAllInstances /*boolean*/) {
			var i = 0,
				itemsCount = items.length,
				unwrapedItems = [];

			for (; i < itemsCount; i++) {
				unwrapedItems.push(items[i]._obj);
			}

			function wrappedErrorCallback(error) {
				errorCallback.call(null, new WebAPIError(error));
			}

			this._obj.updateBatch(unwrapedItems, successCallback, errorCallback && wrappedErrorCallback, updateAllInstances);
		},

		remove: function(id /*CalendarItemId*/) {
			var obj;

			if (typeof(id) !== 'object' && typeof(id) === 'string') {
				obj = id;
			} else if (id.toString() == '[object TiTizenCalendarCalendarEventId]') {
				obj = id._obj;
			} else {
				Ti.API.error('Unexpected type of CalendarItemId.');
			}

			this._obj.remove(obj);
		},

		removeBatch: function(ids /*CalendarItemId*/, successCallback /*SuccessCallback*/, errorCallback /*ErrorCallback*/) {
			var i = 0,
				idsCount = ids.length,
				unwrapedIds = [];

			for (; i < idsCount; i++) {
				unwrapedIds.push(ids[i]._obj);
			}

			function wrappedErrorCallback(error) {
				errorCallback.call(null, new WebAPIError(error));
			}

			this._obj.removeBatch(unwrapedIds, successCallback, errorCallback && wrappedErrorCallback);
		},

		find: function(successCallback /*CalendarItemArraySuccessCallback*/, errorCallback /*ErrorCallback*/, filter /*AbstractFilter*/, sortMode /*SortMode*/) {
			function calendarItemsListSuccesscallback(items) {
				var i = 0,
					len = items.length,
					calendarItems = [];

				for (; i < len; i++) {
					calendarItems.push(new CalendarItem(items[i]));
				}

				successCallback.call(this, calendarItems);
			}

			function wrappedErrorCallback(error) {
				errorCallback.call(null, new WebAPIError(error));
			}

			this._obj.find(
				successCallback && calendarItemsListSuccesscallback,
				errorCallback && wrappedErrorCallback, 
				(filter && (filter.toString() == '[object TiTizenAttributeFilter]')) ? filter._obj : filter,
				(sortMode && (sortMode.toString() == '[object TiTizenSortMode]')) ? sortMode._obj : sortMode
			);
		},

		addChangeListener: function(successCallback /*CalendarChangeCallback*/, errorCallback /*ErrorCallback*/) {
			function getWrappedItems(items) {
				var i = 0,
					itemsCount = items.length,
					wrappedItems = [];

				for (; i < itemsCount; i++) {
					wrappedItems.push(new CalendarItem(items[i]));
				}

				return wrappedItems;
			}

			var wrappedCallback = {
				onitemsadded: successCallback.onitemsadded && function(items) {
					successCallback.onitemsadded.call(this, getWrappedItems(items));
				},

				onitemsupdated: successCallback.onitemsupdated && function(items) {
					successCallback.onitemsupdated.call(this, getWrappedItems(items));
				},

				onitemsremoved: successCallback.onitemsremoved &&function(items) {
					successCallback.onitemsremoved.call(this, getWrappedItems(items));
				}
			};

			return this._obj.addChangeListener(wrappedCallback);
		},

		removeChangeListener: function(watchId /*long*/) {
			this._obj.removeChangeListener(watchId);
		}
	});
});