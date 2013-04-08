define(
	['Ti/_/Evented', 'Ti/_/lang', 'Ti/_/Contacts/helper', 'Ti/API', 'Ti/UI', 'Ti/Contacts/Tizen'],
	function(Evented, lang, contactHelper, API, UI, ContactsTizen) {

	var Group = require('Ti/Contacts/Group'),
		Person = require('Ti/Contacts/Person');


	// Update existing Tizen contact from Ti.Contacts.Person
	// Input parameter: Ti.Contacts.Person object.
	// Returns Tizen Contact object.
	function updateTizenContact(person) {
		var contact = tizen.contact.getDefaultAddressBook().get(person.id),
			name, organization;

		contact.addresses = person.address && contactHelper.createTizenAddresses(person.address);
		contact.emails = person.email && contactHelper.createTizenEmails(person.email);
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
		contact.phoneNumbers = person.phone && contactHelper.createTizenPhoneNumbers(person.phone);
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

		contact.anniversaries = person.date && contactHelper.createTizenAnniversaries(person.date);
		contact.notes = [person.note] || void 0;
		contact.urls = person.url && contactHelper.createTizenWebSites(person.url);

		return contact;
	}

	return lang.setObject('Ti.Contacts', Evented, {

		constants: {
			AUTHORIZATION_UNKNOWN: 0,
			AUTHORIZATION_DENIED: 1,
			AUTHORIZATION_RESTRICTED: 2,
			AUTHORIZATION_AUTHORIZE: 3,

			CONTACTS_SORT_FIRST_NAME: 0,
			CONTACTS_SORT_LAST_NAME: 1,

			CONTACT_KIND_PERSON: 1,
			CONTACTS_KIND_ORGANIZATION: 2,
			contactsAuthorization: this.AUTHORIZATION_AUTHORIZE
		},

		createGroup: function(args) {
			return new Group(args);
		},

		createPerson: function(person) {
			return new Person(person);
		},

		getAllGroups: function() {
			var addressbook = tizen.contact.getDefaultAddressBook(),
				groups = addressbook.getGroups(),
				result = [],
				i = 0,
				groupsCount = groups.length;
			for (; i < groupsCount; i++) {
				result.push(new Group({
					name: groups[i].name,
					id: groups[i].id
				}));
			}
			return result;
		},

		getAllPeople: function() {
			throw new Error('This function is not supported here. Use Ti.Contacts.Tizen.getAllPeople instead.');
		},

		getGroupByID: function(id) {
			var group = tizen.contact.getDefaultAddressBook().getGroup(id);
			return new Group({
				name: group.name,
				id: group.id
			});
		},
		getPeopleWithName: function(name) {
			throw new Error('This function is not supported here. Use Ti.Contacts.Tizen.getPeopleWithName instead.');
		},

		getPersonByID: function(id) {
			var contact = tizen.contact.getDefaultAddressBook().get(id);
			return new Person(contactHelper.createTitaniumContact(contact));
		},

		removeGroup: function(group) {
			tizen.contact.getDefaultAddressBook().removeGroup(group.id);
		},

		removePerson: function(person) {
			tizen.contact.getDefaultAddressBook().remove(person.id);
		},

		save: function(persons) {
			persons = persons || [];
			var addressbook = tizen.contact.getDefaultAddressBook(),
				i = 0,
				personsCount = persons.length;
			for (; i < personsCount; i++) {
				addressbook.update(updateTizenContact(persons[i]));
			}
		},

		showContacts: function(values) {
			// Display a picker that allows a person to be selected.

			// However, a TableView is used instead of a Picker, so that the contact
			// information is presented in convenient tabular form.

			var self = this,
				win = UI.createWindow({ backgroundColor: '#81BEF7' }),
				tableview,
				data = [],
				tableViewOptions,
				closeBtn = UI.createButton({
					title: 'Close',
					right: 20,
					height: '6%',
					bottom: '2%'
				});
			values = values || {};

			// Configure TableView headers to highlight the first letter of the contacts being displayed.
			function addHeaders(list) {
				var fL,
					l,
					i = 0,
					listLength = list.length,

					// Headers can only display letters, not numbers or special symbols.
					iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_0123456789";

				// Iterate the list items. When we detect a change in the first letter with respect
				// to the previous row, we declare a header for this row.
				for(; i < listLength; i++) {
					fL = list[i]['title'].charAt(0);
					if((iChars.indexOf(fL) === -1) && l != fL) {
						list[i]['header'] = fL.toUpperCase();  // this row now contains a header
					}
					l = fL;
				}
			}

			ContactsTizen.getAllPeople(function(persons) {
				// Success callback for getAllPeople.
				// Formulate the data for the TableView in the format that it understands.
				for(var i = 0, len = persons.length; i < len; i++) {
					data.push({ title: persons[i]['fullName'], hasChild: true, test: persons[i].id });
				}

				data.sort(function(a,b) {
					// Sorting by title.
					if (a.title < b.title)
						return -1;
					if (a.title > b.title)
						return 1;
					return 0;
				});
				addHeaders(data);

				tableViewOptions = {
					data:data,
					headerTitle: 'Contacts',
					footerTitle:persons.length + ' Contacts',
					backgroundColor: '#FFF',
					rowBackgroundColor: 'white',
					height: '90%',
					top: 0
				};

				// Create the TableView which will be our picker.
				tableview = UI.createTableView(tableViewOptions);

				tableview.addEventListener('click', function(e) {
					e.person = self.getPersonByID(e.rowData.test);
					if (values.selectedPerson) {
						values.selectedPerson(e);
						win.close();
					}
				});
				closeBtn.addEventListener('click', function(e) {
					values.cancel && values.cancel();
					win.close();
				});

				win.add(tableview);
				win.add(closeBtn);
				win.open();
			},
			function(e){ //Error callback
				API.error('Problems with getting the contacts, Error: ' + e.message);
			});
		}
	});
});