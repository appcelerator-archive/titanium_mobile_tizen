define(["Ti/_/Evented", "Ti/_/lang"], function(Evented, lang) {
	var _getTizenObjectType = function(types) {
			var i = 0, typesLength = 0, type = "";
			typesLength = types.length;
			for (i = 0; i < typesLength; i++) {
				if ((types[i].toLowerCase() == "work") || (types[i].toLowerCase() == "home")) {
					type = types[i].toLowerCase();
					break;
				}
			}
			type = type || "other";
			return type;
		},		
		_getTizenPhoneType = function(types) {
			var i = 0, typesLength = types.length, type = "", typeName = "";
			for (i = 0; i < typesLength; i++) {
				typeName = types[i].toLowerCase();
				if ((typeName == "home") || (typeName == "work") || (typeName == "mobile") || (typeName == "pager") || (typeName == "workFax") ||(typeName == "homeFax") || (typeName == "iPohne")) {
					type = typeName;
					break;
				}
				if (typeName == "pref") {
					type = "main";
					break;
				}
			}
			type = type || "other";
			return type;	
		},
		_getTizenWebSiteType = function(types) {
			var i = 0, typesLength = types.length, type = "", typeName = "";
			for (i = 0; i < typesLength; i++) {
				typeName = types[i].toLowerCase();
				if ((typeName == "homepage") || (typeName == "home") || (typeName == "work")) {
					type = typeName;
					break;
				}
			}
			type = type || "other";
			return type;
		},
		_mapAddressesFromTizen = function(tizenContact) {
			var result = {}, flag = true, address = null, type = "", i = 0;
			while (flag) {
				address = tizenContact.addresses[i];
				i++;
				if (address) {
					type = _getTizenObjectType(address.types);
					if (result.type) {
						continue;
					}
					result[type] = {};
					result[type].CountryCode = "";
					result[type].Street = address.streetAddress || "";
					result[type].City = address.city || "";
					result[type].County = "";
					result[type].State = address.region || "";
					result[type].Country = address.country || "";
					result[type].ZIP = address.postalCode || "";
				} else {
					flag = false;
				}
			}
			return result;
		},	
		_mapAddressesFromTitanium = function(person) {
			var result = undefined, address = person.address,
				addressTypes = ['home', 'work'], i = 0, currentAddress = null;
			if (address) {
				for (i in addressTypes) {
					currentAddress = address[addressTypes[i]];
					if (currentAddress) {
						result = result || [];
						result.push(new tizen.ContactAddress({
							streetAddress: currentAddress.Street || '',
							city: currentAddress.City || '',
							region: currentAddress.State || '',
							country: currentAddress.Country || '',
							pastalCode: currentAddress.ZIP || '',
							types: [addressTypes[i].toUpperCase()]
						}));
					}					
				}
			}
			return result;
			
		},
		_mapEmailsFromTizen = function (tizenContact) {
			var result = {}, i = 0, flag = true, email = null, type = "";
			while (flag) {
				if (! tizenContact.emails) {
					flag = false;
					continue;
				}
				email = tizenContact.emails[i];
				i++;
				if (email) {
					type = _getTizenObjectType(email.types);
					if (result.type) {
						continue;
					}
					result[type] = email.email;					
				} else {
					flag = false;
				}
			}
			return result;
		},	
		_mapEmailsFromTitanium = function(person) {
			var result = undefined, emails = person.email,
				emailTypes = ['home', 'work'], i = 0, currentEmail = null;
			if (emails) {
				for(i in emailTypes) {
					currentEmail = emails[emailTypes[i]]; 
					if (currentEmail) {
						result = result || [];
						result.push(new tizen.ContactEmailAddress(
							currentEmail,
							[emailTypes[i].toUpperCase()]
						));
					}
				}
			}
			return result;
		},
		_mapPhoneNumbersFromTizen = function(tizenContact) {
			var result = {}, i = 0, flag = true, phoneNumber = null, type = "";
			while (flag) {
				if (! tizenContact.phoneNumbers) {
					flag = false;
					continue;
				}				
				phoneNumber = tizenContact.phoneNumbers[i];
				i++;
				if (phoneNumber) {
					type = _getTizenPhoneType(phoneNumber.types);
					if (result.type) {
						continue;
					}
					result[type] = [phoneNumber.number];
				} else {
					flag = false;
				}
				
			}
			return result;
		},
		_mapPhoneNumbersFromTitanium = function(person){
			var result = undefined, phoneNumbers = person.phone,
				numberTypes = ['work', 'home', 'mobile', 'pager'], currentNumber = null, i = 0;
			if (phoneNumbers) {
				for (i in numberTypes) {
					currentNumber = phoneNumbers[numberTypes[i]];
					if (currentNumber) {
						result = result || [];
						result.push(new tizen.ContactPhoneNumber(
							currentNumber.shift(),
							[(numberTypes[i] == 'mobile') ? 'CELL' : numberTypes[i].toUpperCase()]
						));
					}
				}
			}
			return result;
		},
		_mapAnniversaryFromTizen = function(tizenContact) {
			var result = {}, flag = true, anniversary = null, i = 0;
			while(flag) {
				if (tizenContact.anniversaries === null) {
					flag = false;
					continue;
				}
				anniversary = tizenContact.anniversaries[i];
				if (anniversary) {
					if (anniversary.label && (anniversary.label == "anniversary") && (!result.anniversary)) {
						result.anniversary = (new Date(anniversary.date)).toUTCString();
					} else if (!result.other) {
						result.other = (new Date(anniversary.date)).toUTCString();
					}
				} else {
					flag = false;
				}
				i++;
			}
			return result;
		},
		_mapAnniversariesFromTitanium = function(person) {
			var result = undefined, anniversaries = person.date,
				anniversaryTypes = ['anniversary', 'other'], i = 0, currentAnniversary = null;
			if (anniversaries) {
				for (i in anniversaryTypes) {
					currentAnniversary = anniversaries[anniversaryTypes[i]];
					if (currentAnniversary) {
						result = result || [];
						result.push(new tizen.ContactAnniversary({
							date: new Date(currentAnniversary),
							label: anniversaryTypes[i]
						}));
					}
				}
			}
			return result;
		},
		_mapWebSitesFromTizen = function(tizenContact) {
			var result = {}, flag = true, i = 0, webSite = null, type = "";
			while (flag) {
				webSite = tizenContact.urls[i];
				if (webSite) {
					type = _getTizenWebSiteType(webSite.type);
					if (result[type]) {
						continue;
					}
					result[type] = [webSite.url];
				} else {
					flag = false;
				}
				i++;
			}
			return result;
		},
		_mapWebSitesFromTitanium = function(person) {
			var result = undefined, webSites = person.url, currentWebSite = null;
			if (webSites) {
				currentWebSite = webSites.homepage;
				if (currentWebSite) {
					result = result || [];
					result.push(new tizen.ContactWebSite({
						url: currentWebSite.url,
						type: 'homepage'
					}));
				}
			}	
			return result;
		},
		
		_mapContactFromTizen = function(tizenContact, person) {
			var name = null,
				person = person || new (require("Ti/Tizen/Contacts/Person"))();
			person.address = _mapAddressesFromTizen(tizenContact);
			person.email = _mapEmailsFromTizen(tizenContact);
			if (tizenContact.name) {
				name = tizenContact.name;
				person.prefix = name.prefix || '';
				person.firstName = name.firstName || '';
				person.middleName = name.middleName || '';
				person.lastName = name.lastName || '';
				person.nickname = name.nicknames[0] || '';
				person.firstPhonetic = name.phoneticFirstName || '';
				person.lastPhonetic = name.phoneticLastName || '';	
			}
			person.phone = _mapPhoneNumbersFromTizen(tizenContact);
			person.birthday = tizenContact.birthday ? new Date(tizenContact.birthday).toUTCString() : null;
			person.organization = (tizenContact.organization && tizenContact.organization.name) ? tizenContact.organization.name : '';
			person.department = (tizenContact.organization && tizenContact.organization.department) ? tizenContact.organization.department : '';
			person.jobTitle = (tizenContact.organization && tizenContact.organization.title) ? tizenContact.organization.title : '';
			person.date = _mapAnniversaryFromTizen(tizenContact);  
			person.note = tizenContact.note || '';
			person.url = _mapWebSitesFromTizen(tizenContact);
			person.id = tizenContact.id || 0;
			return person;		
		};	
	return lang.setObject("Ti.Contacts", Evented, {
		
		constants: {
			AUTHORIZATION_UNKNOWN: 0,
			AUTHORIZATION_DENIED: 1,
			AUTHORIZATION_RESTRICTED: 2,
			AUTHORIZATION_AUTHORIZE: 3,
			
			CONTACTS_KIND_ORGANIZATION: 0,
			CONTACTS_KIND_PERSON: 1,
			
			CONTACTS_SORT_FIRST_NAME: 0,
			CONTACTS_SORT_LAST_NAME: 1,
			
			
		},
		
		properties: {
			contactsAuthorization: 3
		},
		
		_addressBook: tizen.contact.getDefaultAddressBook(),
		
		createGroup: function(args) {
			
		},
		
		testMapping: function() {
			this._mapContactsFromTizen();				
		},
		
		createPerson: function(person) {
			var addressBook = tizen.contact.getDefaultAddressBook(),
				tizenContact = new tizen.Contact({
					addresses: _mapAddressesFromTitanium(person),
					emails: _mapEmailsFromTitanium(person),
					name: new tizen.ContactName({
						prefix: person.prefix || undefined,
						firstName: person.firstName || undefined,
						middleName: person.middleName || undefined,
						lastName: person.lastName || undefined,
						nicknames: (person.nickname) ? [person.nickname] : undefined,
						phoneticFirstName: person.firstPhonetic || undefined,
						phoneticLastName: person.lastPhonetic || undefined
					}),
					phoneNumbers: _mapPhoneNumbersFromTitanium(person),
					birthday: person.birthday ? new Date(person.birthday) : undefined,
					organization: new tizen.ContactOrganization({
						name: person.organization || undefined,
						department: person.department || undefined,
						title: person.jobTitle || undefined,
					}),
					//anniversaries: _mapAnniversariesFromTitanium(person),
					note: person.note || undefined,
					urls: _mapWebSitesFromTitanium(person)
				});

			addressBook.add(tizenContact);
			//contact.id = tizenContact.id;
			person = new (require("Ti/Tizen/Contacts/Person"))();
			person = _mapContactFromTizen(tizenContact, person);				
			return person;
		},
		
		getAllGroups: function() {
			
		},
		
		
		getAllPeople: function(callback) {
			/*var i = 0, contactsCount = 0, result = [];
			if (!contacts) {
				console.log('Contacts are not initialized yet');
				return result;
			}
			contactsCount = contacts.length;
			for (i = 0; i < contactsCount; i++) {
				result.push(_mapContactFromTizen(this._addressBook.get(contacts[i])));
			}
			return result;*/
		},
		
		getContactsAuthorization: function(args) {
			
		},
		
		getGroupById: function(id) { 

			
		},
		//not tested
		getPeopleWithName: function(name) {
		/*	var i = 0, contactsCount = 0, result = [], names = name.split(' '),
				firstName = '', lastName = '', middleName = '', person = null,
				addressBook = null, namesCount = 0, j = 0, conditionString = '', flag = false, persons = [];
				
			if (!contacts) {
				console.log('Contacts are not initialized yet');
				return result;
			}
			persons = this.getAllPeople();
			addressBook = tizen.contact.getDefaultAddressBook();
			contactsCount = contacts.length;
			namesCount = names.length;
			for (i = 0; i < contactsCount; i++) {
				person = personss[i];
				conditionString = '';
				for (j = 0; j < namesCount; j++) {
					conditionString += '((names[j] == person.firstName) || (names[j] == person.middleName) || (names[j] == person.lastName)) &&';
				}
				conditionString = conditionString.substring(0, conditionString.length - 3);
				flag = eval(conditionString);
				if (flag) {
					result.push(person[i]);
				}
			}
			return result;*/
		},
		
		getPersonById: function(id) {
			var addressBook = null, contact = null, result = {}, person = {};
			try {
				addressBook = tizen.contact.getDefaultAddressBook();
				contact = addressBook.get(id);	
			} catch (err) {
				console.log("Error: " + err.name);
			}
			person = new (require("Ti/Tizen/Contacts/Person"))();
			person = _mapContactFromTizen(contact, person);				
			return person;
		},
		removePerson: function(Person) {
			var addressBook = tizen.contact.getDefaultAddressBook();
			try {
				addressBook.remove(Person.id);
			} catch (err) {
				console.log('The following error occurred while removing: ' +  err.name);
			}
		}
		
	});
});