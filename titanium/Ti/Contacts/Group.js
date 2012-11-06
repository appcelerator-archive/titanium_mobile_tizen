define(["Ti/_/declare"], function(declare) {
	
	return declare("Ti.Contacts.Group", null, {
		constructor: function(args) {
			console.log('Group created');
			this.name = args.name;
			this.recordId = args.recordId;
		},
		add: function(contact) {
			var addressBook = tizen.contact.getAddressBookById(this.recordId);
			var tizenContact = new tizen.Contact({
				name: new tizen.ContactName({
					firstName: contact.firstName || '',
					lastName: contact.lastName || ''
				}),
				emails: [new tizen.ContactEmailAddress(contact.email || '')],
				phoneNumbers: [new tizen.ContactPhoneNumbers(contact.phoneNumber || '')]
			});
			addressBook.add(tizenContact);
		},
		remove: function(contact) {
			var addressBook = tizen.contact.getAddressBookById(this.recordId);
			try {
				addressBook.remove(contact.id);	
			} catch (err) {
				console.log('The following error(s) occured ' + err.name);
			}
			
		},
		members: function() {
			
		},
		
		properties: {
			name: '',
			recordId: 0
		}
	});
});