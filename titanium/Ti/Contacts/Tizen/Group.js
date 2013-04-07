define(['Ti/_/Evented', 'Ti/_/lang', 'Ti/Tizen/_/contactHelper', 'Ti/Contacts/Person'], function(Evented, lang, contactHelper, Person) {

	// This function is supplied as a success callback to Tizen's contact searching functions.
	// It takes an array of native Tizen's contact objects, converts them to Titanium contacts, and returns
	// to the user via callback.
	//
	// Parameters:
	//
	// - "contacts" is an array of Tizen native contact objects that were found;
	// - "successCallback" is the callback from client code, to be called when the result is ready.

	function findContactsSuccessCallback (contacts, group, successCallback) {
		var contactsCount = contacts.length,
			groupsCount, j, groupIds,
			i = 0, persons = [];

		for (; i < contactsCount; i++) {
			groupIds = contacts[i].groupIds;
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
			var addressbook = tizen.contact.getDefaultAddressBook();

			// Tell Tizen to perform the search.
			addressbook.find(function(contacts) {
				findContactsSuccessCallback(contacts, group, successCallback);
			}, errorCallback);
		},

		sortedMembers: function(sortBy, group, successCallback, errorCallback) {
			var sortField = (sortBy === Ti.Contacts.CONTACTS_SORT_FIRST_NAME) ? 'name.firstName' : 'name.lastName',
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
