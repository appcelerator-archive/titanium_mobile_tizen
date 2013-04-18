// Wraps Tizen interface "CalendarInstance" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Calendar/CalendarEvent', 'Tizen/_/Calendar/CalendarItem'],
	function(declare, Evented, CalendarEvent, CalendarItem) {

		function onError (e, callback) {
			callback({
				code: e.code,
				success: false,
				error: e.type + ': ' + e.message
			});
		}

		var calendarInstance = declare(Evented, {

			constructor: function(args) {
				// args is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = args;
			},

			get: function(id /*CalendarItemId*/) {
				return new CalendarEvent(this._obj.get(id._obj));
			},

			add: function(item /*CalendarItem*/) {
				this._obj.add(item._obj);
			},

			addBatch: function(items /*CalendarItem*/, callback) {
				var i = 0,
					itemsCount = items.length,
					unwrappedItems = [];

				for (; i < itemsCount; i++) {
					unwrappedItems.push(items[i]._obj);
				}

				this._obj.addBatch(unwrappedItems, callback && function(items){
					var objectsCount = items.length,
						wrappedItems = [];

					for (i = 0; i < objectsCount; i++) {
						wrappedItems.push(new CalendarItem(items[i]));
					}

					callback({
						code: 0,
						success: true,
						items: wrappedItems
					});
				}, callback && function(e) {
						onError(e, callback);
					});
			},

			update: function(item /*CalendarItem*/, updateAllInstances /*boolean*/) {
				this._obj.update(item._obj, updateAllInstances);
			},

			updateBatch: function(items /*CalendarItem*/, callback, updateAllInstances /*boolean*/) {
				var i = 0,
					itemsCount = items.length,
					unwrapedItems = [];

				for (; i < itemsCount; i++) {
					unwrapedItems.push(items[i]._obj);
				}

				this._obj.updateBatch(unwrapedItems,
					callback && function(){
						callback({
							code: 0,
							success: true
						});
					},
					callback && function(e) {
						onError(e, callback);
					},
					updateAllInstances
				);
			},

			remove: function(id /*CalendarItemId*/) {
				var obj;

				if (typeof(id) !== 'object' && typeof(id) === 'string') {
					obj = id;
				} else if (id.toString() == '[object TizenCalendarCalendarEventId]') {
					obj = id._obj;
				} else {
					console.error('Remove event error: unexpected type of CalendarItemId.');
				}

				this._obj.remove(obj);
			},

			removeBatch: function(ids /*CalendarItemId*/, callback) {
				var i = 0,
					idsCount = ids.length,
					unwrapedIds = [];

				for (; i < idsCount; i++) {
					unwrapedIds.push(ids[i]._obj);
				}

				this._obj.removeBatch(unwrapedIds, callback && function() {
					callback({
						code: 0,
						success: true
					});
				}, callback && function(e) {
					onError(e, callback);
				});
			},

			find: function(callback, filter /*AbstractFilter*/, sortMode /*SortMode*/) {
				this._obj.find(
					callback && function(items) {
						var i = 0,
							len = items.length,
							calendarItems = [];

						for (; i < len; i++) {
							calendarItems.push(new CalendarItem(items[i]));
						}

						callback({
							code: 0,
							success: true,
							items: calendarItems
						});
					},
					callback && function(e) {
						onError(e, callback);
					},
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
			}

		});

		// Initialize declaredClass, so that toString() works properly on such objects.
		// Correct operation of toString() is required for proper wrapping and automated testing.
		calendarInstance.prototype.declaredClass = 'Tizen.Calendar.CalendarInstance';
		return calendarInstance;
	});
