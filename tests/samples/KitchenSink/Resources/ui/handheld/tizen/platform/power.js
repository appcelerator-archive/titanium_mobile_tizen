function tizen_power() {
	var win = Titanium.UI.createWindow(),
		buttonTurnOffScreen = Ti.UI.createButton({
			title: 'Turn Off Screen',
			top: 10
		}),
		powerObj = require('Ti/Tizen/Power');

	buttonTurnOffScreen.addEventListener('click', function(){
		powerObj.turnScreenOff();
	});

	win.add(buttonTurnOffScreen);
	return win;
}

module.exports = tizen_power;