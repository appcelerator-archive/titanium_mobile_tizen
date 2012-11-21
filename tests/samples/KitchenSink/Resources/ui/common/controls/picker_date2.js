function picker_date2() {
	var win = Ti.UI.createWindow();
	win.backgroundColor = 'black';
	
	var value = new Date();
	value.setMinutes(10);
	value.setHours(13);
	value.setSeconds(48);
			
	var picker = Ti.UI.createPicker({
		type:Ti.UI.PICKER_TYPE_TIME,
		value:value
	});
	
	if (Ti.Platform.osname === 'mobileweb' || Ti.Platform.osname === 'tizen') {
		picker = Ti.UI.createPicker({
			type:Ti.UI.PICKER_TYPE_TIME,
			value:value,
			width: '150',
			height: '42'
		});
	}
	
	
	// turn on the selection indicator (off by default)
	picker.selectionIndicator = true;
	
	win.add(picker);
	
	var label = Ti.UI.createLabel({
		text:'Choose a time',
		top:6,
		width:'auto',
		height:'auto',
		textAlign:'center',
		color:'white'
	});
	win.add(label);
	
	picker.addEventListener('change',function(e)
	{
		label.text = e.value.toLocaleString();
	});

	return win;
}

module.exports = picker_date2;