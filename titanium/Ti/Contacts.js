define(['Ti/_/Evented', 'Ti/_/lang', 'Ti/Contacts/Person', 'Ti/Contacts/Group', 'Ti/_/Contacts/helper'], function(Evented, lang, Person, Group, contactHelper) {

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
			var addressbook = tizen.contact.getDefaultAddressBook(), 
				i = 0, 
				personsCount = persons.length;
			for (; i < personsCount; i++) {
				addressbook.update(contactHelper.updateTizenContact(persons[i]));
			}
		},
		showContacts: function(values){
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
				// add headers as first letter for contacts
				function addHeaders(list) {
					var fL,
						l,
						//headers can be only letter, not number or special symbol
						iChars = "!@#$%^&*()+=-[]\\\';,./{}|\":<>?~_0123456789";

					for(var i=0, len = list.length; i<len; i++) {
						fL = list[i]['title'].charAt(0);
						if((iChars.indexOf(fL) === -1) && l != fL) {
							list[i]['header'] = fL.toUpperCase();
						}
						l = fL;
					} 
				}
				//sorting function by title
				function compare(a,b) {
				  if (a.title < b.title)
					 return -1;
				  if (a.title > b.title)
					return 1;
				  return 0;
				}
			//success callback for getAllPeople
			var successCB = function(persons){
				for(var i=0, len = persons.length; i < len; i++) {
					data.push({title: persons[i]['fullName'], hasChild:true, test: persons[i].id});	
				}

				data.sort(compare);
				addHeaders(data);

				tableViewOptions = {
					data:data,
					headerTitle:'Contacts',
					footerTitle:persons.length + " Contacts",
					backgroundColor:'#FFF',
					rowBackgroundColor:'white',
					height: '90%',
					top:0
				};
				tableview = Titanium.UI.createTableView(tableViewOptions);

				tableview.addEventListener('click', function(e) {
					e.person = self.getPersonByID(e.rowData.test);
					values.selectedPerson(e);
					win.close();
				});
				closeBtn.addEventListener('click', function(e) {
					values.cancel();
					win.close();
				});

				win.add(tableview);
				win.add(closeBtn);
				win.open();
			}
			//error callback for getAllPeopleAsync
			var errorCB = function(e){
				console.log('Problems with getting the contacts, Error: ' + e.message);
			}

			Ti.Contacts.Tizen.getAllPeople(successCB, errorCB);
		}

	});
});