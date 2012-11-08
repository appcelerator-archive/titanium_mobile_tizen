function ApplicationWindow(title) {
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:'white'
	});
	var tableView = null;
	
	Ti.App.addEventListener('updateContactList', function(e){
		if (tableView) {
			console.log('rows count=' + Ti.App.rowsCount);
			var ind = Ti.App.rowsCount;
			var row = Ti.UI.createTableViewRow({
				height: 60,
				width: '100%',
				rowIndex: ind
			});
			console.log('2');
			var label =  Ti.UI.createLabel({
				font: {
					fontSize: 20,
				},
				textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
				text: Ti.App.Person.firstName + ' ' + Ti.App.Person.lastName,
				id: Ti.App.Person.id,
				left: 5,
				width: '65%'				
			});	
			console.log('3');
			label.addEventListener('click',  function(e){
				labelClick(e, Ti.App.Person);
			});
			
			//REMOVE BUTTON
			var removeBtn = Ti.UI.createButton({
				title: L('Remove'),
				left: '70%',
				width: '30%',
				id: Ti.App.Person.id,
				rowNumber: ind
			});
			removeBtn.addEventListener('click',  function(e){
				Ti.Contacts.removePerson(Ti.Contacts.getPersonById(e.source.id));
				console.log('contact removed');
				console.log(e.source.rowNumber);
				tableView.deleteRow(e.source.rowNumber);
				Ti.App.rowsCount--;
				alert('Contact has been removed');
			});			
			console.log('4');
			row.add(label);
			row.add(removeBtn);
			console.log('5');
			tableView.appendRow(row);
			console.log('6');
		}
	});
	
	var button = Ti.UI.createButton({
		height:44,
		width:200,
		title:L('Show all contacts'),
		top:20
	});
	
	function labelClick(e, person) {
		var newWnd = Ti.UI.createWindow({
			title: L('Contact details')
		}), index = e.source.id, tableData = [], table = null,
		tableRow = Ti.UI.createTableViewRow({
			rowIndex: 0,
			height: 60,
			width: '100%'
		}), label = null;
		
	
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
			tableRow = null, label = null, firstName = '', lastName = '', persons = [], removeBtn = null;
		console.log('clicked');	
		Ti.Contacts.getAllPeopleAsync(function(persons){
			contactsCount = persons.length;
			console.log(contactsCount);
			for (i = 0; i < contactsCount; i++) {
				console.log('i = ' + i);
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
					id: i,
					left: 5,
					width: '65%'
				});
				label.addEventListener('click', function(e) {
					labelClick(e, persons[e.source.id]);
				});
				//REMOVE BUTTON
				removeBtn = Ti.UI.createButton({
					title: L('Remove'),
					left: '70%',
					width: '30%',
					id: person.id,
					rowNumber: i
				});
				removeBtn.addEventListener('click',  function(e){
					Ti.Contacts.removePerson(Ti.Contacts.getPersonById(e.source.id));
					Ti.App.rowsCount--;
					tableView.deleteRow(e.source.rowNumber);
					console.log('Rows count after remove=' + Ti.App.rowsCount);
					alert('Contact has been removed');
				});
				tableRow.add(label);
				tableRow.add(removeBtn);
				tableData.push(tableRow);
			}
			console.log('loop finished');
			Ti.App.rowsCount = tableData.length;
			tableView = Ti.UI.createTableView({
				backgroundColor: 'white',
				data: tableData,
				top: 80,
				left: 0,
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

module.exports = ApplicationWindow;
