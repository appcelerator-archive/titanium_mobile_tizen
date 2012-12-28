module.exports = new function() {
	var finish;
	var valueOf;
	var reportError;
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}
	
	this.name = "calendar";
	this.tests = [
		 {name: "getEventCalendars"}
		,{name: "getTaskCalendars"}
		,{name: "getDefaultCalendar"}
		,{name: "createEvent"}
		,{name: "createTask"}
		,{name: "createEvents"}
		,{name: "createEventsBatch"}
		,{name: "updateEventsBatch"}
		,{name: "changeCallbacks"}
	]
	
	//helpers
	var finishError = function (testRun,errorMsg){
		Ti.API.info('The following error occurred: ' +  errorMsg);
		reportError(testRun,'The following error occurred: ' +  errorMsg);
		finish(testRun);
	};
	
	var checkCalendarItem = function(testRun,calendarItem) {
	/*
		readonly attribute CalendarItemId id;
		readonly attribute TZDate? lastModificationDate;
		attribute DOMString? description;
		attribute DOMString? summary;
		attribute boolean isAllDay;
		attribute TZDate? startDate;
		attribute TimeDuration? duration;
		attribute DOMString? location;
		attribute SimpleCoordinates? geolocation;
		attribute DOMString? organizer;
		attribute CalendarItemVisibility visibility;
		attribute CalendarItemStatus status;
		attribute CalendarItemPriority priority;
		attribute CalendarAlarm[] alarms;
		attribute DOMString[] categories;
		attribute CalendarAttendee[] attendees;
	*/
	}
	
	var createCalendarItem = function(testRun, calendarType){
		var calendar = tizen.calendar.getDefaultCalendar(calendarType);
		var today = new Date();
		// get current GMT time
		var h = today.getHours();
		var m = today.getMinutes();
		var dd = today.getDate();
		var mm = today.getMonth();
		var yy = today.getFullYear();
		//create event 1
		var itemParams = {
			description : calendarType + ' 1',
			summary : "Summary 1",
			startDate : new tizen.TZDate(yy, mm, dd, h, m),
			duration : new tizen.TimeDuration(1, "HOURS"),
			location : "Lviv"
		}
		var item = calendarType == "EVENT" ? new tizen.CalendarEvent(itemParams) : new tizen.CalendarTask(itemParams);
		calendar.add(item);
		Ti.API.info(calendarType +' id:' + item.id +'; id.uid:'+item.id.uid + ' has been added');
		
		//check item
		var filter = new tizen.AttributeFilter(calendarType == "EVENT" ? 'id.uid' : 'id', 'EXACTLY', calendarType == "EVENT" ? item.id.uid : item.id );
		calendar.find(
			//success
			function(items){
				//Check that array is not empty
				if (!items || items.length == 0) {
					errorCB({message:"Array items is empty"});
					return;
				}

				valueOf(testRun, items.length).shouldBe(1);
				Ti.API.info(calendarType +' id:' + items[0].id +'; id.uid:'+items[0].id.uid + " has been found");
				//check properties
				calendarType == "TASK" && valueOf(testRun, items[0].id).shouldBe(item.id);
				calendarType == "EVENT" && valueOf(testRun, items[0].id.uid).shouldBe(item.id.uid);
				checkCalendarItem(items[0]);
				//clear and finish
				calendar.remove(items[0].id);
				finish(testRun);
			}, 
			//error
			function(e){
				finishError(testRun,e);
			},
			filter
		);
	};
	
	//tests
	this.getEventCalendars = function(testRun) {
		
		function errorCB(e) {
			finishError(testRun,e);
		}
		function successCB(calendars) {
			valueOf(testRun, calendars.length).shouldBeGreaterThan(0);
			for (var i=0; i<calendars.length;i++){
				Ti.API.info('The calendar id:' + calendars[i].id + ', name:' + calendars[i].name + ', accountServiceId:' + calendars[i].accountServiceId);
			}
			finish(testRun);
	    }
	    tizen.calendar.getCalendars("EVENT", successCB, errorCB);
 	};
	
	this.getTaskCalendars = function(testRun) {
		function errorCB(e) {
			finishError(testRun, e);
		}
		function successCB(calendars) {
			valueOf(testRun, calendars.length).shouldBeGreaterThan(0);
			for (var i=0; i<calendars.length;i++){
				Ti.API.info('The calendar id:' + calendars[i].id + ', name:' + calendars[i].name + ', accountServiceId:' + calendars[i].accountServiceId);
			}
			
			finish(testRun);
	    }
	    tizen.calendar.getCalendars("TASK", successCB, errorCB);
 	};
	
	this.getDefaultCalendar = function(testRun) {
		var tc = tizen.calendar.getDefaultCalendar("TASK");
		valueOf(testRun, tc).shouldNotBeUndefined();
		valueOf(testRun, tc).shouldBeObject();
		valueOf(testRun, tc.id).shouldBeString();
		valueOf(testRun, tc.name).shouldBeString();
		Ti.API.info('The calendar id:' + tc.id + ', name:' + tc.name + ', accountServiceId:' + tc.accountServiceId);
		
		var ec = tizen.calendar.getDefaultCalendar("EVENT");
		valueOf(testRun, ec).shouldNotBeUndefined();
		valueOf(testRun, ec).shouldBeObject();
		valueOf(testRun, ec.id).shouldBeString();
		valueOf(testRun, ec.name).shouldBeString();
		Ti.API.info('The calendar id:' + ec.id + ', name:' + ec.name + ', accountServiceId:' + ec.accountServiceId);
		finish(testRun);
 	};
	
	this.createEvent = function(testRun){
		return createCalendarItem(testRun,"EVENT");
	}
	
	this.createTask = function(testRun){
		return createCalendarItem(testRun,"TASK");
	}
	
	this.createEvents = function(testRun){
		function errorCB(e) {
			finishError(testRun, e);
		}
		
		function successCB() {
			finish(testRun);
		}
				
		var calendar = tizen.calendar.getDefaultCalendar("EVENT");
		var today = new Date();
		// get current GMT time
		var h = today.getHours();
		var m = today.getMinutes();
		var dd = today.getDate();
		var mm = today.getMonth();
		var yy = today.getFullYear();
		//create event 1
		var ev = new tizen.CalendarEvent({
			description : "SuperEvent...1",
			summary : "Summary 1",
			startDate : new tizen.TZDate(yy, mm, dd, h, m),
			duration : new tizen.TimeDuration(1, "HOURS"),
			location : "Lviv"
		});
		calendar.add(ev);
		Ti.API.info('event id:' + ev.id +'; ev.id.uid:'+ev.id.uid + 'has been added');
		//create event 2
		var ev = new tizen.CalendarEvent({
			description : "SuperEvent...2",
			summary : "Summary 2",
			startDate : new tizen.TZDate(yy, mm, dd, h+1, m),
			duration : new tizen.TimeDuration(1, "HOURS"),
			location : "Lviv"
		});
		calendar.add(ev);
		Ti.API.info('event id:' + ev.id +'; ev.id.uid:'+ev.id.uid + ' has been added');	
		
		//check events
		var filter = new tizen.AttributeFilter('description', 'CONTAINS', 'SuperEvent');
		var sortingMode = new tizen.SortMode('summary', 'ASC');
        calendar.find(
			//success
			function(events){
				//Check that array is not empty
				if (!events || events.length == 0) {
					errorCB({message:"Array of events is empty"});
					return;
				}
				valueOf(testRun, events.length).shouldBeGreaterThan(1);
				var idEvents = [];
				for(var i=0; i<events.length;i++) {
					Ti.API.info('event id:' + events[i].id +'; ev.id.uid:'+events[i].id.uid + " has been found");
					idEvents.push(events[i].id);
					checkCalendarItem(events[i]);
					//test description	
					valueOf(testRun, events[i].description).shouldContain('SuperEvent');
				}
				
				//clear events and finish	
				calendar.removeBatch(idEvents, successCB, errorCB);
			}, 
			//error
			errorCB,
			filter,	
			sortingMode
		);
	};
	
	this.createEventsBatch = function(testRun){
		function errorCB(e) {
			finishError(testRun, e);
		}
		
		function successCB() {
			finish(testRun);
		}
		
		function addEventsBatchCB(events) {
				//Check that array is not empty
				if (!events || events.length == 0) {
					errorCB({message:"Array of events is empty"});
					return;
				}
				valueOf(testRun, events.length).shouldBeGreaterThan(1);
				var idEvents = [];
				for(var i=0; i<events.length;i++) {
					Ti.API.info('event id:' + events[i].id +'; ev.id.uid:'+events[i].id.uid + " has been added");
					idEvents.push(events[i].id);
				}
				//clear events and finish	
				calendar.removeBatch(idEvents, successCB, errorCB);
		}
		
		//create and addBatch
		var calendar = tizen.calendar.getDefaultCalendar("EVENT");
		var today = new Date();
		// get current GMT time
		var h = today.getHours();
		var m = today.getMinutes();
		var dd = today.getDate();
		var mm = today.getMonth();
		var yy = today.getFullYear();
		//create event 1
		var ev1 = new tizen.CalendarEvent({
			description : "Event 1",
			summary : "Summary 1",
			startDate : new tizen.TZDate(yy, mm, dd, h, m),
			duration : new tizen.TimeDuration(1, "HOURS"),
			location : "Lviv"
		});
		
		//create event 2
		var ev2 = new tizen.CalendarEvent({
			description : "Event 2",
			summary : "Summary 2",
			startDate : new tizen.TZDate(yy, mm, dd, h+1, m),
			duration : new tizen.TimeDuration(1, "HOURS"),
			location : "Lviv"
		});
		
		calendar.addBatch([ev1, ev2], addEventsBatchCB, errorCB);
	};
	
	this.updateEventsBatch = function(testRun){
		function errorCB(e) {
			finishError(testRun, e);
		}
		
		function successCB() {
			finish(testRun);
		}
		
		function updateEventsCB() {
			//find again
			calendar.find(findEventsCB,errorCB,filter);
		}
		
		function findEventsCB(events) {
			//Check that array is not empty
			if (!events || events.length == 0) {
				errorCB({message:"Array events is empty"});
				return;
			}
			
			Ti.API.info('event ev.id.uid:'+events[0].id.uid + 'has been found, summary:' + events[0].summary);
			//update or finish
			if (!isUpdated) {
				try {
					events[0].summary = 'new summary 1';
					calendar.updateBatch([events[0]], updateEventsCB, errorCB);
					isUpdated = true;
				} catch (e) {
					finishError(testRun, e);
				}
			} else {
				//check updated values
				valueOf(testRun, events[0].summary).shouldBe('new summary 1');
				//clear and finish
				calendar.remove(events[0].id);
				finish(testRun);
			}
		}
		
		//create events
		var calendar = tizen.calendar.getDefaultCalendar("EVENT");
		var today = new Date();
		// get current GMT time
		var h = today.getHours();
		var m = today.getMinutes();
		var dd = today.getDate();
		var mm = today.getMonth();
		var yy = today.getFullYear();
		//create event
		var ev = new tizen.CalendarEvent({
			description : "Event 1",
			summary : "Summary 1",
			startDate : new tizen.TZDate(yy, mm, dd, h, m),
			duration : new tizen.TimeDuration(1, "HOURS"),
			location : "Lviv"
		});
		calendar.add(ev);
		Ti.API.info('event id:' + ev.id +'; ev.id.uid:'+ev.id.uid + 'has been added');
		
		//find item
		var isUpdated = false;
		var filter = new tizen.AttributeFilter('id.uid', 'EXACTLY', ev.id.uid);
		calendar.find(findEventsCB,errorCB,filter);
	};
	
	this.changeCallbacks = function(testRun){
		
		function errorCB(e) {
			finishError(testRun, e);
		}
		
		function successCB() {
			finish(testRun);
		}

		function test() {
			var checkEvent = function(eventName, items, callback){
				Ti.API.info(eventName);
				var checkedEvent;
				for (var i=0; i<items.length; i++) {
					Ti.API.info('event id:' + items[i].id +'; id.uid:'+items[i].id.uid + '; summary:' + items[i].summary);
					//find our event
					if (eventUID == items[i].id.uid){
						checkedEvent = items[i];
						break;
					}
				}
				
				if (checkedEvent) {
					valueOf(testRun, checkedEvent.summary).shouldBe(eventName);
					callback && callback(checkedEvent);
				}
			}
			
			var watcher = {
				onitemsadded: function(items) {
					checkEvent("ADDED", items, function(event){
						event.summary = "UPDATED";
						calendar.update(event);
					});
				},
				onitemsupdated: function(items) {
					checkEvent("UPDATED", items, function(event){
						event.summary = "REMOVED";
						calendar.remove(event.id);
					});
				},
				onitemsremoved: function(ids) {
					if (ids.indexOf(eventUID)){
						Ti.API.info('REMOVED: '+ eventUID);
						successCB();
					} else {
						errorCB({message:'Cannot find '+eventUID+' in list of IDs'});
					}
				}
			};
			
			var eventUID;
			var calendar = tizen.calendar.getDefaultCalendar("EVENT");
			try {
				//add Listener 
				var watcherId = calendar.addChangeListener(watcher, errorCB);
				//create and add event
				var today = new Date();
				var h = today.getHours();
				var m = today.getMinutes();
				var dd = today.getDate();
				var mm = today.getMonth();
				var yy = today.getFullYear();
				var ev = new tizen.CalendarEvent({
					description : "test events",
					summary : "ADDED",
					startDate : new tizen.TZDate(yy, mm, dd, h, m),
					duration : new tizen.TimeDuration(1, "HOURS"),
					location : "Lviv"
				});
				calendar.add(ev);
				eventUID = ev.id.uid;
			} catch (e) {
				errorCB(e);
			}
		}
		
		test();
	};
	
//end tests
}	
