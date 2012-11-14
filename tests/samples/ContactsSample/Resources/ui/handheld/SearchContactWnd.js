function SearchContactWnd(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	var tableView = null;
	
	var button = Ti.UI.createButton({
		height:40,
		width:'30%',
		title:L('Search'),
		top:20,
		left: '70%'
	});
	var searchInput = Ti.UI.createTextField({
		height: 40,
		top: 20,
		left: '5%',
		width: '60%'
	});
	self.add(searchInput);
	
	function labelClick(person) {
		var newWnd = Ti.UI.createWindow({
			title: L('Contact details')
		}), index = e.source.id, tableData = [], table = null,
		tableRow = Ti.UI.createTableViewRow({
			rowIndex: 0,
			height: 60,
			width: '100%'
		}), label = null;
		
		console.log(persons[index]);
		
		//adding first name
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: 0,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: 'First name',
			width: '40%'
		});
		tableRow.add(label);
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: '40%',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: person.firstName,
			width: '60%'					
		});
		tableRow.add(label);
		tableData.push(tableRow);
		//adding last name
		tableRow = Ti.UI.createTableViewRow({
			rowIndex: 1,
			height: 60,
			width: '100%'
		});				
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: 0,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: 'Last name',
			width: '40%'
		});
		tableRow.add(label);
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: '40%',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: person.lastName,
			width: '60%'					
		});
		tableRow.add(label);
		tableData.push(tableRow);

		//adding work email
		tableRow = Ti.UI.createTableViewRow({
			rowIndex: 2,
			height: 60,
			width: '100%'
		});				
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: 0,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: 'Work email',
			width: '40%'
		});
		tableRow.add(label);
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: '40%',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: person.email.work || '',
			width: '60%'					
		});
		tableRow.add(label);
		tableData.push(tableRow);		
		
		//adding other email
		tableRow = Ti.UI.createTableViewRow({
			rowIndex: 1,
			height: 60,
			width: '100%'
		});				
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: 0,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: 'Other email',
			width: '40%'
		});
		tableRow.add(label);
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: '40%',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: person.email.other || '',
			width: '60%'					
		});
		tableRow.add(label);
		tableData.push(tableRow);		
		
		//adding work phone
		tableRow = Ti.UI.createTableViewRow({
			rowIndex: 1,
			height: 60,
			width: '100%'
		});				
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: 0,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: 'Work phone',
			width: '40%'
		});
		tableRow.add(label);
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: '40%',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: person.phone.work || '',
			width: '60%'					
		});
		tableRow.add(label);
		tableData.push(tableRow);	
		
		//adding other phone
		tableRow = Ti.UI.createTableViewRow({
			rowIndex: 1,
			height: 60,
			width: '100%'
		});				
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: 0,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: 'Other phone',
			width: '40%'
		});
		tableRow.add(label);
		label = Ti.UI.createLabel({
			font: {
				fontSize: 20
			},
			left: '40%',
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			text: person.phone.other || '',
			width: '60%'					
		});
		tableRow.add(label);
		tableData.push(tableRow);					
		
		table = Ti.UI.createTableView({
			data: tableData
		});
		newWnd.add(table);
		self.containingTab.open(newWnd);		
	}
		
	button.addEventListener('click', function() {
		//containingTab attribute must be set by parent tab group on
		//the window for this work
		var tableData = [], contactsCount = 0, i = 0, person = null, addressBook = tizen.contact.getDefaultAddressBook(),
			tableRow = null, label = null, firstName = '', lastName = '', persons = [];
		console.log('clicked');	
		var val = searchInput.value.trim();
		if (!val) {
			return false;
		}
		Ti.Contacts.getPeopleWithNameAsync(val, function(persons){
			contactsCount = persons.length;
			console.log(persons);
			for (i = 0; i < contactsCount; i++) {
				person = persons[i];
				tableRow = Ti.UI.createTableViewRow({
					rowIndex: i,
					height: 60,
					width: '100%'
				});
				firstName = person.firstName || '';
				lastName = person.lastName || '';
				label =  Ti.UI.createLabel({
					font: {
						fontSize: 20,
					},
					textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
					text: firstName + ' ' + lastName,
					id: i
				});
//				label.addEventListener('click', function(e) {
//					labelClick(persons[e.source.id]);
//				});
				tableRow.add(label);
				tableData.push(tableRow);
			}
			tableView = Ti.UI.createTableView({
				backgroundColor: 'white',
				data: tableData,
				top: 80,
				left: 10,
				width: '100%'
			});
			self.add(tableView);			
		}, function(err){
			console.log('Following error occured ' + err.name);
		});
		

	});
	
	self.add(button);
	
	return self;
};

module.exports = SearchContactWnd;
