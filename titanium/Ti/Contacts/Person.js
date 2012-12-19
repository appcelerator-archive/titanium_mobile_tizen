define(["Ti/_/declare"], function(declare) {
	
	return declare("Ti.Contacts.Person", null, {
		
		constants: {
			CONTACTS_KIND_ORGANIZATION: 0,
			CONTACTS_KIND_PERSON: 1,
			
			kind: CONTACTS_KIND_PERSON,
			prefix: '',
			fullname: this.firstName + " " + this.lastName
		},
		
		properties: {
			address: {},
			birthday: '',
			created: '',
			date: {},
			department: '',
			email: {},
			firstName: '',
			middleName: '',
			lastName: '',
			nickname: '',
			firstPhonetic: '',
			lastPhonetic: '',
			phone: '',
			organization: '',
			jobTitle: '',
			note: '',
			url: {},
			id: 0
		}
	});
});