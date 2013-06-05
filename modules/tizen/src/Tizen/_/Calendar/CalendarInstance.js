// Wraps Tizen interface "CalendarInstance" that resides in Tizen module "Calendar".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/Calendar/CalendarEvent', 'Tizen/_/Calendar/CalendarItem', 'Tizen/_/Calendar/CalendarTask', 'Tizen/_/Calendar/CalendarEventId'],
	function(declare, Evented, CalendarEvent, CalendarItem, CalendarTask, CalendarEventId) {

		function onError (e, callback) {
			callback({
				code: e.code,
				success: false,
				error: e.type + ': ' + e.message
			});
		}

		var listening;

		var calendarInstance = declare(Evented, {

			constructor: function(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			},

			get: function(id /*CalendarItemId*/) {
				var calendarItem;

				if(typeof id === 'string'){
					calendarItem = new CalendarTask(void 0, this._obj.get(id));
				} else if(typeof id === 'object') {
					calendarItem = new CalendarEvent(void 0, this._obj.get(id._obj));
				}

				return calendarItem;
			},

			add: function(item /*CalendarItem*/) {
				this._obj.add(item._obj);
			},

			addBatch: function(items /*CalendarItem*/, callback) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var i = 0,
					itemsCount = items.length,
					unwrappedItems = [],
					args = [];

				for (; i < itemsCount; i++) {
					unwrappedItems.push(items[i]._obj);
				}

				args.push(unwrappedItems);
				(typeof callback !== 'undefined') && args.push(function(items) {
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
					},
					function(e) {
						onError(e, callback);
					}
				);

				this._obj.addBatch.apply(this._obj, args);
			},

			update: function(item /*CalendarItem*/, updateAllInstances /*boolean*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [ item._obj ];
				(typeof updateAllInstances !== 'undefined') && args.push(updateAllInstances);
				this._obj.update.apply(this._obj, args);
			},

			updateBatch: function(items /*CalendarItem*/, callback, updateAllInstances /*boolean*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var i = 0,
					itemsCount = items.length,
					unwrappeDItems = [],
					args = [];

				for (; i < itemsCount; i++) {
					unwrappeDItems.push(items[i]._obj);
				}

				args.push(unwrappeDItems);
				(typeof callback !== 'undefined') && args.push(function() {
						callback({
							code: 0,
							success: true
						});
					},
					function(e) {
						onError(e, callback);
					}
				);
				(typeof updateAllInstances !== 'undefined') && args.push(updateAllInstances);

				this._obj.updateBatch.apply(this._obj, args);
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
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var i = 0,
					idsCount = ids.length,
					unwrappedIds = [],
					args = [];

				for (; i < idsCount; i++) {
					unwrappedIds.push(ids[i]._obj);
				}

				args.push(unwrappedIds);
				(typeof callback !== 'undefined') && args.push(function() {
						callback({
							code: 0,
							success: true
						});
					},
					function(e) {
						onError(e, callback);
					}
				);

				this._obj.removeBatch.apply(this._obj, args);
			},

			find: function(callback, filter /*AbstractFilter*/, sortMode /*SortMode*/) {
				// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
				var args = [
					function(items) {
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
					function(e) {
						onError(e, callback);
					}
				];
				(typeof filter !== 'undefined') && args.push((filter && filter._obj) || filter);
				(typeof sortMode !== 'undefined') && args.push((sortMode && sortMode._obj) || sortMode);
				this._obj.find.apply(this._obj, args);
			},

			addEventListener: function () {
				var self = this;
				function wrapItems (items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						if(items[i].toString() === '[object CalendarEvent]') {
							wrappedItems.push(new CalendarEvent(void 0, items[i]));
						} else if(items[i].toString() === '[object CalendarTask]') {
							wrappedItems.push(new CalendarTask(void 0, items[i]));
						} else {
							console.error('Cannot wrap item: ' + items[i]);
						}
					}

					return wrappedItems;
				}

				function wrapIds (ids) {
					var i = 0,
						itemsCount = ids.length,
						wrappedIds = [];

					for (; i < itemsCount; i++) {
						if(typeof ids[i] === 'object') {
							wrappedIds.push(new CalendarEventId(void 0, ids[i]));
						} else if(typeof ids[i] === 'string') {
							wrappedIds.push(ids[i]);
						} else {
							console.error('Cannot wrap id: ' + ids[i]);
						}
					}

					return wrappedIds;
				}

				Evented.addEventListener.apply(this, arguments);

				if (! listening) {
					listening = true;
					this._obj.addChangeListener({
						onitemsadded: function (items) {
							self.fireEvent('itemsadded', {
								items: wrapItems(items)
							});
						},
						onitemsupdated: function(items) {
							self.fireEvent('itemsupdated', {
								items: wrapItems(items)
							});
						},
						onitemsremoved: function(ids) {
							self.fireEvent('itemsremoved', {
								ids: wrapIds(ids)
							});
						}
					});
				}
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
