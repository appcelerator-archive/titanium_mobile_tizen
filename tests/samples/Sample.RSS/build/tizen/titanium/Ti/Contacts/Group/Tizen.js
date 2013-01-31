define(["Ti/_/Evented", "Ti/_/lang", "Ti/Contacts"], function(Evented, lang, Contacts) {
	
	return lang.setObject("Ti.Contacts.Group.Tizen",  Evented, {
		
		members: function(group, successCallback, errorCallback) {
			var categoryFilter = new tizen.AttributeFilter("categories", "FULLSTRING",  group.name), //create filter to get contacts with selected category
				self = this, addressbook = tizen.contact.getDefaultAddressBook();
			//find contacts with group
			addressbook.find(function(contacts){
				var contactsCount = contacts.length, i = 0, persons = [];
				for (; i < contactsCount; i++) {
					persons.push(Contacts._mapContactFromTizen(contacts[i]));
				}
				successCallback.call(self, persons);
			}, errorCallback, categoryFilter);
		},
		
		sortedMembers: function(sortBy, group, successCallback, errorCallback) {
			var categoryFilter = new tizen.AttributeFilter("categories", "FULLSTRING",  group.name), //create filter to get contacts with selected category
				self = this, sortField = (sortBy === Contacts.CONTACTS_SORT_FIRST_NAME) ? "name.firstName" : "name.lastName",
				sortMode = new tizen.SortMode(sortField, "ASC"), //create sortMode object to sort contacts
				addressbook = tizen.contact.getDefaultAddressBook();
			//find contacts with group and sorted
			addressbook.find(function(contacts){
				var contactsCount = contacts.length, i = 0, persons = [];
				for (; i < contactsCount; i++) {
					persons.push(Contacts._mapContactFromTizen(contacts[i]));
				}
				successCallback.call(self, persons);				
			}, errorCallback, categoryFilter, sortMode);
		},
		
		test: function() {
			alert('It works');
		}
	
	});
});