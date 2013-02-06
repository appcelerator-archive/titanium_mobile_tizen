/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

module.exports = new function() {
	var finish,
		valueOf,
		FOOTER_TITLE = "Footer Title",
		HEADER_TITLE = 'Header 1';

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
	}

	this.name = "tableViewSection";
	this.tests = [
		{name: "base"},
		{name: "getProp"},
		{name: "setProp"},
		{name: "rowCount"},
		{name: "rows"},
		{name: "addRemove"}
	];

	this.createSection = function(testRun) {
		// Create window
		var window = Ti.UI.createWindow();
		window.open();
		
		// Create the first TableViewSection
		var section1 = Ti.UI.createTableViewSection({
			headerTitle:HEADER_TITLE
		}),
		// Create the second TableViewSection
		section2 = Ti.UI.createTableViewSection({
			headerTitle: 'Section 2'
		}),
		// Create table view with secitons
		tv = Ti.UI.createTableView({
			sections:[section1,section2]
		});

		// Add table view to the window
		window.add(tv);	

		// Check existing sections in the tableView
		valueOf(testRun, tv.sectionCount).shouldBe(2);
		valueOf(testRun, tv.sections[0]).shouldBe(section1);
		valueOf(testRun, tv.sections[1]).shouldBe(section2);

		// Close window
		window.close();

		finish(testRun);
	}
	
	this.getProp = function(testRun) {
		// Create window
		var window = Ti.UI.createWindow();
		window.open();
		
		// Create HeaderView and Footer View
		headerViewExam=Ti.UI.createView();
		footerViewExam=Ti.UI.createView();
		
		// Create section with filled data
		var section1 = Ti.UI.createTableViewSection({
			headerTitle:HEADER_TITLE,
			footerTitle:FOOTER_TITLE,
			headerView:headerViewExam,
			footerView:footerViewExam
		}),
		// Create an empty section
		section2 = Ti.UI.createTableViewSection();		
		
		// Create tableView with filled and empty section 
		var tv = Ti.UI.createTableView({
			sections:[section1,section2]
		});
			
		// Add table view to the window
		window.add(tv);
		
		// POSITIVE scenario check existing correct values from filled section
		valueOf(testRun,tv.sections[0].footerTitle===FOOTER_TITLE).shouldBeTrue();
		valueOf(testRun,tv.sections[0].getFooterTitle()===FOOTER_TITLE).shouldBeTrue();	
		valueOf(testRun,tv.sections[0].headerTitle===HEADER_TITLE).shouldBeTrue();
		valueOf(testRun,tv.sections[0].getHeaderTitle()===HEADER_TITLE).shouldBeTrue();	
		valueOf(testRun,tv.sections[0].headerView===headerViewExam).shouldBeTrue();
		valueOf(testRun,tv.sections[0].getHeaderView()===headerViewExam).shouldBeTrue();	
		valueOf(testRun,tv.sections[0].footerView===footerViewExam).shouldBeTrue();
		valueOf(testRun,tv.sections[0].getFooterView()===footerViewExam).shouldBeTrue();				

		//NEGATIVE scenario check NOT existing values from empty section
		valueOf(testRun,tv.sections[1].footerTitle).shouldBeUndefined();
		valueOf(testRun,tv.sections[1].getFooterTitle()).shouldBeUndefined();	
		valueOf(testRun,tv.sections[1].headerTitle).shouldBeUndefined();
		valueOf(testRun,tv.sections[1].getHeaderTitle()).shouldBeUndefined();	
		valueOf(testRun,tv.sections[1].headerView).shouldBeUndefined();
		valueOf(testRun,tv.sections[1].getHeaderView()).shouldBeUndefined();	
		valueOf(testRun,tv.sections[1].footerView).shouldBeUndefined();
		valueOf(testRun,tv.sections[1].getFooterView()).shouldBeUndefined();	
			
		//Close window
		window.close();

		finish(testRun);
	}

	this.setProp = function(testRun) {
		// Create window
		var window = Ti.UI.createWindow();
		window.open();

		//Create HeaderView and Footer View
		headerViewExam=Ti.UI.createView({left:100});
		footerViewExam=Ti.UI.createView({left:200});

		//Create section filled data
		var section1 = Ti.UI.createTableViewSection({
				headerTitle:HEADER_TITLE,
				footerTitle:FOOTER_TITLE,
				headerView:headerViewExam,
				footerView:footerViewExam
			}),
			// Create tableView 
			tv = Ti.UI.createTableView({
				sections:[section1]
			});		
			
		// Create New HeaderView and New FooterView
		headerViewExam2=Ti.UI.createView({left:110});
		footerViewExam2=Ti.UI.createView({left:210});	
		
		// Set New HeaderView and New FooterView to the section
		tv.sections[0].setHeaderView(headerViewExam2);
		tv.sections[0].setFooterView(footerViewExam2);	
		
		var newFooterTitle = "New Footer Title",
			newHeaderTitle = "New Header Title";

		//Set New HeaderTitle and New FooterTitle to the section		
		tv.sections[0].setHeaderTitle(newHeaderTitle);
		tv.sections[0].setFooterTitle(newFooterTitle );
		
		// Add table view to the window
		window.add(tv);		

		// Check setHeaderTitle function
		valueOf(testRun,tv.sections[0].headerTitle).shouldBe(newHeaderTitle);
		valueOf(testRun,tv.sections[0].getHeaderTitle()===newHeaderTitle).shouldBeTrue();

		// Check setFooterTitle function
		valueOf(testRun,tv.sections[0].footerTitle).shouldBe(newFooterTitle);
		valueOf(testRun,tv.sections[0].getFooterTitle()).shouldBe(newFooterTitle);
		
		// Check setHeaderView function
		valueOf(testRun,tv.sections[0].headerView===headerViewExam).shouldBeFalse();
		valueOf(testRun,tv.sections[0].getHeaderView()===headerViewExam).shouldBeFalse();
		valueOf(testRun,tv.sections[0].headerView===headerViewExam2).shouldBeTrue();
		valueOf(testRun,tv.sections[0].getHeaderView()===headerViewExam2).shouldBeTrue();
			
		// Check setFooterView function
		valueOf(testRun,tv.sections[0].footerView===footerViewExam).shouldBeFalse();
		valueOf(testRun,tv.sections[0].getFooterView()===footerViewExam).shouldBeFalse();
		valueOf(testRun,tv.sections[0].footerView===footerViewExam2).shouldBeTrue();
		valueOf(testRun,tv.sections[0].getFooterView()===footerViewExam2).shouldBeTrue();
		
		// Close window
		window.close();

		finish(testRun);
	}	

	this.rowCount = function(testRun) {
		// Create window
		var window = Ti.UI.createWindow();
		window.open();	

		// Create the first TableViewSection
		var section1 = Ti.UI.createTableViewSection({
				headerTitle:HEADER_TITLE
			}),
			section1Count = 5;

		// Add some rows to the first TableViewSection
		for (var i = 0; i < section1Count; i++) {
			section1.add(Ti.UI.createTableViewRow({
				title:'Row '+i
			}));
		};

		// Create the second TableViewSection
		var section2 = Ti.UI.createTableViewSection({
				headerTitle: 'Section 2'
			}),
			section2Count = 4;

		// Add some rows to the second TableViewSection
		for (var i = 0; i < section2Count; i++) {
			section2.add(Ti.UI.createTableViewRow({
				title:'Row '+i
			}));
		}

		// Create tableView with sections
		var tv = Ti.UI.createTableView({
			sections:[section1,section2]
		});

		// Add table view to the window		
		window.add(tv);	

		// Check rowCount for first section
		valueOf(testRun,tv.sections[0].getRowCount()).shouldBe(section1Count);	
		valueOf(testRun,tv.sections[0].rowCount).shouldBe(section1Count);
		valueOf(testRun,tv.sections[0].rowCount).shouldBe(section1Count);

		// Check rowCount for second section
		valueOf(testRun,tv.sections[1].getRowCount()).shouldBe(section2Count);	
		valueOf(testRun,tv.sections[1].rowCount).shouldBe(section2Count);	

		tv.sections[0].add(Ti.UI.createTableViewRow({title:'new Row'}));

		// Close window
		window.close();		
		finish(testRun);		
	}

	//Test access to the row from the section
	this.rows = function(testRun) {			
		// Create window
		var window = Ti.UI.createWindow();
		window.open();	

		// Create first TableViewSection
		var section1 = Ti.UI.createTableViewSection({
				headerTitle:HEADER_TITLE
			}),
			section1Count = 5;

		// Add some rows to the first TableViewSection
		for (var i = 0; i < section1Count; i++) {
			section1.add(Ti.UI.createTableViewRow({
				title:'Row ' + i
			}));
		}

		// Create the second TableViewSection
		var section2 = Ti.UI.createTableViewSection({
				headerTitle: 'Section 2'
			}),
			section2Count = 4;

		// Add some rows to the second TableViewSection
		for (var i = 0; i < section2Count; i++) {
			section2.add(Ti.UI.createTableViewRow({
				title:'Row ' + i
			}));
		}

		// Create tableView with sections
		var tv = Ti.UI.createTableView({
			sections:[section1,section2]
		});	

		// Add table view to the window
		window.add(tv);	

		// Check rows properties and getRows function
		setTimeout(function(){
			valueOf(testRun,tv.sections[0].rows).shouldNotBeUndefined();
			valueOf(testRun,tv.sections[0].rows.length).shouldBe(section1Count);
			valueOf(testRun,tv.sections[0].getRows()).shouldBeArray();
			valueOf(testRun,tv.sections[0].getRows().length).shouldBe(section1Count);
			valueOf(testRun,tv.sections[1].rows).shouldNotBeUndefined();
			valueOf(testRun,tv.sections[1].rows.length).shouldBe(section2Count);
			valueOf(testRun,tv.sections[1].getRows()).shouldBeArray();
			valueOf(testRun,tv.sections[1].getRows().length).shouldBe(section2Count);
			finish(testRun);
		} , 1000);

		//Close window
		window.close();	
	}	
	
	// Test adding and removing row from the section
	this.addRemove = function(testRun) {
		// Create window
		var window = Ti.UI.createWindow();
		window.open();	
		
		// Create first TableViewSection
		var section1 = Ti.UI.createTableViewSection({
			headerTitle:HEADER_TITLE
		});		

		// Create and added the TableViewRow to the section
		row = Ti.UI.createTableViewRow({title:'Row sample'});
		section1.add(row);

		// Create second TableViewSection
		var section2 = Ti.UI.createTableViewSection({
				headerTitle: 'Section 2'
			}),
			section2Count = 4,
			lastRow;

		// Add some rows to the first TableViewSection
		for (var i = 0; i < section2Count; i++) {
			lastRow = Ti.UI.createTableViewRow({title:'Row '+i});
			section2.add(lastRow);
		}

		// Create tableView with sections
		var tv = Ti.UI.createTableView({
			sections:[section1,section2]
		});

		// Add table view to the window		
		window.add(tv);	
		
		// Check count of row second section
		valueOf(testRun,tv.sections[0].getRowCount()).shouldBe(1);	
		
		// Remove row from first section
		valueOf(testRun, function() {
			section1.remove(row);
		}).shouldNotThrowException();

		// Check count of row second section
		valueOf(testRun,tv.sections[0].getRowCount()).shouldBe(0);	
		
		// Check count of second row
		valueOf(testRun,tv.sections[1].getRowCount()).shouldBe(section2Count);	
		
		// Remove row from second section
		valueOf(testRun, function() {
			section2.remove(lastRow);
		}).shouldNotThrowException();
		
		// Check count of second row
		valueOf(testRun,tv.sections[1].getRowCount()).shouldBe(section2Count-1);	

		// Negative scenario try to delete not existing row
		row = Ti.UI.createTableViewRow({title:'This Row is fake'});
		valueOf(testRun, function() {
			section1.remove(fakeRow);
		}).shouldThrowException();		
		
		// Negative scenario try to delete not existing row
		valueOf(testRun, function() {
			section2.remove(fakeRow);
		}).shouldThrowException();			
		
		var existRemovedRow = false,
			i = 0,
			len = section1.getRows().length;
		
		for(; i < len; i++) {
			if (section1.getRows()[i] === row) {
				existRemovedRow = true;
			}
		}

		valueOf(testRun,existRemovedRow).shouldBeFalse();	
		existRemovedRow = false;
		
		for(var i = 0, len = section2.getRows().length; i < len; i++ ){
			if (section1.getRows()[i] === lastRow) {
				existRemovedRow = true;
			}
		}

		valueOf(testRun,existRemovedRow).shouldBeFalse();			
		
		window.close();		
		finish(testRun);
	}
}