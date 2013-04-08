define(function () {

	// Creates and returns address object as a Titanium type, from a Tizen address.
	// The "address" parameter contains a native Tizen ContactAddress object.
	// Input parameter: array of Tizen ContactAddress objects.
	// Returns Ti.Contacts.Person.address dictionary.

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

			// Check if this address has address types that are supported by Titanium (as is defined in the
			// types array). In tizen, one address can belong to several address types.
			for (j = 0; j < typesCount; j++) {
				type = addressTypes[j].toLowerCase();
				if (types.indexOf(type) > -1) {
					break; // found at least one supported address type
				}
			}

			// If we exited the previous loop prematurely, there were some supported
			// address types. If the loop did not exit prematurely, it means no supported address types
			// were found, and we skip this address.
			if (j === typesCount) {
				continue;
			}

			// If "result" already contains an address of this type append to the existing
			// array. Otherwise, create the array and add to it.
			result.hasOwnProperty(type) ?
					result[type].push({
						CountryCode: '',
						Street: currentAddress.streetAddress || '',
						City: currentAddress.city || '',
						County: '',
						State: currentAddress.region || '',
						Country: currentAddress.country || '',
						ZIP: currentAddress.postalCode || ''
					}) :
					result[type] = [{
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

	// Create and returns a phone number in Titanium format from an array of native Tizen phone number objects.
	// Input parameter: array of Tizen ContactPhoneNumber objects.
	// Returns Ti.Contacts.Person.phone dictionary.

	function createTitaniumPhoneNumber(phone) {
		var result = {},
			types = ['home', 'work', 'mobile', 'pager', 'workFax'], // Phone types supported by Titanium.
			tizenTypes = ['HOME', 'WORK', 'CELL', 'PAGER', 'FAX'], // Phone types supported by Tizen.
			i = 0,
			phonesCount = phone.length,
			currentPhone, type, typesCount, j, phoneTypes, index;

		for (; i < phonesCount; i++) {
			currentPhone = phone[i];
			phoneTypes = currentPhone.types;
			typesCount = phoneTypes.length;

			// Check if the phone type has a Titanium equivalent.
			for (j = 0; j < typesCount; j++) {
				index = tizenTypes.indexOf(phoneTypes[j]);
				if (index > -1) {
					break;
				}
			}

			if (j === typesCount) {
				continue; // skip the phone number if it has an unsupported type
			}

			type = types[index];
			result.hasOwnProperty(type) ? result[type].push(currentPhone.number) : result[type] = [currentPhone.number];
		}
		return result;
	}

	// Creates and returns a Titanium email address from an array of native Tizen email objects.
	// Input parameter: array of Tizen ContactEmailAddress objects.
	// Returns Ti.Contacts.Person.email dictionary.

	function createTitaniumEmail(emails) {
		var result = {},
			types = ['home', 'work'], // email types supported by Tizen that have a Titanium equivalent
			i = 0,
			emailsCount = emails.length,
			currentEmail, type, typesCount, j, emailTypes;

		for (; i < emailsCount; i++) {
			currentEmail = emails[i];
			emailTypes = currentEmail.types;
			typesCount = emailTypes.length;

			for (j = 0; j < typesCount; j++) {
				type = emailTypes[j].toLowerCase();
				if (types.indexOf(type) > -1) {
					break;
				}
			}

			if (j === typesCount) {
				continue; // Skip email if it has unsupported type.
			}

			result.hasOwnProperty(type) ? result[type].push(currentEmail.email) : result[type] = [currentEmail.email];
		}
		return result;
	}

	// Creates and returns Ti.Person.date object from Tizen ContactAnniversary.
	// Tizen supports any label for each anniversary. All Tizen's anniversaries labels that has another value than 'anniversary' will be changed to 'other'.
	// Input parameter: array of Tizen ContactAnniversary objects.
	// Returns Ti.Contacts.Person.date dictionary.

	function createTitaniumAnniversary(anniversaries) {
		var result = {},
			anniversariesCount = anniversaries.length,
			i = 0,
			types = ['anniversary', 'other'], // anniversary types supported by Titanium
			type;

		for (; i < anniversariesCount; i++) {
			type = anniversaries[i].label ? anniversaries[i].label.toLowerCase() : '';

			// If the type is supported, we add it
			if (types.indexOf(type) > -1) {
				type = 'other';
			}
			result.hasOwnProperty(type) ? result[type].push(anniversaries[i].date) : result[type] = [anniversaries[i].date];
		}

		return result;
	}

	// Creates and returns Titanium website from Tizen.
	// Input parameter: array of Tizen ContactWebSite objects.
	// Returns Ti.Contacts.Person.url dictionary.

	function createTitaniumWebSite(urls) {
		var result = {},
			urlsCount = urls.length,
			i = 0,
			types = ['homepage'], // type(s) supported by Titanium.
			type;

		for (; i < urlsCount; i++) {
			type = urls[i].type ? urls[i].type.toLowerCase() : '';
			if (types.indexOf(type) > -1) {
				result.hasOwnProperty(type) ? result[type].push(urls[i].url) : result[type] = [urls[i].url];
			}
		}

		return result;
	}

	return {
		// Creates and returns an address object as a native Tizen type, from a Titanium address.
		// Input parameter: Ti.Contacts.Person.address dictionary.
		// Returns an array of Tizen ContactAddress objects

		createTizenAddresses: function(address) {
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
		},

		// Creates and returns a phone number as an array of native Tizen objects, from a 
		// Titanium.Contacts.Person.phone dictionary.
		// Input parameter: Ti.Contacts.Person.phone dictionary.
		// Returns array of Tizen ContactPhoneNumber objects.

		createTizenPhoneNumbers: function(phone) {
			var result = [],
				types = ['WORK', 'HOME', 'CELL', 'PAGER', 'FAX'], // Phone number types, supported by Tizen.
				titaniumTypes = ['work', 'home', 'mobile', 'pager', 'workFax'], // Phone types supported by Titanium.
				i, j, type, currentPhones, phonesCount, index;

			for (i in phone) {
				index = titaniumTypes.indexOf(i);

				// Check if the number type is supported by Tizen. If not, skip it.
				if (index === -1) {
					continue;
				}

				type = types[index];
				currentPhones = phone[i];
				phonesCount = currentPhones.length;

				for (j = 0; j < phonesCount; j++) {
					result.push(new tizen.ContactPhoneNumber(currentPhones[j], [type]));
				}
			}
			return result;
		},

		// Creates and returns an array of Tizen native email addresses from a Titanium email object.
		// Input parameter: Ti.Contacts.Person.email dictionary.
		// Returns array of Tizen ContactEmailAddress objects.

		createTizenEmails: function(email) {
			var result = [],
				types = ['WORK', 'HOME'], // email types supported by Tizen that have a Titanium equivalent.
				i, j, type, currentEmail, emailsCount;

			for (i in email) {
				type = i.toUpperCase();

				if (types.indexOf(type) === -1) {
					continue; // No supported email types found
				}

				currentEmail = email[i];
				emailsCount = currentEmail.length;

				for (j = 0; j < emailsCount; j++) {
					result.push(new tizen.ContactEmailAddress(currentEmail[j], [type]));
				}
			}
			return result;
		},

		// Creates and returns array of Tizen ContactAnniversary objects from Ti.Contacts.Person.date object.
		// Input parameter: Ti.Contacts.Person.date dictionary.
		// Returns array of Tizen ContactAnniversary objects.

		createTizenAnniversaries: function(date) {
			var result = [],
				i, j, anniversariesCount, currentAnniversaries;

			for (i in date) {
				currentAnniversaries = date[i];
				anniversariesCount = currentAnniversaries.length;
				for (j = 0; j < anniversariesCount; j++) {
					result.push(new tizen.ContactAnniversary(new Date(currentAnniversaries[j]), i));
				}
			}

			return result;
		},

		// Creates and returns Tizen website from Titanium.
		// Input parameter: Ti.Contacts.Person.url dictionary.
		// Returns array of Tizen ContactWebSite objects.

		createTizenWebSites: function(url) {
			var result = [],
				types = ['HOMEPAGE', 'BLOG'], // website types supported by Tizen that have Titanium equivalents
				i, j, type, currentWebSite, webSitesCount;

			for (i in url) {
				type = i.toUpperCase();

				// Skip website if it has unsupported type.
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
		},

		// Create Tizen contact from Ti.Contacts.Person object
		// Input parameter: Ti.Contacts.Person object.
		// Returns Tizen Contact object.

		createTizenContact: function(args) {
			return  new tizen.Contact({
				name: new tizen.ContactName({
					firstName: args.firstName,
					middleName: args.middleName,
					lastName: args.lastName,
					nicknames: args.nickname && [args.nickname],
					phoneticFirstName: args.firstPhonetic,
					phoneticLastName: args.lastPhonetic,
					prefix: args.prefix
				}),
				addresses: args.address && this.createTizenAddresses(args.address),
				phoneNumbers: args.phone && this.createTizenPhoneNumbers(args.phone),
				emails: args.email && this.createTizenEmails(args.email),
				birthday: args.birthday,
				anniversaries: args.date && this.createTizenAnniversaries(args.date),
				organizations: [new tizen.ContactOrganization({
					name: args.organization,
					department: args.department,
					title: args.jobTitle
				})],
				notes: args.note && [args.note],
				urls: args.url && this.createTizenWebSites(args.url)
			});
		},

		// Create and return Titanium contact from existing Tizen contact
		// Input parameter: Tizen Contact object.
		// Returns Ti.Contacts.Person object.
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
				};

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
	};
});