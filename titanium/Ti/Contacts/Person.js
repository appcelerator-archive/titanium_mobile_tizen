define(['Ti/_/declare', 'Ti/_/Evented', 'Ti/_/Contacts/helper'], function(declare, Evented, contactHelper) {

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
					return Ti.Contacts.CONTACT_KIND_PERSON;
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