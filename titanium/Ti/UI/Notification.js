define(
	["Ti/_/declare", "Ti/UI/View"], 
	function(declare, View) {		
		return declare("Ti.UI.Notification", View, {	
			constructor: function(args) {					
				this.height = 50;
				this.width = 150;
				this.bottom = 25;
				this.left = Titanium.Platform.displayCaps.platformWidth / 2 - this.width / 2;
				this.backgroundColor = "#535252";
				this.zIndex = 1000;
				
				var label = Titanium.UI.createLabel({
					text: args.message,
					width: 'auto',
					height: 'auto'
				});
				this.add(label);
			},
			
			show: function(win) {
				var notification = this;
				win.add(this);
				
				switch (this.duration) {
					case Titanium.UI.NOTIFICATION_DURATION_LONG: {
						countdown = 2;
						break;
					};
					
					case Titanium.UI.NOTIFICATION_DURATION_SHORT: {
						countdown = 1;
						break;
					};
					
					default: {
						countdown = 2;
					};
				}
				
				var countdownSeconds = setInterval(function() {
					if (--countdown < 0) {
						clearInterval(countdownSeconds);
						
						notification.hide(win);
					}
				}, 1000);
			},
			
			hide: function(win) {
				win.remove(this);
			}
		});
	}
);