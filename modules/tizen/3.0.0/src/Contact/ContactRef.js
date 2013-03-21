define(['Ti/_/declare'], function(declare) {
	return declare('Ti.Tizen.Contact.ContactRef', null, {
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
});