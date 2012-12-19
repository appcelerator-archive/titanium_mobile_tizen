function blobImageView() {
	var win = Titanium.UI.createWindow();
	
	var imageView = Titanium.UI.createImageView({
		height:200,
		top:20,
		width: 300,
		backgroundColor:'#999'
	});
	
	win.add(imageView);
	
	var blobCB = function(blob){
		imageView.image = blob;
	} 
	
	var btn  = Titanium.UI.createButton({
		title: 'Show this button as image',
		bottom:20
	});
	win.add(btn);
	btn.addEventListener('click', function(){
		this.toImage(blobCB);
	})
	
	return win;
};

module.exports = blobImageView;
