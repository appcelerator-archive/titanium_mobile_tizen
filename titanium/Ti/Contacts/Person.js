define(["Ti/_/declare"], function(declare) {
	
	return declare("Ti.Contacts.Person", null, {
			constructor: function(args) {
			args && this._mapContactFromTizen(args);
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
			prefix: '',
			lastName: '',
			nickname: '',
			firstPhonetic: '',
			lastPhonetic: '',
			phone: '',
			organization: '',
			department: '',
			jobTitle: '',
			date: {},
			note: '',
			url: {},
			id: 0,
		}
	});
});