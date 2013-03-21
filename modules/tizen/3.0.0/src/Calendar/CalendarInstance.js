define(['Ti/_/declare', 'Ti/_/Evented', 'Calendar/CalendarEvent', 'Calendar/CalendarItem'], function(declare, Evented, CalendarEvent, CalendarItem) {
	var calendarInstance = declare(Evented, {
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
			}
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

				successCallback(wrappedItems);
			}

			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
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
				errorCallback(new WebAPIError(error));
			}

			this._obj.updateBatch(unwrapedItems, successCallback, errorCallback && wrappedErrorCallback, updateAllInstances);
		},

		remove: function(id /*CalendarItemId*/) {
			var obj;

			if (typeof(id) !== 'object' && typeof(id) === 'string') {
				obj = id;
			} else if (id.toString() == '[object TizenCalendarCalendarEventId]') {
				obj = id._obj;
			} else {
				Ti.API.error('Remove event error: unexpected type of CalendarItemId.');
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
				errorCallback(new WebAPIError(error));
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

				successCallback(calendarItems);
			}

			function wrappedErrorCallback(error) {
				errorCallback(new WebAPIError(error));
			}

			this._obj.find(
				calendarItemsListSuccesscallback,
				errorCallback && wrappedErrorCallback, 
				(filter && (filter.toString() == '[object TizenAttributeFilter]')) ? filter._obj : filter,
				(sortMode && (sortMode.toString() == '[object TizenSortMode]')) ? sortMode._obj : sortMode
			);
		},

		addChangeListener: function(successCallback /*CalendarChangeCallback*/) {
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
				onitemsadded: function(items) {
					successCallback.onitemsadded(getWrappedItems(items));
				},

				onitemsupdated: function(items) {
					successCallback.onitemsupdated(getWrappedItems(items));
				},

				onitemsremoved: function(items) {
					successCallback.onitemsremoved(getWrappedItems(items));
				}
			};

			return this._obj.addChangeListener(wrappedCallback);
		},

		removeChangeListener: function(watchId /*long*/) {
			this._obj.removeChangeListener(watchId);
		}
	});

	calendarInstance.prototype.declaredClass = 'Tizen.Calendar.CalendarInstance';

	return calendarInstance;
});