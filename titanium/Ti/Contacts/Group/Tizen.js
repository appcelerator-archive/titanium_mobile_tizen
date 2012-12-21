define(["Ti/_/Evented", "Ti/_/lang", "Ti/Contacts"], function(Evented, lang, Contacts) {
	
	return lang.setObject("Ti.Contacts.Group_Tizen",  Evented, {
		
		members: function(group, successCallback, errorCallback) {
			var categoryFilter = new tizen.AttributeFilter("categories", "FULLSTRING",  group.name), self = this,
				addressbook = tizen.contact.getDefaultAddressBook();
			addressbook.find(function(contacts){
				var contactsCount = contacts.length, i = 0, persons = [];
				for (; i < contactsCount; i++) {
					persons.push(Contacts._mapContactFromTizen(contacts[i]));
				}
				successCallback.call(self, persons);
			}, errorCallback, categoryFilter);
		},
		
		sortedMembers: function(sortBy, group, successCallback, errorCallback) {
			alert('sorted start');
			var categoryFilter = new tizen.AttributeFilter("categories", "FULLSTRING",  group.name), self = this,
				sortField = (sortBy === Contacts.CONTACTS_SORT_FIRST_NAME) ? "name.firstName" : "name.lastName";
				alert('before sort mode');
			var sortMode = new tizen.SortMode(sortField, "ASC"),
				addressbook = tizen.contact.getDefaultAddressBook();
			alert('before find');
			addressbook.find(function(contacts){
				var contactsCount = contacts.length, i = 0, persons = [];
				for (; i < contactsCount; i++) {
					persons.push(Contacts._mapContactFromTizen(contacts[i]));
				}
				successCallback.call(self, persons);				
			}, errorCallback, categoryFilter, sortMode);
		}
	
	});
});