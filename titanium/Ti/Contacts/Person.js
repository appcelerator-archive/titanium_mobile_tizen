define(
	['Ti/_/declare', 'Ti/_/Evented', 'Ti/_/Contacts/helper', 'Ti/Contacts'],
	function(declare, Evented, contactHelper, Contacts) {

	return declare('Ti.Contacts.Person', Evented, {
		constructor: function(args) {
			if (!args.id) {
				var contact = contactHelper.createTizenContact(args);
				tizen.contact.getDefaultAddressBook().add(contact);
				this.constants.__values__.id = contact.id;
				this.constants.__values__.modified = contact.lastUpdated;
			}
		},

		constants: {
			id: 0,
			fullName: {
				get: function() {
					return this.firstName + ' ' + this.lastName;
				}
			},
			kind: {
				get: function() {
					return Contacts.CONTACT_KIND_PERSON;
				}
			},
			modified: '',
			prefix: '',
		},

		properties: {
			address: {},
			birthday: '',
			date: {},
			department: '',
			email: {},
			firstName: '',
			firstPhonetic: '',
			jobTitle: '',
			lastName: '',
			lastPhonetic: '',
			middleName: '',
			nickname: '',
			note: '',
			organization: '',
			phone: {},
			url: {}
		}
	});
});