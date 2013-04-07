define(['Ti/_/declare'], function(declare) {

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
				person = Ti.Contacts.createPerson(person);
			}

			contact = this._addressbook.get(person.id);

			// Add the contact to the Tizen group.
			contact.groupIds.push(this.recordId);
			this._addressbook.update(contact);
		},

		members: function () {
			throw new Error('This method is not supported by Tizen. Use Ti.Contacts.Tizen.Group.members instead.');
		},

		remove: function(person) {
			var contact = this._addressbook.get(person.id),
				groupIds = contact.groupIds;
			groupIds.splice(groupIds.indexOf(this.recordId), 1);
			contact.groupIds = groupIds;
			this._addressbook.update(contact);
		},

		sortedMembers: function () {
			throw new Error('This method is not supported by Tizen. Use Ti.Contacts.Tizen.Group.sortedMembers instead.');
		},

		constants: {
			recordId: void 0
		},

		properties: {
			name: void 0
		}
	});
});