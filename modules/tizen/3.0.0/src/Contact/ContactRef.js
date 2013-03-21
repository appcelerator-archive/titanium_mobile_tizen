define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var contactRef = declare(Evented, {
		constructor: function(args) {
			if(args.toString() === '[object ContactRef]') {
				this._obj = args;
			} else {
				this._obj = new tizen.ContactRef(args.addressBookId, args.contactId);
			}
		},

		properties: {
			addressBookId: {
				get: function() {
					return this._obj.addressBookId;
				},
				set: function(value) {
					this._obj.addressBookId = value;
				}
			},
			contactId: {
				get: function() {
					return this._obj.contactId;
				},
				set: function(value) {
					this._obj.contactId = value;
				}
			}
		}
	});

	contactRef.prototype.declaredClass = 'Tizen.Contact.ContactRef';

	return contactRef;
});