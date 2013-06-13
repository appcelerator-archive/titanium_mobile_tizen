// Wraps Tizen interface "ContactRef" that resides in Tizen module "Contact".
// Needed to pass references to contacts - as opposed to complete contact objects -
// to other Tizen functions.

define(['Ti/_/declare', 'Ti/_/Evented'], function(declare, Evented) {

	var contactRef = declare(Evented, {

		constructor: function(args, nativeObj) {
			if (nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				if('addressBookId' in args && 'contactId' in args) {
					// args is a dictionary that the user of the wrapper module passed to the creator function.
					this._obj = new tizen.ContactRef(args.addressBookId, args.contactId);
				} else {
					throw new Error('Constructor with given parameters doesn\'t exist');
				}
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

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	contactRef.prototype.declaredClass = 'Tizen.Contact.ContactRef';
	return contactRef;
});
