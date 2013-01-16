function tizen() {
	var win = Titanium.UI.createWindow();
	
	// initialize to all modes
	win.orientationModes = [
		Titanium.UI.PORTRAIT,
		Titanium.UI.LANDSCAPE_LEFT,
		Titanium.UI.LANDSCAPE_RIGHT
	]; 
	
	return win;
};

module.exports = tizen;
