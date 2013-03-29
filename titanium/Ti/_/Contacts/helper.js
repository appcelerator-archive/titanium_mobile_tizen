define(['Ti/API'], function(API) {

	// Create and return address object in Tizen format from Titanium address
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

	// Create and return address object in Titanium format from Tizen address
	function createTitaniumAddress(address) {
		var result = {},
			i = 0,
			types = ['work', 'home'],
			addressesCount = address.length,
			j, currentAddress, typesCount, type, addressTypes;
		for (; i < addressesCount; i++) {
			currentAddress = address[i];
			addressTypes = currentAddress.types;
			typesCount = addressTypes.length;
			// Check if address type is supported by Titanium
			for (j = 0; j < typesCount; j++) {
				type = addressTypes[j].toLowerCase();
				if (types.indexOf(type) > -1) {
					break;
				}
			}
			if (j === typesCount) {
				continue; // Skip address if it is not supported by Titanium
			}
			result.hasOwnProperty(type) 
					? result[type].push({
						CountryCode: '',
						Street: currentAddress.streetAddress || '',
						City: currentAddress.city || '',
						County: '',
						State: currentAddress.region || '',
						Country: currentAddress.country || '',
						ZIP: currentAddress.postalCode || ''
					})
					: result[type] = [{
						CountryCode: '',
						Street: currentAddress.streetAddress || '',
						City: currentAddress.city || '',
						County: '',
						State: currentAddress.region || '',
						Country: currentAddress.country || '',
						ZIP: currentAddress.postalCode || ''
					}];
		}
		return result;
	}

	function createTizenPhoneNumber(phone) {
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

	function createTitaniumPhoneNumber(phone) {
		var result = {},
			types = ['home', 'work', 'mobile', 'pager', 'workFax'],
			i = 0,
			phonesCount = phone.length,
			currentPhone, type, typesCount, j, phoneTypes;
		for (; i < phonesCount; i++) {
			currentPhone = phone[i];
			phoneTypes = currentPhone.types;
			typesCount = phoneTypes.length;
			for (j = 0; j < typesCount; j++) {
				type = phoneTypes[j] === 'CELL' ? 'mobile' : (phoneTypes[j] === 'FAX' ? 'workFax' : phoneTypes[j].toLowerCase());
				if (types.indexOf(type) > -1) {
					break;
				}
			}
			if (j === typesCount) {
				continue; // Skip phone if it has unsupported type
			}
			result.hasOwnProperty(type) ? result[type].push(currentPhone.number) : result[type] = [currentPhone.number];
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
				result.push(new tizen.ContactEmailAddress(currentEmails[j], [type]));
			}
		}
		return result;
	}

	function createTitaniumEmail(email) {
		var result = {},
			types = ['home', 'work'],
			i = 0,
			emailsCount = email.length,
			currentEmail, type, typesCount, j, emailTypes;
		for (; i < emailsCount; i++) {
			currentEmail = email[i];
			emailTypes = currentEmail.types;
			typesCount = emailTypes.length;
			for (j = 0; j < typesCount; j++) {
				type = emailTypes[j].toLowerCase();
				if (types.indexOf(type) > -1) {
					break;
				}
			}
			if (j === typesCount) {
				continue; // Skip email if it has unsupported type
			}
			
			result.hasOwnProperty(type) ? result[type].push(currentEmail.email) : result[type] = [currentEmail.email];
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

	function createTitaniumAnniversary(anniversaries) {
		var result = {},
			anniversariesCount = anniversaries.length,
			i = 0,
			types = ['anniversary', 'other'],
			type;
		for (; i < anniversariesCount; i++) {
			type = anniversaries[i].label ? anniversaries[i].label.toLowerCase() : '';
			if (types.indexOf(type) > -1) {
				result.hasOwnProperty(type) 
						? result[type].push(anniversaries[i].date)
						: result[type] = [anniversaries[i].date];
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

	function createTitaniumWebSite(urls) {
		var result = {},
			urlsCount = urls.length,
			i = 0,
			types = ['homepage'],
			type;
		for (; i < urlsCount; i++) {
			type = urls[i].type ? urls[i].type.toLowerCase() : '';
			if (types.indexOf(type) > -1) {
				result.hasOwnProperty(type) ? reult[type].push(urls[i].url) : result[type] = [urls[i].url];
			}
		}
		return result;
	}

	return {
		createTizenContact: function(args) {
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
			return c;
		},

		updateTizenContact: function(person) {
			var contact = tizen.contact.getDefaultAddressBook().get(person.id),
				name;

			contact.addresses = person.address && createTizenAddress(person.address);
			contact.emails = person.email && createTizenEmail(person.email);
			name = contact.name;
			if (name) {
				name.prefix = person.prefix ||'';
				name.firstName = person.firstName || '';
				name.middleName = person.middleName || '';
				name.lastName = person.lastName || '';
				name.nicknames = (person.nickname) ? [person.nickname] : [];
				name.phoneticFirstName = person.firstPhonetic || null;
				name.phoneticLastName = person.lastPhonetic || null;
			} else {
				name = new tizen.ContactName({
					prefix: person.prefix || '',
					firstName: person.firstName || '',
					middleName: person.middleName || '',
					lastName: person.lastName || '',
					nicknames: (person.nickname) ? [person.nickname] : [],
					phoneticFirstName: person.firstPhonetic || null,
					phoneticLastName: person.lastPhonetic || null
				});
			}
			contact.name = name;
			contact.phoneNumbers = person.phone && createTizenPhoneNumber(person.phone);
			contact.birthday = person.birthday ? new Date(person.birthday) : null;
			organization = contact.organizations[0];
			if (organization) {
				organization.name = person.organization;
				organization.department = person.department;
				organization.title = person.jobTitle;
			} else {
				organization = new tizen.ContactOrganization({
					name: person.organization || null,
					department: null,
					title:  null
				});
			}
			contact.organizations = [organization];
			contact.anniversaries = person.date && createTizenAnniversary(person.date);
			contact.notes = [person.note] || void 0;
			contact.urls = person.url && createTizenWebSite(person.url);
			return contact;
		},

		createTitaniumContact: function(tizenContact) {
			var name, organization,
				obj = {
					address: tizenContact.addresses.length > 0 ? createTitaniumAddress(tizenContact.addresses) : {},
					email: tizenContact.emails.length > 0 ? createTitaniumEmail(tizenContact.emails) : {},
					phone: tizenContact.phoneNumbers.length > 0 ? createTitaniumPhoneNumber(tizenContact.phoneNumbers) : {},
					birthday: tizenContact.birthday ? new Date(tizenContact.birthday).toUTCString() : null,
					date: tizenContact.anniversaries.length > 0 ? createTitaniumAnniversary(tizenContact.anniversaries) : {},
					url: tizenContact.urls.length > 0 ? createTitaniumWebSite(tizenContact.urls) : {},
					id: tizenContact.id
				}
			if (tizenContact.name) {
				name = tizenContact.name;
				obj.firstName = name.firstName || '';
				obj.middleName = name.middleName || '';
				obj.lastName = name.lastName || '';
				obj.nickname = name.nicknames[0] || '';
				obj.firstPhonetic = name.phoneticFirstName || null;
				obj.lastPhonetic = name.phoneticLastName || null;
			}

			organization = tizenContact.organizations.length && tizenContact.organizations[0];

			obj.organization = (organization && organization.name) ? organization.name : '';
			obj.department = (organization && organization.department) ? organization.department : '';
			obj.jobTitle = (organization && organization.title) ? organization.title : '';
			obj.id = tizenContact.id;
			obj.modified = tizenContact.lastUpdated;
			return obj;
		}
	}

});