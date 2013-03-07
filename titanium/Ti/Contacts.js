define(["Ti/_/Evented", "Ti/_/lang", 'Ti/Contacts/Person'], function(Evented, lang, Person) {
	function _getTizenObjectType(types) {
		var i = 0, 
			typesLength = types.length, 
			type = "";
		for (; i < typesLength; i++) {
			if ((types[i].toLowerCase() === "work") || (types[i].toLowerCase() === "home")) {
				type = types[i].toLowerCase();
				break;
			}
		}
		type = type || "other";
		return type;
	};		
	
	function _getTizenPhoneType(types) {
		var i = 0, 
			typesLength = types.length, 
			type = "", 
			typeName = "";
		for (; i < typesLength; i++) {
			typeName = types[i].toLowerCase();
			if ((typeName === "home") || (typeName === "work") || (typeName === "mobile") || (typeName === "pager") || (typeName === "workFax") || (typeName === "homeFax") || (typeName === "iPohne")) {
				type = typeName;
				break;
			}
		}
		if (!type) {
			for (i = 0; i < typesLength; i++) {
				typeName = types[i].toLowerCase();
				if (typeName == "pref") {
					type = "main";
					break;
				}
			}
		}
		type = type || "other";
		return type;	
	};
	
	function _getTizenWebSiteType(types) {
		var i = 0, 
			typesLength = types.length, 
			type = "", 
			typeName = "";

		typeName = types.toLowerCase();
		if ((typeName == "homepage") || (typeName == "home") || (typeName == "work")) {
			type = typeName;
		}
		type = type || "other";
		return type;
	};
	
	function _mapAddressesFromTizen(tizenContact) {
		var result = {}, 
			flag = true, 
			address = null, 
			type = "", 
			i = 0;
		console.log('Address');
		while (flag) {
			address = tizenContact.addresses[i];
			i++;
			console.log(address);
			if (address) {
				type = _getTizenObjectType(address.types);
				result[type] ? result[type].push({
					CountryCode: "",
					Street: address.streetAddress || "",
					City: address.city || "",
					County: "",
					State: address.region || "",
					Country: address.country || "",
					ZIP: address.postalCode || ""
				}) : result[type] = [{
					CountryCode: "",
					Street: address.streetAddress || "",
					City: address.city || "",
					County: "",
					State: address.region || "",
					Country: address.country || "",
					ZIP: address.postalCode || ""
				}];
			} else {
				flag = false;
			}
		}
		console.log('result');
		console.log(result);
		return result;
	};
		
	function _mapAddressesFromTitanium(person) {
		var result = [], 
			address = person.address,
			addressTypes = ['home', 'work'], 
			i = 0, 
			j= 0, 
			currentAddress = null;
		if (address) {
			for (i in addressTypes) {
				currentAddress = address[addressTypes[i]];
				if (currentAddress) {
					for (j in currentAddress) {
						result.push(new tizen.ContactAddress({
							streetAddress: currentAddress[j].Street || '',
							city: currentAddress[j].City || '',
							region: currentAddress[j].State || '',
							country: currentAddress[j].Country || '',
							postalCode: currentAddress[j].ZIP || '',
							types: [addressTypes[i].toUpperCase()]
						}));							
					}
				}					
			}
		}
		return result;
	};
	
	function _mapEmailsFromTizen(tizenContact) {
		var result = {}, 
			i = 0, 
			flag = true, 
			email = null, 
			type = "";
		while (flag) {
			if (!tizenContact.emails) {
				flag = false;
				continue;
			}
			email = tizenContact.emails[i];
			i++;
			if (email) {
				type = _getTizenObjectType(email.types);
				result[type] ? result[type].push(email.email) :result[type] = [email.email];
			} else {
				flag = false;
			}
		}
		return result;
	};
	
	function _mapEmailsFromTitanium(person) {
		var result = [], 
			emails = person.email, 
			email = "",
			emailTypes = ['home', 'work'], 
			i = 0, 
			j = 0, 
			currentEmail = null;
		if (emails) {
			for(i in emailTypes) {
				currentEmail = emails[emailTypes[i]]; 
				if (currentEmail) {
					for (j in currentEmail) {
						result.push(new tizen.ContactEmailAddress(
								currentEmail[j],
								[emailTypes[i].toUpperCase()]
							));
					}
				}
			}
		}
		return result;
	};
	
	function _mapPhoneNumbersFromTizen(tizenContact) {
		var result = {}, 
			i = 0, 
			flag = true, 
			phoneNumber = null, 
			type = "";
		while (flag) {
			if (! tizenContact.phoneNumbers) {
				flag = false;
				continue;
			}				
			phoneNumber = tizenContact.phoneNumbers[i];
			i++;
			if (phoneNumber) {
				type = _getTizenPhoneType(phoneNumber.types);
				result[type] ? result[type].push(phoneNumber.number) : result[type] = [phoneNumber.number];
			} else {
				flag = false;
			}
		}
		return result;
	};
	
	function _mapPhoneNumbersFromTitanium(person){
		var result = [], 
			phoneNumbers = person.phone,
			numberTypes = ['work', 'home', 'mobile', 'pager'], 
			currentNumber = null, 
			i = 0, 
			j = 0;
		if (phoneNumbers) {
			for (i in numberTypes) {
				currentNumber = phoneNumbers[numberTypes[i]];
				if (currentNumber) {
					for (j in currentNumber) {
						result.push(new tizen.ContactPhoneNumber(
								currentNumber[j],
								[(numberTypes[i] == 'mobile') ? 'CELL' : numberTypes[i].toUpperCase()]
						));							
					}
				}
			}
		}
		return result;
	};
	
	function _mapAnniversaryFromTizen(tizenContact) {
		var result = {}, 
			flag = true, 
			anniversary = null, 
			i = 0;
		while(flag) {
			if (tizenContact.anniversaries === null) {
				flag = false;
				continue;
			}
			anniversary = tizenContact.anniversaries[i];
			if (anniversary) {
				if (anniversary.label && (anniversary.label == "anniversary")) {
					result.anniversary ? result.anniversary.push(new Date(anniversary.date).toUTCString()) : result.anniversary = [new Date(anniversary.date).toUTCString()];
				} else {
					result.other ? result.other.push(new Date(anniversary.date).toUTCString()) : result.other = [new Date(anniversary.date).toUTCString()];
				}
			} else {
				flag = false;
			}
			i++;
		}
		return result;
	};
		
	function _mapAnniversariesFromTitanium(person) {
		var result = [], 
			anniversaries = person.date,
			anniversaryTypes = ['anniversary', 'other'], 
			i = 0, 
			j= 0, 
			currentAnniversary = null;
		if (anniversaries) {
			for (i in anniversaryTypes) {
				currentAnniversary = anniversaries[anniversaryTypes[i]];
				if (currentAnniversary) {
					for (j in currentAnniversary) {
						result.push(new tizen.ContactAnniversary(new Date(currentAnniversary[j]),anniversaryTypes[i]));
					}
				}
			}
		}
		return result;
	};
	
	function _mapWebSitesFromTizen(tizenContact) {
		var result = {}, 
			flag = true, 
			i = 0, 
			webSite = null, 
			type = "";
		while (flag) {
			webSite = tizenContact.urls[i];
			if (webSite) {
				type = _getTizenWebSiteType(webSite.type);
				result[type] ? result[type].push(webSite.url) : result[type] = [webSite.url];
			} else {
				flag = false;
			}
			i++;
		}
		return result;
	};
	
	function _mapWebSitesFromTitanium(person) {
		var result = [], 
			webSites = person.url, 
			currentWebSite = null, 
			i = 0;
		if (webSites) {
			currentWebSite = webSites.homepage;
			if (currentWebSite) {
				for (i in currentWebSite) {
					result.push(new tizen.ContactWebSite(currentWebSite[i], 'HOMEPAGE'));
				}
			}
		}	
		return result;
	};

	var addressbook = tizen.contact.getDefaultAddressBook();


	return lang.setObject("Ti.Contacts", Evented, {

		_createTitaniumContact: function(tizenContact) {
			console.log(2222222);
			var name, organization, person,
				obj = {
					address: _mapAddressesFromTizen(tizenContact),
					email: _mapEmailsFromTizen(tizenContact),
					phone: _mapPhoneNumbersFromTizen(tizenContact),
					birthday: tizenContact.birthday ? new Date(tizenContact.birthday).toUTCString() : null,
					date: _mapAnniversaryFromTizen(tizenContact),
					url: _mapWebSitesFromTizen(tizenContact),
					id: tizenContact.id
				}
			console.log('Object created');
			if (tizenContact.name) {
				name = tizenContact.name;
				obj.firstName = name.firstName || '';
				obj.middleName = name.middleName || '';
				obj.lastName = name.lastName || '';
				obj.nickname = name.nicknames[0] || '';
				obj.firstPhonetic = name.phoneticFirstName || '';
				obj.lastPhonetic = name.phoneticLastName || '';
			}

			organization = tizenContact.organization;

			obj.organization = (organization && organization.name) ? organization.name : '';
			obj.department = (organization && organization.department) ? organization.department : '';
			obj.jobTitle = (organization && organization.title) ? organization.title : '';

			person = new Person(obj);
			return person;
		},

		_mapContactFromTitanium: function(person, groupName) {
			var tizenContact, 
				name, 
				organization;
			
			if (person.id) {
				tizenContact = addressbook.get(person.id);
				tizenContact.addresses = _mapAddressesFromTitanium(person);
				tizenContact.emails = _mapEmailsFromTitanium(person);
				name = tizenContact.name;
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
				tizenContact.name = name;
				tizenContact.phoneNumbers = _mapPhoneNumbersFromTitanium(person);
				tizenContact.birthday = person.birthday ? new Date(person.birthday) : null;
				organization = tizenContact.organization;
				if (organization) {
					organization.name = person.organization || null;
					organization.department = person.department || null;
					organization.title = person.jobTitle || null;
				} else {
					organization = new tizen.ContactOrganization({
						name: person.organization || null,
						department: person.department || null,
						title: person.jobTitle || null,
					});
				}
				tizenContact.organization = organization;
				tizenContact.anniversaries = _mapAnniversariesFromTitanium(person);
				tizenContact.note = person.note || void 0;
				tizenContact.urls = _mapWebSitesFromTitanium(person);
			} else {
				tizenContact = new tizen.Contact({
					addresses: _mapAddressesFromTitanium(person),
					emails: _mapEmailsFromTitanium(person),
					name: new tizen.ContactName({
						prefix: person.prefix || '',
						firstName: person.firstName || '',
						middleName: person.middleName || '',
						lastName: person.lastName || '',
						nicknames: (person.nickname) ? [person.nickname] : [],
						phoneticFirstName: person.firstPhonetic || null,
						phoneticLastName: person.lastPhonetic || null
					}),
					phoneNumbers: _mapPhoneNumbersFromTitanium(person),
					birthday: person.birthday ? new Date(person.birthday) : null,
					organization: new tizen.ContactOrganization({
						name: person.organization || null,
						department: person.department || null,
						title: person.jobTitle || null,
					}),
					anniversaries: _mapAnniversariesFromTitanium(person),
					note: person.note || void 0,
					urls: _mapWebSitesFromTitanium(person)
				});	
			}

			groupName && tizenContact.categories && (Object.prototype.toString.call(tizenContact.categories) === '[object Array]') 
				? tizenContact.categories.push(groupName)
				: tizenContact.categories = [groupName];
			return tizenContact;
		},
		
		constants: {
			AUTHORIZATION_UNKNOWN: 0,
			AUTHORIZATION_DENIED: 1,
			AUTHORIZATION_RESTRICTED: 2,
			AUTHORIZATION_AUTHORIZE: 3,

			CONTACTS_SORT_FIRST_NAME: 0,
			CONTACTS_SORT_LAST_NAME: 1,

			contactsAuthorization: this.AUTHORIZATION_AUTHORIZE
		},

		createGroup: function(args) {
			return new (require('Ti/Contacts/Group'))(args);
		},

		createPerson: function(person) {
			/*var addressBook = tizen.contact.getDefaultAddressBook(),   
				tizenContact = this._mapContactFromTitanium(person);
			addressBook.add(tizenContact);*/
			var person = new Person(person);
			//person = this._mapContactFromTizen(tizenContact, person);	
			return person;
		},
		
		getAllGroups: function() {
			var addressbook = tizen.contact.getDefaultAddressBook(), 
				groups = [];
			groups = addressbook.getCategories();
			return groups ? groups : [];
		},

		getAllPeople: function() {
			throw new Error('This function is not supported here. Use Ti.Contacts.Tizen.getAllPeople instead.');
		},

		getGroupByID: function(id) { 
			throw new Error('This function is not supported on Tizen. Use getAllGroups instead.');
		},
		getPeopleWithName: function(name) {
			throw new Error('This function is not supported here. Use Ti.Contacts.Tizen.getPeopleWithName instead.');
		},

		getPersonByID: function(id) {
			console.log('Before');
			try {
				var contact = addressbook.get(id);
			} catch (e) {
				console.log(e.type + ' = ' + e.message);
			}
			console.log('id = ' + contact.id);
			return new Person(this._createTitaniumContact(contact));
		},

		removeGroup: function(Group) {
			throw new Error('This method is not supported here. Use Ti.Contacts.Tizen.removeGroup instead.');
		},
		
		removePerson: function(Person) {
			var addressBook = tizen.contact.getDefaultAddressBook();
			addressBook.remove(Person.id);
		},
		
		save: function(persons) {
			var addressbook = tizen.contact.getDefaultAddressBook(), 
				i = 0, 
				personsCount = persons.length;
			for (; i < personsCount; i++) {
				addressbook.update(this._mapContactFromTitanium(persons[i]));
			}
		}
		
	});
});