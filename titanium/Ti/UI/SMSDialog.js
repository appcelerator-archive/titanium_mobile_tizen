define(['Ti/_/declare', 'Ti/_/UI/MessagingDialog', 'Ti/API'], function (declare, MessagingDialog, API) {
	return declare('Ti.UI.SMSDialog', MessagingDialog, {

		constructor: function () {
			this.type = 'SMS';
		},

		addAttachment: function () {
			API.error('SMS cannot contain attachments');
		},

		constants: {
			// The id of Tizen application service that will provide the email dialog
			_id: 'org.tizen.message',

			// A mapping between the name of the property and the corresponding parameter name for
			// Tizen's common dialog.
			_fields: {
				toRecipients: 'to',
				messageBody: 'text',
				type: 'type'
			}
		},

		properties: {
			type: void 0
		}
	});
});
