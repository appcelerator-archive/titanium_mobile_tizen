module.exports = new function() {
	var finish,
		valueOf,
		reportError;
	
	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
	}

	this.name = "contacts";
	this.tests = [
		{name: "contactsAuthorization"},
		{name: "createPerson"},
		{name: "getAllGroups"},
		{name: "getAllPeople"},
		{name: "getContactsAuthorization"},
		{name: "getGroupById"},
		{name: "getPeopleWithName"},
		{name: "getPersonById"},
		{name: "removePerson"},
		{name: "saveContact"}
	];

	this.contactsAuthorization = function(testRun) {
		valueOf(testRun,  Ti.Contacts.contactsAuthorization).shouldBe(Ti.Contacts.AUTHORIZATION_AUTHORIZED);
		finish(testRun);
	}

	this.createPerson = function(testRun) {
		var person = Ti.Contacts.createPerson({
			firstName: 'John',
			lastName: 'Doe'
		});

		valueOf(testRun, person.id).shouldBeGreaterThan(0);
		valueOf(testRun, person.firstName).shouldBe('John');
		valueOf(testRun, person.lastName).shouldBe('Doe');

		finish(testRun);
	}

	this.getAllGroups = function(testRun) {
		// We need to add contact with category through tizen, because titaium doesn't support it
		var group = Ti.Contacts.createGroup({name: "friends"});

		group.add({firstName: "John", lastName: "Smith"});
		groups = Ti.Contacts.getAllGroups();
		
		valueOf(testRun,  groups).shouldContainDeprecated("friends");

		finish(testRun);
	}

	this.getAllPeople = function(testRun) {
		// Add 10 contacts
		for (var i = 0; i < 10; i++) {
			Ti.Contacts.createPerson({
				firstName: 'John' + i,
				lastName: 'Smith' + i
			});
		}

		Ti.Contacts.Tizen.getAllPeople(function(persons) {
			valueOf(testRun, persons.length).shouldBeGreaterThan(9);
			finish(testRun);
		},  function(err) {
			reportError(testRun, 'The following error occured: ' + err.message);
		});
	}

	this.getContactsAuthorization = function(testRun) {
		valueOf(testRun,  Ti.Contacts.getContactsAuthorization()).shouldBe(Ti.Contacts.AUTHORIZATION_AUTHORIZED);
		
		finish(testRun);
	}

	this.getGroupById = function(testRun) {
		valueOf(testRun, function() {
			Ti.Contacts.getPersonByID();
		}).shouldThrowException();

		finish(testRun);
	}

	this.getPeopleWithName = function(testRun) {
		// Remove all contacts
		Ti.Contacts.Tizen.getAllPeople(function(persons) {
			var i = 0, 
				personsCount = persons.length;

			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}

			// Add 5 contacts with names John Smith
			for (i = 0; i < 5; i++) {
				Ti.Contacts.createPerson({
					firstName: "John",
					lastName: "Smith"
				});
			}

			// Add 5 contacts with names Mark Duglas
			for (i = 0; i < 5; i++) {
				Ti.Contacts.createPerson({
					firstName: "Mark",
					lastName: "Duglas"
				});
			}

			Ti.Contacts.Tizen.getPeopleWithName("John Smith", function(persons) {
				valueOf(testRun, persons.length).shouldBe(5);
				finish(testRun);
			}, function(err) {
				reportError(testRun, 'The following error occured: ' + err.message);
			});
		},  function(err) {
			reportError(testRun, 'The following error occured: ' + err.message);
		});
	}

	this.getPersonById = function(testRun) {
		var person = Ti.Contacts.createPerson({
				firstName: 'John',
				lastName: 'Smith'
			}),
			person1 = Ti.Contacts.getPersonByID(person.id);

		valueOf(testRun, person1.id).shouldBe(person.id);
		finish(testRun);
	}	

	this.removePerson = function(testRun) {
		var person = Ti.Contacts.createPerson({
				firstName: 'John',
				lastName: 'Smith'
			});
		
		Ti.Contacts.removePerson(person);
		
		valueOf(testRun, function() {
			Ti.Contacts.getPersonByID(person.id);
		}).shouldThrowException();
		finish(testRun);
	}

	this.saveContact = function(testRun) {
		Ti.Contacts.Tizen.getAllPeople(function(persons){
			var i = 0, 
				personsCount = persons.length;
			
			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}

			var person = Ti.Contacts.createPerson({
				firstName: 'John',
				lastName: 'Smith'
			});

			person.firstName = 'Oleh';
			
			Ti.Contacts.save([person]);
			Ti.Contacts.Tizen.getAllPeople(function(persons) {
				valueOf(testRun, persons.length).shouldBe(1);
				var contact = Ti.Contacts.getPersonByID(person.id);
				valueOf(testRun, contact.firstName).shouldBe('Oleh');
				finish(testRun);
			}, function(err) {
				reportError(testRun, 'The following error occured: ' + err.message);
			});
		}, function(err) {
			reportError(testRun, 'The following error occured: ' + err.message);
		});		
	}
}