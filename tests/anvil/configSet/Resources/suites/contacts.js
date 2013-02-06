module.exports = new function() {
	var finish;
	var valueOf;
	var reportError;
	
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
	]
	
	this.contactsAuthorization = function(testRun) {
		valueOf(testRun,  Ti.Contacts.contactsAuthorization).shouldBe(Ti.Contacts.AUTHORIZATION_AUTHORIZED);
		finish(testRun);
	}
	
	this.createPerson = function(testRun) {
		var person = Ti.Contacts.createPerson({
			firstName: 'Roman',
			lastName: 'Kamenetsky'
		});
		valueOf(testRun, person.id).shouldBeGreaterThan(0);
		valueOf(testRun, person.firstName).shouldBe('Roman');
		valueOf(testRun, person.lastName).shouldBe('Kamenetsky')
		finish(testRun);
	}
	
	this.getAllGroups = function(testRun) {
		//we need to add contact with category through tizen, because titaium doesn't support it
		console.log('test started');
		var group = Ti.Contacts.createGroup({name: "friends"});
		console.log('Group created');
		group.add({firstName: "John", lastName: "Smith"});
		console.log('Contact added');
		groups = Ti.Contacts.getAllGroups();
		valueOf(testRun,  groups).shouldContainDeprecated("friends");
		finish(testRun);
	}
	
	this.getAllPeople = function(testRun) {
		var i = 0;
		//add 10 contacts
		for (; i < 10; i++) {
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
		valueOf(testRun,  Ti.Contacts.getContactsAuthorization()).shouldBe(Ti.Contacts.AUTHORIZATION_AUTHORIZED)
		finish(testRun);
	}
	
	this.getGroupById = function(testRun) {
		valueOf(testRun, function(){
			Ti.Contacts.getPersonByID();
		}).shouldThrowException();
		finish(testRun);
	}
		
	this.getPeopleWithName = function(testRun) {
		//remove all contacts
		Ti.Contacts.Tizen.getAllPeople(function(persons){
			var i = 0, personsCount = persons.length;
			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}
			//add 5 contacts with names John Smith
			for (i = 0; i < 5; i++) {
				Ti.Contacts.createPerson({
					firstName: "John",
					lastName: "Smith"
				});
			}
			//add 5 contacts with names Mark Duglas
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
				firstName: 'Roman',
				lastName: 'Kamenetsky'
			})
		var person1 = Ti.Contacts.getPersonByID(person.id);
		valueOf(testRun, person1.id).shouldBe(person.id);
		finish(testRun);
	}	
	
	this.removePerson = function(testRun) {
		var person = Ti.Contacts.createPerson({
				firstName: 'Roman',
				lastName: 'Kamenetsky'
			});
		console.log(person.id);
		Ti.Contacts.removePerson(person);
		console.log(person.id);
		valueOf(testRun, function(){
			Ti.Contacts.getPersonByID(person.id);
		}).shouldThrowException();
		finish(testRun);
	}
	
	this.saveContact = function(testRun) {
		Ti.Contacts.Tizen.getAllPeople(function(persons){
			var i = 0, personsCount = persons.length;
			for (; i < personsCount; i++) {
				Ti.Contacts.removePerson(persons[i]);
			}
			var person = Ti.Contacts.createPerson({
				firstName: 'Roman',
				lastName: 'Kamenetsky'
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