define(['Ti/_/declare', 'Ti/_/Evented', 'Ti/Tizen/_/contactHelper'], function(declare, Evented, contactHelper) {

//	var addressbook = tizen.contact.getDefaultAddressBook();

	return declare('Ti.Contacts.Person', Evented, {
		constructor: function(args) {
			if (!args.id) {
				this._contact = contactHelper.createTizenContact(args);
				var addressbook = tizen.contact.getDefaultAddressBook();
				addressbook.add(this._contact);
				this.constants.__values__.id = this._contact.id;
			}
		},

		constants: {
			id: {},
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
			modified: {},
			prefix: {},
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
			suffix: '',
			url: {}
		}
	});
	
});