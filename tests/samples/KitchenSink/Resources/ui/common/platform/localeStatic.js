/**
 * locale basic sample for functions that use only current locale.
 */

function locale(_args) {
	var win = Ti.UI.createWindow({backgroundColor:'black'}),
		d = new Date(),
		defaultLabelSettings = {
			width:'auto',
			height:'auto',
			textAlign:'center',
			color:'white'};


	var textFieldWinNumber = Titanium.UI.createTextField({
		value:"7654321.89",
		top:30,
		backgroundColor: 'white',
		color:'black',
		height:'auto',
		width:'200px',
		borderStyle:Ti.UI.INPUT_BORDERSTYLE_LINE
	});

	var labelInput = Ti.UI.createLabel(defaultLabelSettings),
		labelCurrency = Ti.UI.createLabel(defaultLabelSettings),
		labelDateShort = Ti.UI.createLabel(defaultLabelSettings),
		labelDateMedium = Ti.UI.createLabel(defaultLabelSettings),
		labelDateLong = Ti.UI.createLabel(defaultLabelSettings),
		labelTimeShort = Ti.UI.createLabel(defaultLabelSettings),
		labelTimeMedium = Ti.UI.createLabel(defaultLabelSettings),
		labelTimeLong = Ti.UI.createLabel(defaultLabelSettings);

	labelInput.text = 'Enter number to format:';
	labelCurrency.text = 'as currency: ' + String.formatCurrency(textFieldWinNumber.value);
	labelDateShort.text = 'Short date: '+ String.formatDate(d, 'short');
	labelDateMedium.text = 'Medium date: '+ String.formatDate(d, 'medium');
	labelDateLong.text = 'Long date: '+ String.formatDate(d, 'long');
	labelTimeShort.text = 'Short time: '+ String.formatTime(d, 'short');
	labelTimeMedium.text = 'Medium time: '+ String.formatTime(d, 'medium');
	labelTimeLong.text = 'Long time: '+ String.formatTime(d, 'long');

	labelInput.top = 5;
	labelCurrency.top = 55;
	labelDateShort.top = 100;
	labelDateMedium.top = 125;
	labelDateLong.top = 150;
	labelTimeShort.top = 175;
	labelTimeMedium.top = 200;
	labelTimeLong.top = 225;

	win.add(labelInput);
	win.add(labelCurrency);
	win.add(textFieldWinNumber);
	win.add(labelDateShort);
	win.add(labelDateMedium);
	win.add(labelDateLong);
	win.add(labelTimeShort);
	win.add(labelTimeMedium);
	win.add(labelTimeLong);

	textFieldWinNumber.addEventListener('change',function(e)
	{
		labelCurrency.text = 'as currency: ' + String.formatCurrency(e.value);
	});

	return win;
};

module.exports = locale;
