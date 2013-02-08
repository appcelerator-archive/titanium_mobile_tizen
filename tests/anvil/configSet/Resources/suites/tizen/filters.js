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
		{name: 'attributeFliterExactly'},
		{name: 'attributeFilterFullstring'},
		{name: 'attributeFliterContains'},
		{name: 'attributeFilterStartsWith'},
		{name: 'attributeFilterEndsWith'},
		{name: 'attributeFilterExists'},
		{name: 'attributeFilterWrongValue'},
		{name: 'compositeFilterUnionTest'},
		{name: 'compositeFilterIntersectionTest'},
		{name: 'rangeFilterTest'}
	]

	this.attributeFliterExactly = function(testRun) {
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
				var filter = new tizen.AttributeFilter('name.firstName', 'EXACTLY', 'John');
				addressbook.add(contact1);
				addressbook.add(contact2);
				addressbook.find(function(contacts){
					valueOf(testRun, contacts.length).shouldBe(1);
					finish(testRun);
					}, reportErrorMessage, filter);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.attributeFilterFullstring = function(testRun) {
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
				var filter = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', 'John');
				addressbook.add(contact1);
				addressbook.add(contact2);
				addressbook.find(function(contacts){
					valueOf(testRun, contacts.length).shouldBe(1);
					finish(testRun);
				}, reportErrorMessage, filter);
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
				var filter = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', 'QJohn');
				addressbook.find(function(contacts){
					valueOf(testRun, contacts.length).shouldBe(0);
					finish(testRun);
				}, reportErrorMessage, filter);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.compositeFilterUnionTest = function(testRun) {
		var contact1 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'John',
					lastName: 'Smith',
					middleName: 'Middle'
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
				var filter1 = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', 'John'),
					filter2 = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', 'Mille'),
					filter3 = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', 'Smith'),
					filter = new tizen.CompositeFilter('UNION', [filter1, filter2, filter3]);
				addressbook.find(function(contacts){
					valueOf(testRun, contacts.length).shouldBe(1);
					finish(testRun);
				}, reportErrorMessage, filter);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.compositeFilterIntersectionTest = function(testRun) {
		var contact1 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'John',
					lastName: 'Smith',
					middleName: 'Middle'
				})
			}), contact2 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'Middle',
					lastName: 'John',
					middleName: 'Smith'
				})
			}), contact3 = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: 'Smith',
					lastName: 'Middle',
					middleName: 'John'
				})
			}), names = ['John', 'Middle', 'Smith'];
		addressbook.find(function(contacts) {
			var ids = [];
			for (var i = 0; i < contacts.length; i++) {
				ids.push(contacts[i].id);
			}		
			addressbook.removeBatch(ids, function(){
				var compositeFilters = [];
				addressbook.add(contact1);
				addressbook.add(contact2);
				addressbook.add(contact3);
				for (i = 0; i < names.length; i++) {
					firstNameFilter = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', names[i]);
					middleNameFilter = new tizen.AttributeFilter('name.middleName', 'FULLSTRING', names[i]);
					lastNameFilter = new tizen.AttributeFilter('name.lastName', 'FULLSTRING', names[i]);
					compositeFilters.push(new tizen.CompositeFilter('UNION', [firstNameFilter, middleNameFilter, lastNameFilter]));
				}
				var resultFilter = new tizen.CompositeFilter('INTERSECTION',  compositeFilters);
				addressbook.find(function(contacts){
					valueOf(testRun, contacts.length).shouldBe(3);
					finish(testRun);
				}, reportErrorMessage, resultFilter);
			}, reportErrorMessage);
		}, reportErrorMessage);
	}

	this.rangeFilterTest = function(testRun) {
		var filter = new tizen.AttributeRangeFilter('startTime', new Date(2012, 0, 1), new Date());
		tizen.call.history.find(function(results) {
			Ti.API.info(results.length);
			valueOf(testRun, results.length).shouldBeGreaterThan(0);
			finish(testRun);
		}, reportErrorMessage, filter);
	}
}
