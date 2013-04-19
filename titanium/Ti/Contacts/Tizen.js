define(
	['Ti/_/Evented', 'Ti/_/lang', 'Ti/_/Contacts/helper'],
	function(Evented, lang, contactHelper) {

	function errorCallback(e, callback) {
		callback({
			code: -1,
			error: e.type + ': ' + e.message,
			success: false
		});
	}

	return lang.setObject('Ti.Contacts.Tizen',  Evented, {

		getAllPeople: function(callback) {
			// Finds and returns all Tizen contacts.
			tizen.contact.getDefaultAddressBook().find(function(contacts) {
				var i = 0,
					contactsCount = contacts.length,
					persons = [],
					Person = require('Ti/Contacts/Person');
				for (; i < contactsCount; i++) {
					persons.push(new Person(contactHelper.createTitaniumContact(contacts[i])));
				}
				callback({
					code: 0,
					success: true,
					persons: persons
				});
			}, function (e) {
				errorCallback(e, callback);
			});
		},

		getPeopleWithName: function(name, callback) {
			var names = name.trim().replace(/[ ]{2,}/g, ' ').split(' '), // Trims input string and collapses spaces between words to single space.
				firstNameFilter,
				lastNameFilter,
				middleNameFilter,
				i = 0,
				namesCount = names.length,
				compositeFilters = [],
				response = {
					code: 0,
					success: true
				},
				resultFilter;

			// Create case insensitive filter for first name, last name and middle name.
			for (; i < namesCount; i++) {
				firstNameFilter = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', names[i]);
				middleNameFilter = new tizen.AttributeFilter('name.middleName', 'FULLSTRING', names[i]);
				lastNameFilter = new tizen.AttributeFilter('name.lastName', 'FULLSTRING', names[i]);
				compositeFilters.push(new tizen.CompositeFilter('UNION', [firstNameFilter, middleNameFilter, lastNameFilter]));
			}
			resultFilter = new tizen.CompositeFilter('INTERSECTION',  compositeFilters);

			// Find contacts with filter.
			tizen.contact.getDefaultAddressBook().find(function(contacts) {
				var contactsCount = contacts.length,
					persons = [],
					Person = require('Ti/Contacts/Person');
				for (i = 0; i < contactsCount; i++) {
					persons.push(new Person(contactHelper.createTitaniumContact(contacts[i])));
				}
				callback({
					code: 0,
					success: true,
					persons: persons
				});
			}, function (e) {
				errorCallback(e, callback);
			}, resultFilter);
		}
	});
});