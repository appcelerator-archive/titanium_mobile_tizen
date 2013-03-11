define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	function createTizenAddress(address) {
		var result = [],
			types = ['WORK', 'HOME'],
			i, j, type, currentAddress, addressesCount;
		for (i in address) {
			type = i.toUpperCase();
			if (types.indexOf(type) === -1) {
				continue;
			}
			addressesCount = address[i].length;
			for (j = 0; j < addressesCount; j++) {
				currentAddress = address[i][j];
				result.push(new tizen.ContactAddress({
					country: currentAddress.Country,
					region: currentAddress.State,
					city: currentAddress.City,
					streetAddress: currentAddress.Street,
					postalCode: currentAddress.ZIP,
					types: [type]
				}));
			}
		}
		return result;
	}

	function createTizenPhoneNumber(phone) {
		console.log('Start phone');
		var result = [],
			types = ['WORK', 'HOME', 'CELL', 'PAGER', 'FAX'], // phone number types, supported by Tizen
			i, j, type, currentPhones, phonesCount;
		for (i in phone) {
			type = i === 'mobile' ? 'CELL' : (i === 'workFax' ? 'FAX' : i.toUpperCase());
			// Check if number type is supported by Tizen
			if (types.indexOf(type) === -1) {
				continue;
			}
			currentPhones = phone[i];
			phonesCount = currentPhones.length;
			for (j = 0; j < phonesCount; j++) {
				result.push(new tizen.ContactPhoneNumber(currentPhones[j], [type]));
			}
		}
		return result;
	}

	function createTizenEmail(email) {
		var result = [],
			types = ['WORK', 'HOME'], // email types supported by Tizen
			i, j, type, currentEmails, emailsCount;
		for (i in  email) {
			type = i.toUpperCase();
			if (types.indexOf(type) === -1) {
				continue;
			}
			currentEmails = email[i];
			emailsCount = currentEmails.length;
			for (j = 0; j < emailsCount; j++) {
				console.log(currentEmails[j] + ': ' + type);
				result.push(new tizen.ContactEmailAddress(currentEmails[j], [type]));
			}
		}
		return result;
	}

	function createTizenAnniversary(date) {
		var result = [],
			i, j, anniversariesCount, currentAnniversary;
		for (i in date) {
			currentAnniversaries = date[i];
			anniversariesCount = currentAnniversaries.length;
			for (j = 0; j < anniversariesCount; j++) {
				result.push(new tizen.ContactAnniversary(new Date(currentAnniversaries[j]), i));
			}
		}
		return result;
	}

	function createTizenWebSite(url) {
		var result = [],
			types = ['HOMEPAGE', 'BLOG'],
			i, j, type, currentWebSite, webSitesCount;
		for (i in url) {
			type = i.toUpperCase();
			if (types.indexOf(type) === -1) {
				continue;
			}
			currentWebSite = url[i];
			webSitesCount = currentWebSite.length;
			for (j = 0; j < webSitesCount; j++) {
				result.push(new tizen.ContactWebSite(currentWebSite[j], type));
			}
		}
		return result;
	}

	function createTizenContact(args) {
		console.log(args.jobTitle);
		try {
		var c =  new tizen.Contact({
			name: new tizen.ContactName({
				firstName: args.firstName,
				middleName: args.middleName,
				lastName: args.lastName,
				nicknames: args.nickname && [args.nickname],
				phoneticFirstName: args.firstPhonetic,
				phoneticLastName: args.lastPhonetic,
				prefix: args.prefix,
				suffix: args.suffix
			}),
			addresses: args.address && createTizenAddress(args.address),
			phoneNumbers: args.phone && createTizenPhoneNumber(args.phone),
			emails: args.email && createTizenEmail(args.email),
			birthday: args.birthday,
			anniversaries: args.date && createTizenAnniversary(args.date),
			organizations: [new tizen.ContactOrganization({
				name: args.organization,
				department: args.department,
				title: args.jobTitle
			})],
			notes: args.note && [args.note],
			urls: args.url && createTizenWebSite(args.url)
		});
		} catch(e) {
			console.log(e.type + ' = ' + e.message);
		}
		return c;
	}

	var addressbook = tizen.contact.getDefaultAddressBook();

	return declare('Ti.Contacts.Person', Evented, {
		constructor: function(args) {
			if (!args.id) {
				//this._contact = createTizenContact(args);
				console.log('Tizen contact created');
				try {
				var addressbook = tizen.contact.getDefaultAddressBook();
				} catch (e) {
					console.log(e.type + ' = ' + e.message);
				}
				console.log(addressbook);
				addressbook.add(this._contact);
				console.log('Tizen contact added');
				console.log('id = ' + contact.id);
				this.constants.__values__.id = this._contact.id;
			}
		},

		constants: {
			id: {},
			fullname: {
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
			birthday: {},
			date: {},
			department: {},
			email: {},
			firstName: {},
			firstPhonetic: {},
			jobTitle: {},
			lastName: {},
			lastPhonetic: {},
			middleName: {},
			nickname: {},
			note: {},
			organization: {},
			phone: {},
			relatedNames: {}, //TODO check if it is needed
			suffix: {},
			url: {}
		}
	});
	
});