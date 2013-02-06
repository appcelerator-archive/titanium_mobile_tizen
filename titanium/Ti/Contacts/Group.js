define(["Ti/_/declare", "Ti/Contacts"], function(declare, Contacts) {
	
	return declare("Ti.Contacts.Group", null, {
		
		constructor: function(args) {
			this.name = args.name || '';
		},
		
		add: function(person) {
			var addressBook = tizen.contact.getDefaultAddressBook(),
				tizenContact = Contacts._mapContactFromTitanium(person, this.name);
			addressBook.add(tizenContact);
		},
		
		remove: function(person) {
			var addressBook = tizen.contact.getDefaultAddressBook();
			try {
				addressBook.remove(person.id);	
			} catch (err) {
				console.log('The following error(s) occured ' + err.name);
			}
			
		},
		
		properties: {
			name: ''
		}
	});
});