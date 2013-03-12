define(['Ti/_/declare'], function(declare) {

	return declare('Ti.Contacts.Group', null, {

		constructor: function(args) {
			if (!args.id) {
				this._group = new tizen.ContactGroup(args.name);
				tizen.contact.getDefaultAddressBook().addGroup(this._group);
				this.constants.__values__.recordId = this._group.id;
			} else {
				this.constants.__values__.recordId = args.id;
			}
		},

		add: function(person) {
			var addressbook = tizen.contact.getDefaultAddressBook(),
				contact;

			// Create person if it is new contact
			if (!person.id) {
				person = Ti.Contacts.createPerson(person);
			}

			contact = addressbook.get(person.id);
			// Adding contact to group
			contact.groupIds.push(this.recordId);
			addressbook.update(contact);
		},

		remove: function(person) {
			var addressbook = tizen.contact.getDefaultAddressBook(),
				contact = addressbook.get(person.id),
				groupIds = contact.groupIds;
			groupIds.splice(groupIds.indexOf(this.recordId), 1);
			contact.groupIds = groupIds;
			addressbook.update(contact);
		},

		constants: {
			recordId: ''
		},

		properties: {
			name: ''
		}
	});
});