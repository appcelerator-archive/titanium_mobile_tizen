define(['Ti/_/declare', 'Ti/_/UI/MessagingDialog'], function (declare, MessagingDialog) {
		return declare('Ti.UI.EmailDialog', MessagingDialog, {
			// The id of Tizen application service that will provide the email dialog
			// TODO: according to documentation here should be alias 'tizen.messages'
			// https://developer.tizen.org/help/index.jsp?topic=%2Forg.tizen.native.appprogramming%2Fhtml%2Fguide%2Fapp%2Fappcontrol_message.htm
			// but it does not work on available devices and emulator. Check it once more next Tizen version release
			_id: 'org.tizen.email',
			// A mapping between the name of the property and the corresponding parameter name for
			// Tizen's common dialog.
			_fields:  {
				toRecipients: 'to',
				ccRecipients: 'cc',
				bccRecipients: 'bcc',
				subject: 'subject',
				messageBody: 'text',
				attachment: 'attachments'
			},

			properties: {
				bccRecipients: void 0,
				ccRecipients: void 0,
				subject: void 0,
				attachment: void 0
			}
		});
	});
