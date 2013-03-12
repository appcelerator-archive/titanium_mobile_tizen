define(["Ti/_", "Ti/_/declare", "Ti/_/Evented", "Ti/_/lang"],
	function(_, declare, Evented, lang) {

	return declare("Ti.UI.EmailDialog", Evented, {

		open: function() {
			var self = this,
				fields = {//Dictionary between two API's
					toRecipients: 'to',
					ccRecipients: 'cc',
					bccRecipients: 'bcc',
					subject: 'subject',
					messageBody: "text",
					attachment: "attachments"
				},
				appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/compose',null,null,null,getAllParameters());

			//Create a parameter for one of field
			function setParameter(name, valueArray){

				require.is(valueArray, "Array") || (valueArray = [valueArray]);

				if(valueArray.length > 0) {
					return new tizen.ApplicationControlData(name, valueArray);
				}
			};

			//create all parameters what was filled
			function getAllParameters(){
				var params = [];
				for(i in fields) {
					params.push(setParameter(fields[i], self[i]));
				}
				return params;
			};

			//Launching the native Tizen's message aplication
			tizen.application.launchAppControl(
				appControl,
				null,
				function() {Ti.API.info('Launch appControl succeeded')},
				function(e) {Ti.API.info('Launch appControl failed. Reason: ' + e.name)}
			);
		},

		addAttachment: function(blob){

			require.is(this.attachment, "Array") || (this.attachment = []);

			if(blob.nativePath) {
				this.attachment.push(blob.nativePath);
			} else {
				Ti.API.info('Tizen currently only supports attaching a blob with the path to physical file present on the Tizen device.')
			}
		},
		
		isSupported: function() {
			return true;
		},

		setHtml: function() {
			Ti.API.info('Tizen does not support the content of email as HTML');
		},

		constants: {
			CANCELLED: 0,
			FAILED: 3,
			SAVED: 1,
			SENT: 2,
			html: false
		},

		properties: {
		    bccRecipients: void 0,
		    ccRecipients: void 0,
		    messageBody: void 0,
		    subject: void 0,
		    toRecipients: void 0,
			attachment: void 0
		}

	});

});
