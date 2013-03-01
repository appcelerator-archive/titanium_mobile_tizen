/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		reportError,
		addressbook;

	var reportErrorMessage = function(err) {
		reportError(testRun, 'The following error occurred: ' +  err.message);
	}

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
		addressbook = tizen.contact.getDefaultAddressBook();
	}

	this.name = 'filters';
	this.tests = [
		{name: 'attributeFilterFullstring'},
	//	{name: 'attributeFliterContains'},
	//	{name: 'attributeFilterStartsWith'},
	//	{name: 'attributeFilterEndsWith'},
	//	{name: 'attributeFilterExists'},
		{name: 'attributeFilterWrongValue'},
		{name: 'compositeFilterUnionTest'},
		{name: 'compositeFilterIntersectionTest'},
		{name: 'rangeFilterTest'}
	]

	this.attributeFilterFullstring = function(testRun) {
		Ti.Contacts.Tizen.getAllPeople(function(persons) {
			var i = 0,
				personsCount = persons.length,
				person1, person2, filter;
			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}
			person1 = Ti.Contacts.createPerson({
				firstName: 'John'
			});
			person2 = Ti.Contacts.createPerson({
				firstName: 'Mark'
			});
			Ti.Contacts.Tizen.getPeopleWithName('John', function(persons) {
				valueOf(testRun, persons.length).shouldBe(1);
				valueOf(testRun, persons[0].toString()).shouldBe('[object TiContactsPerson]');
				finish(testRun);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.attributeFliterContains = function(testRun) {
		var contact1 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'John'
				})
			}),
			contact2 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'Mark'
				})
			});

		addressbook.find(function(contacts) {
			var ids = [];
			for (var i = 0; i < contacts.length; i++) {
				ids.push(contacts[i].id);
			}		
			addressbook.removeBatch(ids, function(){
				var filter = new tizen.AttributeFilter('name.firstName', 'Contains', 'Oh');
				addressbook.add(contact1);
				addressbook.add(contact2);
				addressbook.find(function(contacts){
					valueOf(testRun, contacts.length).shouldBe(1);
					finish(testRun);
				}, reportErrorMessage, filter);
			}, reportErrorMessage);
		}, reportErrorMessage);
		finish(testRun)
	}

	this.attributeFilterStartsWith = function(testRun) {
		var contact1 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'John'
				})
			}), 
			contact2 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'Mark'
				})
			});

		addressbook.find(function(contacts) {
			var ids = [];
			for (var i = 0; i < contacts.length; i++) {
				ids.push(contacts[i].id);
			}		
			addressbook.removeBatch(ids, function(){
				addressbook.add(contact1);
				addressbook.add(contact2);
				var filter = new tizen.AttributeFilter('name.firstName', 'STARTSWITH', 'Joh');
				addressbook.find(function(contacts){
					valueOf(testRun, contacts.length).shouldBe(1);
					finish(testRun);;
				}, reportErrorMessage, filter);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.attributeFilterEndsWith = function(testRun) {
		var contact1 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'John'
				})
			}), contact2 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'Mark'
				})
			});
		addressbook.find(function(contacts) {
			var ids = [];
			for (var i = 0; i < contacts.length; i++) {
				ids.push(contacts[i].id);
			}
			addressbook.removeBatch(ids, function(){
				addressbook.add(contact1);
				addressbook.add(contact2);
				var filter = new tizen.AttributeFilter('name.firstName', 'ENDSWITH', 'Hn');
				addressbook.find(function(contacts){
					Ti.API.info(contacts.length);
					valueOf(testRun, contacts.length).shouldBe(1);
					finish(testRun);
				}, reportErrorMessage, filter);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.attributeFilterExists = function(testRun) {
		var contact1 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'John'
				})
			}),
			contact2 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'Mark'
				})
			});

		addressbook.find(function(contacts) {
			var ids = [];
			for (var i = 0; i < contacts.length; i++) {
				ids.push(contacts[i].id);
			}			
			addressbook.removeBatch(ids, function(){
				addressbook.add(contact1);
				addressbook.add(contact2);
				var filter = new tizen.AttributeFilter('name.firstName', 'EXISTS');
				addressbook.find(function(contacts){
					Ti.API.info(contacts.length);
					valueOf(testRun, contacts.length).shouldBe(2);
					finish(testRun);
				}, reportErrorMessage, filter);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.attributeFilterWrongValue = function(testRun) {
		Ti.Contacts.Tizen.getAllPeople(function(persons) {
			var i = 0,
				personsCount = persons.length,
				person1, person2, filter;
			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}
			person1 = Ti.Contacts.createPerson({
				firstName: 'John'
			});
			Ti.Contacts.Tizen.getPeopleWithName('John111', function(persons) {
				valueOf(testRun, persons.length).shouldBe(0);
				finish(testRun);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.compositeFilterUnionTest = function(testRun) {
		Ti.Contacts.Tizen.getAllPeople(function(persons) {
			var i = 0,
				personsCount = persons.length,
				person1, person2, filter;
			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}
			person1 = Ti.Contacts.createPerson({
				firstName: 'John'
			});
			person2 = Ti.Contacts.createPerson({
				lastName: 'John'
			});
			Ti.Contacts.Tizen.getPeopleWithName('John', function(persons) {
				valueOf(testRun, persons.length).shouldBe(2);
				valueOf(testRun, persons[0].toString()).shouldBe('[object TiContactsPerson]');
				finish(testRun);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.compositeFilterIntersectionTest = function(testRun) {
		Ti.Contacts.Tizen.getAllPeople(function (persons) {
			var i = 0,
				personsCount = persons.length,
				person1, person2, filter;
			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}
			person1 = Ti.Contacts.createPerson({
				firstName: 'John',
				lastName: 'Smith'
			});
			person2 = Ti.Contacts.createPerson({
				firstName: 'Smith',
				lastName: 'John'
			});
			Ti.Contacts.Tizen.getPeopleWithName('John Smith', function(persons) {
				valueOf(testRun, persons.length).shouldBe(2);
				valueOf(testRun, persons[0].toString()).shouldBe('[object TiContactsPerson]');
				valueOf(testRun, persons[1].toString()).shouldBe('[object TiContactsPerson]');
				finish(testRun);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

// Please make a call before running this test
	this.rangeFilterTest = function(testRun) {
		var filter = Ti.Tizen.createAttributeRangeFilter({
				attributeName: 'startTime', 
				initialValue: new Date(2012, 0, 1),
				endValue: new Date()
			});
		Ti.Tizen.Call.CallHistory.find(function(results) {
			Ti.API.info(results.length);
			valueOf(testRun, results.length).shouldBeGreaterThan(0);
			finish(testRun);
		}, reportErrorMessage, filter);
	}
}