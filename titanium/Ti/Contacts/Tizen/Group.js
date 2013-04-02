define(['Ti/_/Evented', 'Ti/_/lang', 'Ti/Tizen/_/contactHelper', 'Ti/Contacts/Person'], function(Evented, lang, contactHelper, Person) {

	return lang.setObject('Ti.Contacts.Tizen.Group', Evented, {

		members: function(group, successCallback, errorCallback) {
			var groupFilter = new tizen.AttributeFilter('groupIds', 'CONTAINS',  group.recordId), //create filter to get contacts with selected group
				self = this,
				id = group.recordId,
				addressbook = tizen.contact.getDefaultAddressBook();
			//find contacts with group
			addressbook.find(function(contacts){
				var contactsCount = contacts.length, 
					i = 0, 
					groupsCount, j, groupIds,
					persons = [];
				for (; i < contactsCount; i++) {
					groupIds = contacts[i].groupIds
					groupsCount = groupIds.length;
					// Tizen's contact object contains group ids in array, but it doesn't support indexOf method
					// So we need a loop to find a value
					for (j = 0; j < groupsCount; j++) {
						if (groupIds[j] === group.recordId) {
							persons.push(new Person(contactHelper.createTitaniumContact(contacts[i])));
							break;
						}
					}
				}
				successCallback.call(self, persons);
			}, errorCallback);
		},

		sortedMembers: function(sortBy, group, successCallback, errorCallback) {
			var categoryFilter = new tizen.AttributeFilter('categories', 'FULLSTRING',  group.name), //create filter to get contacts with selected category
				self = this, 
				sortField = (sortBy === Ti.Contacts.CONTACTS_SORT_FIRST_NAME) ? 'name.firstName' : 'name.lastName',
				sortMode = new tizen.SortMode(sortField, 'ASC'), //create sortMode object to sort contacts
				addressbook = tizen.contact.getDefaultAddressBook();
			//find contacts with group and sorted
			addressbook.find(function(contacts){
				var contactsCount = contacts.length, 
					i = 0, 
					groupsCount, j, groupIds,
					persons = [];
				for (; i < contactsCount; i++) {
					groupIds = contacts[i].groupIds
					groupsCount = groupIds.length;
					// Tizen's contact object contains group ids in array, but it doesn't support indexOf method
					// So we need a loop to find a value
					for (j = 0; j < groupsCount; j++) {
						if (groupIds[j] === group.recordId) {
							persons.push(new Person(contactHelper.createTitaniumContact(contacts[i])));
							break;
						}
					}
				}
				successCallback(persons);
			}, errorCallback, null, sortMode);
		}

	});
});