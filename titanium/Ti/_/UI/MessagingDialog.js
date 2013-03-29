define(['Ti/_/declare', 'Ti/_/Evented'], function (declare, Evented) {

		return declare('Ti._.UI.MessagingDialog', Evented, {

			open: function () {
				var self = this, 
					appControl = new tizen.ApplicationControl('http://tizen.org/appcontrol/operation/compose', null, null, null, createAllParameters()),
					serviceCB = {
						onsuccess: function () {
							self.fireEvent('complete', {
								result: self.SENT,
								success: true
							});
						},
						onfailure: function () {
							self.fireEvent('complete', {
								result: self.CANCELLED,
								success: false
							});
						}
					};

				function createParameter(name, valueArray) {
					require.is(valueArray, 'Array') || (valueArray = [valueArray]);
					return new tizen.ApplicationControlData(name, valueArray);
				};

				// Take the user-supplied parameters ('messageBody', 'toRecipients', etc) and convert them to the form
				// required by Tizen's email application (i.e. array of tizen.ApplicationControlData).
				// ApplicationControl requires an array, even if there is only one parameter.
				function createAllParameters() {
					var params = [],
						i;

					for (i in self._fields) {
						self[i] && params.push(createParameter(self._fields[i], self[i]));
					}
					return params;
				};

				//Launching the native Tizen's message aplication
				tizen.application.launchAppControl(appControl, self._id, function () {
						Ti.API.info('Launch appControl succeeded')
					}, function (e) {
						Ti.API.info('Launch appControl failed. Reason: ' + e.name)
					}, serviceCB);
			},

			addAttachment: function (blob) {
				require.is(this.attachment, 'Array') || (this.attachment = []);

				if (blob.nativePath) {
					this.attachment.push(blob.nativePath);
				} else {
					Ti.API.info('Tizen currently only supports attaching a blob with the path to physical file presents on the Tizen device.');
				}
			},

			isSupported: function () {
				return true;
			},

			constants: {
				CANCELLED: 0,
				FAILED: 3,
				SAVED: 1,
				SENT: 2
			},

			properties: {
				messageBody: void 0,
				toRecipients: void 0
			}
		});

	});