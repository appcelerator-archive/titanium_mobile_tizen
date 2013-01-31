define(["Ti/_/Evented", "Ti/_/lang", "Ti/Contacts", "Ti/Contacts/Group/Tizen"], function(Evented, lang, Contacts, GroupTizen) {
	
	return lang.setObject("Ti.Contacts.Tizen",  Evented, {
		
		getAllPeople: function(successCallback, errorCallback) {
			var self = this;
			//finds and return all tizen contacts
			tizen.contact.getDefaultAddressBook().find(function(contacts){
				var i = 0, contactsCount = contacts.length, persons = [];
				for (i = 0; i < contactsCount; i++) {
					persons.push(Contacts._mapContactFromTizen(contacts[i]));
				}
				successCallback.call(self, persons);
			}, errorCallback);
		},	

		getPeopleWithName: function(name, successCallback, errorCallback) {
			var names = name.trim().replace(/[ ]{2,}/g, " ").split(' '), //trims input string and replaces spaces between words to one space 
				firstNameFilter, lastNameFilter, middleNameFilter, i = 0, namesCount = names.length,
				compositeFilters = [], resultFilter, self = this;
			//create case insensitive filter for first name, last name and middle name
			for (i = 0; i < namesCount; i++) {
				firstNameFilter = new tizen.AttributeFilter("name.firstName", "FULLSTRING", names[i]);
				middleNameFilter = new tizen.AttributeFilter("name.middleName", "FULLSTRING", names[i]);
				lastNameFilter = new tizen.AttributeFilter("name.lastName", "FULLSTRING", names[i]);
				compositeFilters.push(new tizen.CompositeFilter("UNION", [firstNameFilter, middleNameFilter, lastNameFilter]));
			}
			resultFilter = new tizen.CompositeFilter("INTERSECTION",  compositeFilters);
			//find contacts with filter
			tizen.contact.getDefaultAddressBook().find(function(contacts){
				var contactsCount = contacts.length, persons = [];
				for (i = 0; i < contactsCount; i++) {
					persons.push(Contacts._mapContactFromTizen(contacts[i]));
				}
				successCallback.call(self, persons);
			}, errorCallback, resultFilter);
		},
		
		removeGroup: function(group, successCallback, errorCallback){
			var categoryFilter = new tizen.AttributeFilter("categories", "FULLSTRING", group.name), //create filter to get contacts with selected category 
				addressbook = tizen.contact.getDefaultAddressBook();
			//tizen hasn't groups, it has string categories like tags
			//to remove some category(group) we need to remove it from each contact and then saves all changes
			addressbook.find(function(contacts) {
				var i = 0, j = 0, categoryIndex = -1, categoriesCount = 0, contactsCount = contacts.length, categories = [];
				for (; i < contactsCount; i++) {
					categoryIndex = -1;
					categories = contacts[i].categories;
					categoriesCount = categories.length;
					for (j = 0; j < categoriesCount; j++) {
						if (categories[j] === group.name) {
							categoryIndex = j;
							break;
						} 
					}
					categories.splice(categoryIndex, 1);
					contacts[i].categories = categories;
				}
				//async update contacts
				addressbook.updateBatch(contacts, successCallback, errorCallback);
			}, errorCallback, categoryFilter);
		}
	});
});