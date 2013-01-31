define(["Ti/_/declare", "Ti/_/Evented"], function(declare, Evented) {
	
	return declare("Ti.Contacts.Person", Evented, {
		
		properties: {
			address: {},
			birthday: '',
			date: {},
			department: '',
			email: {},
			firstName: '',
			middleName: '',
			lastName: '',
			nickname: '',
			firstPhonetic: '',
			lastPhonetic: '',
			phone: {},
			organization: '',
			jobTitle: '',
			note: '',
			url: {},
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
			},
			created: '',
			id: 0
		},
				
	});
});