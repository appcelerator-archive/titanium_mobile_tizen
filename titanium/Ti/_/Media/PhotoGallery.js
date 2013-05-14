define(['Ti/_/declare', 'Ti/_/Media/virtualRoot'],
	function(declare, virtualRoot) {
		//TODO: From the next release (Tizen 2.1.0), this additional data will not be needed.
		var additionalData = [new tizen.ApplicationControlData("selectionMode", ["single"])],
			service = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/pick', null, 'image/*', null, additionalData);

		return {
			open: function(args) {
				//launch default gallery application
				tizen.application.launchAppControl(service,
					null,
					function() {
						console.log('Launch service Photo Gallery succeeded');
					},
					args && args.error ? args.error : function(e) {
						console.error('Something wrong with launching service - Photo Gallery. '+ e.name);
					},
					{
						// callee now sends a reply
						onsuccess: function(data) {
							virtualRoot.pickToItemCB(data, args);
						},
						//Something went wrong
						onfailure:function() {
							console.error('Something went wrong');
						}
					}
				);
			}
		};
	});