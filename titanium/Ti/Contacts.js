define(
	['Ti/_/Evented', 'Ti/_/lang', 'Ti/Contacts/Person', 'Ti/Contacts/Group', 'Ti/_/Contacts/helper', 'Ti/API'],
	function(Evented, lang, Person, Group, contactHelper, API) {

	return lang.setObject('Ti.Contacts', Evented, {

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
				}))
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
				addressbook.update(contactHelper.updateTizenContact(persons[i]));
			}
		},
		
		showContacts: function(values) {
			// Display a picker that allows a person to be selected.

			// However, a TableView is used instead of a Picker, so that the contact
			// information is presented in convenient tabular form.
		
			var self = this,
				win = Ti.UI.createWindow({ backgroundColor: '#81BEF7' }),
				tableview,
				data = [],
				tableViewOptions,
				closeBtn = Ti.UI.createButton({
					title: 'Close',
					bottom: 20,
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
			
			// Sorting by title.
			function compare(a,b) {
			  if (a.title < b.title)
				 return -1;
			  if (a.title > b.title)
				return 1;
			  return 0;
			}
				
			// Success callback for getAllPeople.
			var successCB = function(persons) {
				// Formulate the data for the TableView in the format that it understands.
			
				for(var i = 0, len = persons.length; i < len; i++) {
					data.push({ title: persons[i]['fullName'], hasChild: true, test: persons[i].id });
				}

				data.sort(compare);
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
				tableview = Titanium.UI.createTableView(tableViewOptions);

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
			}
			
			// error callback for getAllPeopleAsync
			var errorCB = function(e){
				API.error('Problems with getting the contacts, Error: ' + e.message);
			}

			Ti.Contacts.Tizen.getAllPeople(successCB, errorCB);
		}

	});
});