define(['Ti/_/declare', 'Ti/Contacts'], function(declare, Contacts) {

	return declare('Ti.Contacts.Group', null, {

		constructor: function(args) {
			this._addressbook = tizen.contact.getDefaultAddressBook();
			if (!args.id) {
				this._group = new tizen.ContactGroup(args.name);
				this._addressbook.addGroup(this._group);
				this.constants.__values__.recordId = this._group.id;
			} else {
				this.constants.__values__.recordId = args.id;
			}
		},

		add: function(person) {
			var contact; // The "person" as the native Tizen type.

			// If the person is new, create it first.
			if (!person.id) {
				person = Contacts.createPerson(person);
			}

			contact = this._addressbook.get(person.id);

			// Add the contact to the Tizen group.
			contact.groupIds.push(this.recordId);
			this._addressbook.update(contact);
		},

		remove: function(person) {
			var contact = this._addressbook.get(person.id),
				groupIds = contact.groupIds;
			groupIds.splice(groupIds.indexOf(this.recordId), 1);
			contact.groupIds = groupIds;
			this._addressbook.update(contact);
		},

		constants: {
			recordId: void 0
		},

		properties: {
			name: void 0
		}
	});
});