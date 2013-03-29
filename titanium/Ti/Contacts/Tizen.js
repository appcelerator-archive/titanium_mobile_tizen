define(
	['Ti/_/Evented', 'Ti/_/lang', 'Ti/_/Contacts/helper', 'Ti/Contacts/Person'], 
	function(Evented, lang, contactHelper, Person, API) {
	
	return lang.setObject('Ti.Contacts.Tizen',  Evented, {
		
		getAllPeople: function(successCallback, errorCallback) {
			var self = this;
			//finds and return all tizen contacts
			tizen.contact.getDefaultAddressBook().find(function(contacts){
				var i = 0, 
					contactsCount = contacts.length, 
					persons = [];
				for (; i < contactsCount; i++) {
					persons.push(new Person(contactHelper.createTitaniumContact(contacts[i])));
				}
				successCallback(persons);
			}, errorCallback);
		},	

		getPeopleWithName: function(name, successCallback, errorCallback) {
			var names = name.trim().replace(/[ ]{2,}/g, ' ').split(' '), //trims input string and replaces spaces between words to one space 
				firstNameFilter, 
				lastNameFilter, 
				middleNameFilter, 
				i = 0, 
				namesCount = names.length,
				compositeFilters = [], 
				resultFilter, 
				self = this;
			//create case insensitive filter for first name, last name and middle name
			for (; i < namesCount; i++) {
				firstNameFilter = new tizen.AttributeFilter('name.firstName', 'FULLSTRING', names[i]);
				middleNameFilter = new tizen.AttributeFilter('name.middleName', 'FULLSTRING', names[i]);
				lastNameFilter = new tizen.AttributeFilter('name.lastName', 'FULLSTRING', names[i]);
				compositeFilters.push(new tizen.CompositeFilter('UNION', [firstNameFilter, middleNameFilter, lastNameFilter]));
			}
			resultFilter = new tizen.CompositeFilter('INTERSECTION',  compositeFilters);
			//find contacts with filter
			tizen.contact.getDefaultAddressBook().find(function(contacts){
				var contactsCount = contacts.length, 
					persons = [];
				for (i = 0; i < contactsCount; i++) {
					persons.push(new Person(contactHelper.createTitaniumContact(contacts[i])));
				}
				successCallback(persons);
			}, errorCallback, resultFilter);
		}
	});
});