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
				} else if (id instanceof tizen.TizenCalendarCalendarEventId) {
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
					(filter && (filter instanceof tizen.TizenAttributeFilter)) ? filter._obj : filter,
					(sortMode && (sortMode instanceof tizen.TizenSortMode)) ? sortMode._obj : sortMode
				);
			},

			addEventListener: function () {
				var self = this;
				function wrapItems (items) {
					var i = 0,
						itemsCount = items.length,
						wrappedItems = [];

					for (; i < itemsCount; i++) {
						if(items[i] instanceof tizen.CalendarEvent) {
							wrappedItems.push(new CalendarEvent(items[i]));
						} else {
							wrappedItems.push(new CalendarTask(items[i]));
						}
					}

					return wrappedItems;
				}

				function wrapIds (ids) {
					var i = 0,
						itemsCount = ids.length,
						wrappedIds = [];

					for (; i < itemsCount; i++) {
						if(typeof ids[i] === 'object'){
							wrappedIds.push(new CalendarEventId(ids[i]));
						} else {
							wrappedIds.push(ids[i]);
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
						onitemsupdated: function(items){
							self.fireEvent('itemsupdated', {
								items: wrapItems(items)
							});
						},
						onitemsremoved: function(ids){
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
