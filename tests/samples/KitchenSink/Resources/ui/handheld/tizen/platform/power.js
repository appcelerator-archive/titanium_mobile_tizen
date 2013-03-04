function tizen_power() {
	var win = Titanium.UI.createWindow(),
		buttonTurnOffScreen = Ti.UI.createButton({
			title: 'Turn Off Screen',
			top: 10
		});

	buttonTurnOffScreen.addEventListener('click', function(){
		Ti.Tizen.Power.turnScreenOff();
	});

	win.add(buttonTurnOffScreen);
	return win;
}

module.exports = tizen_power;