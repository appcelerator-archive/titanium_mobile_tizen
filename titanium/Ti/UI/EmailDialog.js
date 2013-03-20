define(["Ti/_/declare", "Ti/_/UI/MessagingDialog"], function (declare, MessagingDialog) {
		return declare("Ti.UI.EmailDialog", MessagingDialog, {
			constants: {
				// The id of Tizen application service that will provide the email dialog
				_id: 'vxqbrefica.Email',

				// A mapping between the name of the property and the corresponding parameter name for
				// Tizen's common dialog.
				_fields: {
					toRecipients: 'to',
					ccRecipients: 'cc',
					bccRecipients: 'bcc',
					subject: 'subject',
					messageBody: "text",
					attachment: "attachments"
				}
			},

			properties: {
				bccRecipients: void 0,
				ccRecipients: void 0,
				subject: void 0,
				attachment: void 0
			}
		});
	});
