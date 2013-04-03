define(['Ti/_/Evented', 'Ti/_/lang', 'Ti/Tizen/_/contactHelper', 'Ti/Contacts/Person'], function(Evented, lang, contactHelper, Person) {

	function findContactsSuccessCallback (contacts, group, successCallback) {
		var contactsCount = contacts.length, 
			i = 0, 
			groupsCount, j, groupIds,
			persons = [];

		for (; i < contactsCount; i++) {
			groupIds = contacts[i].groupIds
			groupsCount = groupIds.length;
			// Tizen's contact object contains group ids in array, but it doesn't support the indexOf method.
			// So we need a loop to find the value.
			for (j = 0; j < groupsCount; j++) {
				if (groupIds[j] === group.recordId) {
					persons.push(new Person(contactHelper.createTitaniumContact(contacts[i])));
					break;
				}
			}
		}
		successCallback(persons);
	}

	return lang.setObject('Ti.Contacts.Tizen.Group', Evented, {

		members: function(group, successCallback, errorCallback) {
			// Create a filter to get the contacts with the selected group:
			var groupFilter = new tizen.AttributeFilter('groupIds', 'CONTAINS', group.recordId),
				self = this,
				id = group.recordId,
				addressbook = tizen.contact.getDefaultAddressBook();

			// Tell Tizen to perform the search.
			addressbook.find(function(contacts) {
				findContactsSuccessCallback(contacts, group, successCallback);
			}, errorCallback);
		},

		sortedMembers: function(sortBy, group, successCallback, errorCallback) {
			var categoryFilter = new tizen.AttributeFilter('categories', 'FULLSTRING',  group.name), // Create filter to get contacts with selected category.
				self = this, 
				sortField = (sortBy === Ti.Contacts.CONTACTS_SORT_FIRST_NAME) ? 'name.firstName' : 'name.lastName',
				// Create a SortMode object to define the desired contact sorting mode:
				sortMode = new tizen.SortMode(sortField, 'ASC'),
				addressbook = tizen.contact.getDefaultAddressBook();

			// Tell Tizen to perform the search.
			addressbook.find(function(contacts) {
				findContactsSuccessCallback(contacts, group, successCallback);
			}, errorCallback, null, sortMode);
		}

	});
});
