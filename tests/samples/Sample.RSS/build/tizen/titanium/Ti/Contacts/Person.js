define(["Ti/_/declare"], function(declare) {
	
	return declare("Ti.Contacts.Person", null, {
		
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
			id: 0,
			image: {
				set: function(value){
					if(value !== null){
						throw TypeError('You can set image only to null');
					}
					return value;
				},
				value : null
			}
		},
		
		constants: {
			CONTACTS_KIND_ORGANIZATION: 0,
			CONTACTS_KIND_PERSON: 1,
			
			kind: this.CONTACTS_KIND_PERSON,
			prefix: '',
			fullName: {
				get: function() {
					return this.firstName + " " + this.lastName;
				}
			}
		},
				
	});
});