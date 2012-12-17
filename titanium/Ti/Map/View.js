define(["Ti/_/declare", "Ti/_/Evented", "Ti/_/Map/Google", "Ti/App/Properties"], function(declare, Evented, Google, Properties) {

	var backend = Properties.getString("ti.map.backend");

	return declare("Ti.Map.View", [Evented, backend ? require(backend) : Google], {
		constructor: function(args){
			//The native google map's zoom buttons does not work and aplication fall on Tizen
			this.zoomControl = false;
			this.addEventListener('complete', function(){
				var self = this;
				// button to zoom-in
				var zoomin = Titanium.UI.createButton({
					title:'+',
					bottom: 80,
					left: 15,
					width: 30
				});
				// button to zoom-out
				var zoomout = Titanium.UI.createButton({
					title:'-',
					bottom: 40,
					left: 15,
					width: 30
				});
				
				zoomin.addEventListener('click',function() {
					self.zoom(1);
				});
				
				zoomout.addEventListener('click',function() {
					self.zoom(-1);
				});
				this.add(zoomin);
				this.add(zoomout);
			});	
		}
	});

});
