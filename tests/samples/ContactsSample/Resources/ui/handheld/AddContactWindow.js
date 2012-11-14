function AddContactWindow(title) {
	var self = Ti.UI.createWindow({
		title: title,
		backgroundColor: 'white'
	});
	
	var firstNameLabel = Ti.UI.createLabel({
		top: 10,
		left: 0,
		width: '40%',
		height: 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		text: L('First name')
	});
	self.add(firstNameLabel);
	
	var firstNameInput = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: 10,
		left: '45%',
		width: '50%',
		height: 30,
		value: 'Igor'
	});
	self.add(firstNameInput);
	
	var lastNameLabel = Ti.UI.createLabel({
		top: 50,
		left: 0,
		width: '40%',
		height: 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		text: L('Last name')
	});
	self.add(lastNameLabel);
	
	var lastNameInput = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: 50,
		left: '45%',
		width: '50%',
		height: 30,
		value: 'Ostash'
	});
	self.add(lastNameInput);	
	
	var workPhoneLabel = Ti.UI.createLabel({
		top: 90,
		left: 0,
		width: '40%',
		height: 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		text: L('Work phone')
	});
	self.add(workPhoneLabel);
	
	var workPhoneInput = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: 90,
		left: '45%',
		width: '50%',
		height: 30,
		value: '123456789'
	});
	self.add(workPhoneInput);	
	
	var workEmailLabel = Ti.UI.createLabel({
		top: 130,
		left: 0,
		width: '40%',
		height: 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		text: L('Work email')
	});
	self.add(workEmailLabel);
	
	var workEmailInput = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: 130,
		left: '45%',
		width: '50%',
		height: 30,
		value: 'user@mail.com'
	});
	self.add(workEmailInput);
	
	var countryLabel = Ti.UI.createLabel({
		top: 170,
		left: 0,
		width: '40%',
		height: 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		text: L('Country')
	});
	self.add(countryLabel);
	
	var countryInput = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: 170,
		left: '45%',
		width: '50%',
		height: 30,
		value: 'Ukraine'
	});
	self.add(countryInput);
	
	
	var cityLabel = Ti.UI.createLabel({
		top: 210,
		left: 0,
		width: '40%',
		height: 30,
		textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
		text: L('City')
	});
	self.add(cityLabel);
	
	var cityInput = Ti.UI.createTextField({
		borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		top: 210,
		left: '45%',
		width: '50%',
		height: 30,
		value: 'Lviv'
	});
	self.add(cityInput);
	
	var button = Ti.UI.createButton({
		title: L('Save contact'),
		top: 280,
		width: '60%'
	});
	self.add(button);
	
	button.addEventListener('click', function(e){
		var person = {
			address: {
				work: {
					Country: countryInput.value,
					City: cityInput.value
				}
			},
			email: {
				work: workEmailInput.value
			},
			firstName: firstNameInput.value || 'no name',
			lastName: lastNameInput.value || 'no surname',
			phone: {
				work: workPhoneInput.value
			}
		},
		contact = Ti.Contacts.createPerson(person);
		alert('Contact saved successfully. ID=' + contact.id);
		if (Ti.App.rowsCount) {
			Ti.App.rowsCount++;
			console.log('Now rows count=' + Ti.App.rowsCount);
		}
		countryInput.value = "";
		cityInput.value = "";
		workEmailInput.value = "";
		firstNameInput.value = "";
		lastNameInput.value = "";
		workPhoneInput.value = "";
		Ti.App.Person = contact;
		var test = Ti.UI.currentTabGroup;
		Ti.App.fireEvent('updateContactList');
		
	});
	
	return self;
}
module.exports = AddContactWindow;