/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2013 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */


module.exports = new function() {
	var finish;
	var valueOf;
	var reportError;
	var guiReadyEventName;

	this.init = function(testUtils) {
		finish = testUtils.finish;
		valueOf = testUtils.valueOf;
		reportError = testUtils.reportError;
		// for Tizen and mobileWeb all valued based on rendering results are avalible only on "postlayout" event.
		guiReadyEventName = (Ti.Platform.osname === 'tizen')||(Ti.Platform.osname === 'mobileweb') ? "postlayout" : "open";
	}

	this.name = "ui_TextArea";
	this.tests = [
		{name: "testBasicProperties"},
		{name: "testBasicPropertiesMore"},
		{name: "testValue"},
		{name: "testEventsBlur"},
		//{name: "testEventsChange"},
		{name: "testGettersSetters"}
	]

	this.testBasicProperties = function(testRun) {
		//create windows instance
		var win = Ti.UI.createWindow({
			backgroundColor: '#FFFFFF',
			exitOnClose: true,
			layout: 'vertical',
			title: 'Anvil UI TextArea test'
		});

		//create test object instance
		var tempTextArea= Ti.UI.createTextArea({
			value:'Textarea from Anvil',
			height:100,
			width:200,
			top:20,
			left:10,
			textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
			color:'#000000',
			textAlign:'left',
			borderWidth:5,
			borderColor:'#787878',
			autocorrect:true,
			editable:true,
			enableReturnKey:true,
			suppressReturn:false,
			enabled:true
		});

		win.add(tempTextArea);

		win.addEventListener(guiReadyEventName, function(){
			//Ti.API.debug
			Ti.API.info('Checking "color" property. Current value: ' + tempTextArea.color);
			valueOf(testRun, tempTextArea.color).shouldBe('#000000');

			Ti.API.info('Checking "borderColor" property. Current value: ' + tempTextArea.borderColor);
			valueOf(testRun, tempTextArea.borderColor).shouldBe('#787878');

			Ti.API.info('Checking "borderWidth" property. Current value: ' + tempTextArea.borderWidth);
			valueOf(testRun, tempTextArea.borderWidth).shouldBe(5);

			Ti.API.info('Checking "textAlign" property. Current value: ' + tempTextArea.textAlign);
			valueOf(testRun, tempTextArea.textAlign).shouldBe('left');

			Ti.API.info('Checking "autocorrect" property. Current value: ' + tempTextArea.autocorrect);
			valueOf(testRun, tempTextArea.autocorrect).shouldBe(true);

			Ti.API.info('Checking "editable" property. Current value: ' + tempTextArea.editable);
			valueOf(testRun, tempTextArea.editable).shouldBe(true);

			Ti.API.info('Checking "suppressReturn" property. Current value: ' + tempTextArea.suppressReturn);
			valueOf(testRun, tempTextArea.suppressReturn).shouldBe(false);

			Ti.API.info('Checking "enableReturnKey" property. Current value: ' + tempTextArea.enableReturnKey);
			valueOf(testRun, tempTextArea.enableReturnKey).shouldBe(true);

			Ti.API.info('Checking "enabled" property. Current value: ' + tempTextArea.enabled);
			valueOf(testRun, tempTextArea.enabled).shouldBe(true);

			Ti.API.info('Checking "top" property. Current value: ' + tempTextArea.top);
			valueOf(testRun, tempTextArea.top).shouldBe(20);

			Ti.API.info('Checking "left" property. Current value: ' + tempTextArea.left);
			valueOf(testRun, tempTextArea.left).shouldBe(10);

			Ti.API.info('Checking "width" property. Current value: ' + tempTextArea.width);
			valueOf(testRun, tempTextArea.width).shouldBe(200);

			Ti.API.info('Checking "height" property. Current value: ' + tempTextArea.height);
			valueOf(testRun, tempTextArea.height).shouldBe(100);

			Ti.API.info('Checking "value" property. Current value: ' + tempTextArea.value);
			valueOf(testRun, tempTextArea.value).shouldBe('Textarea from Anvil');

			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 100)
		})

		win.open();

	}

	this.testBasicPropertiesMore = function(testRun) {
		//create windows instance
		var win = Ti.UI.createWindow({
			backgroundColor: '#FFFFFF',
			exitOnClose: true,
			layout: 'vertical',
			title: 'Anvil UI TextArea test 2'
		});

		//create test object instance
		var tempTextArea= Ti.UI.createTextArea({
			value:'Textarea from Anvil',
			font:{fontFamily:'Areal', fontWeight:'bold'},
			autocorrect:false,
			editable:false,
			enableReturnKey:false,
			suppressReturn:true,
			enabled:false
		});

		win.add(tempTextArea);

		win.addEventListener(guiReadyEventName, function(){
			//Ti.API.debug
			Ti.API.info('Checking "editable" property. Current value: ' + tempTextArea.editable);
			valueOf(testRun, tempTextArea.editable).shouldBe(false);

			Ti.API.info('Checking "suppressReturn" property. Current value: ' + tempTextArea.suppressReturn);
			valueOf(testRun, tempTextArea.suppressReturn).shouldBe(true);

			Ti.API.info('Checking "enableReturnKey" property. Current value: ' + tempTextArea.enableReturnKey);
			valueOf(testRun, tempTextArea.enableReturnKey).shouldBe(false);

			Ti.API.info('Checking "enabled" property. Current value: ' + tempTextArea.enabled);
			valueOf(testRun, tempTextArea.enabled).shouldBe(false);

			Ti.API.info('Checking "autocorrect" property. Current value: ' + tempTextArea.autocorrect);
			valueOf(testRun, tempTextArea.autocorrect).shouldBe(false);

			Ti.API.info('Checking "font.fontWeight" property. Current value: ' + tempTextArea.font.fontWeight);
			valueOf(testRun, tempTextArea.font.fontWeight).shouldBe('bold');

			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 100)
		})

		win.open();

	}

	this.testValue = function(testRun) {
		//create windows instance
		var win = Ti.UI.createWindow({
			backgroundColor: '#FFFFFF',
			exitOnClose: true,
			layout: 'vertical',
			title: 'Anvil UI TextArea test'
		});

		//create test object instance
		var tempTextArea= Ti.UI.createTextArea({
			value:'value1'
		});

		win.add(tempTextArea);

		win.addEventListener(guiReadyEventName, function(){
			Ti.API.info('Checking "value" property. Pass #1. Current value: ' + tempTextArea.value);
			valueOf(testRun, tempTextArea.value).shouldBe('value1');

			Ti.API.info('Checking "hasText()" method. Pass #1. Current value: ' + tempTextArea.hasText());
			valueOf(testRun, tempTextArea.hasText()).shouldBe(true);

			tempTextArea.value = 'value2';
			Ti.API.info('Checking "value" property. Pass #2. Current value: ' + tempTextArea.value);
			valueOf(testRun, tempTextArea.value).shouldBe('value2');

			tempTextArea.value = '';
			Ti.API.info('Checking "value" property. Pass #3. Current value: ' + tempTextArea.value);
			valueOf(testRun, tempTextArea.value).shouldBe('');

			Ti.API.info('Checking "hasText()" method. Pass #3. Current value: ' + tempTextArea.hasText());
			valueOf(testRun, tempTextArea.hasText()).shouldBe(false);

			tempTextArea.setValue('value3');
			Ti.API.info('Checking "setValue()" and "getValue()" methods.');
			valueOf(testRun, tempTextArea.getValue()).shouldBe('value3');

			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 100)
		})

		win.open();
	}

	this.testEventsBlur = function(testRun) {
		//create windows instance
		var win = Ti.UI.createWindow({
			backgroundColor: '#FFFFFF',
			exitOnClose: true,
			layout: 'vertical',
			title: 'Anvil UI TextArea test'
		});

		//create test object instances
		var tempTextArea = Ti.UI.createTextArea({value:'ta1'}),
			tempTextArea2 = Ti.UI.createTextArea({value:'ta2'}),
			focusEventExpected = false,
			blurEventExpected = false,
			focusEventReceived = false,
			blurEventReceived = false;

		tempTextArea.addEventListener('focus',function(e){
			Ti.API.info("focus event received. e.value:"+ e.value);
			if (focusEventExpected)
			{
				valueOf(testRun, e.value).shouldBe('ta1');
				focusEventReceived = true;
			}
		})
		tempTextArea.addEventListener('blur',function(e){
			Ti.API.info("blur event received. e.value:"+ e.value);
			if (blurEventExpected) {
				valueOf(testRun, e.value).shouldBe('ta1');
				blurEventReceived = true;
			}
		})

		win.add(tempTextArea2);
		win.add(tempTextArea);

		win.addEventListener(guiReadyEventName, function(){
			tempTextArea2.focus(); // setting focus to another control
			focusEventExpected = true;
			tempTextArea.focus(); // checking focus.

			blurEventExpected = true;
			tempTextArea.blur();

			setTimeout(function(){
				valueOf(testRun, (blurEventReceived)).shouldBe(true);
				valueOf(testRun, (focusEventReceived)).shouldBe(true);
				win.close();
				finish(testRun);
			}, 100)
		})

		win.open();
	}

/*
	this.testEventsChange = function(testRun) {
		//create windows instance
		var win = Ti.UI.createWindow({
			backgroundColor: '#FFFFFF',
			exitOnClose: true,
			layout: 'vertical',
			title: 'Anvil UI TextArea test'
		});

		//create test object instances
		var tempTextArea = Ti.UI.createTextArea({value:'value#1'}),
			changeEventReceived = false;

		tempTextArea.addEventListener('change',function(e){
			Ti.API.info("change event received. e.value:"+ e.value);
			valueOf(testRun, e.value).shouldBe('v1');
			changeEventReceived = true;
		});

		win.add(tempTextArea);

		win.addEventListener(guiReadyEventName, function(){
			tempTextArea.setValue('v1');
			setTimeout(function(){
				valueOf(testRun, (changeEventReceived)).shouldBe(true);
				win.close();
				finish(testRun);
			}, 100)
		})

		win.open();
	}
	*/

	this.testGettersSetters = function(testRun) {
		//create windows instance
		var win = Ti.UI.createWindow({
			backgroundColor: '#FFFFFF',
			exitOnClose: true,
			layout: 'vertical',
			title: 'Anvil UI TextArea test'
		});
		//create test object instance
		var tempTextArea= Ti.UI.createTextArea({});
		win.add(tempTextArea);


		win.addEventListener(guiReadyEventName, function(){
			Ti.API.info('Checking setAutocorrect/getAutocorrect property.');
			tempTextArea.setAutocorrect(true);
			valueOf(testRun, tempTextArea.getAutocorrect()).shouldBe(true);
			tempTextArea.setAutocorrect(false);
			valueOf(testRun, tempTextArea.getAutocorrect()).shouldBe(false);

			Ti.API.info('Checking setColor/getColor property.');
			tempTextArea.setColor('#F1F1F1');
			valueOf(testRun, tempTextArea.getColor()).shouldBe('#F1F1F1');
			tempTextArea.setColor('#1F1F1F');
			valueOf(testRun, tempTextArea.getColor()).shouldBe('#1F1F1F');

			Ti.API.info('Checking setEditable/getEditable property.');
			tempTextArea.setEditable(false);
			valueOf(testRun, tempTextArea.getEditable()).shouldBe(false);
			tempTextArea.setEditable(true);
			valueOf(testRun, tempTextArea.getEditable()).shouldBe(true);

			Ti.API.info('Checking setEnabled/getEnabled property.');
			tempTextArea.setEnabled(false);
			valueOf(testRun, tempTextArea.getEnabled()).shouldBe(false);
			tempTextArea.setEnabled(true);
			valueOf(testRun, tempTextArea.getEnabled()).shouldBe(true);

			// Ti.API.info('Checking setFont/getFont property.'); ? Check it as font object in font tests

			Ti.API.info('Checking setSuppressReturn/getSuppressReturn property.');
			tempTextArea.setSuppressReturn(false);
			valueOf(testRun, tempTextArea.getSuppressReturn()).shouldBe(false);
			tempTextArea.setSuppressReturn(true);
			valueOf(testRun, tempTextArea.getSuppressReturn()).shouldBe(true);

			Ti.API.info('Checking setTextAlign/getTextAlign property.');
			tempTextArea.setTextAlign(Ti.UI.TEXT_ALIGNMENT_RIGHT);
			valueOf(testRun, tempTextArea.getTextAlign()).shouldBe(Ti.UI.TEXT_ALIGNMENT_RIGHT);
			tempTextArea.setTextAlign(Ti.UI.TEXT_ALIGNMENT_LEFT);
			valueOf(testRun, tempTextArea.getTextAlign()).shouldBe(Ti.UI.TEXT_ALIGNMENT_LEFT);

			Ti.API.info('Checking setEnableReturnKey/getEnableReturnKey property.');
			valueOf(testRun, tempTextArea.setEnableReturnKey).shouldBeFunction();
			valueOf(testRun, tempTextArea.getEnableReturnKey).shouldBeFunction();
			tempTextArea.setEnableReturnKey(false);
			valueOf(testRun, tempTextArea.getEnableReturnKey()).shouldBe(false);
			tempTextArea.setEnableReturnKey(true);
			valueOf(testRun, tempTextArea.getEnableReturnKey()).shouldBe(true);

			setTimeout(function(){
				win.close();
				finish(testRun);
			}, 100)
		})

		win.open();
	}

}
