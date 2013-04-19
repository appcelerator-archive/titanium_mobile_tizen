// Wraps Tizen interface "NFCAdapter" that resides in Tizen module "NFC".

define(['Ti/_/declare', 'Ti/_/Evented', 'Tizen/_/NFC/NFCTag', 'Tizen/_/NFC/NFCPeer'], function(declare, Evented, NFCTag, NFCPeer) {

	var listening,
		adapter = declare(Evented, {

			constructor: function(args) {
				if (args.toString() === '[object NFCAdapter]') {
					// args is a native Tizen object; simply wrap it (take ownership of it)
					this._obj = args;
				}
			},

			setPowered: function(state, callback) {
				return this._obj.setPowered(state, callback && function() {
					callback({
						success: true,
						code: 0
					});
				}, callback && function(e) {
					callback({
						success: false,
						error: e.type + ': ' + e.message,
						code: e.code
					});
				});
			},

			addEventListener: function () {
				var self = this;

				Evented.addEventListener.apply(this, arguments);

				if (! listening) {
					listening = true;

					// Add Tag event listeners.
					this._obj.setTagListener({
						onattach: function (nfcTag) {
							self.fireEvent('tagattached', {
								nfcTag: new NFCTag(nfcTag)
							});
						},
						ondetach: function () {
							self.fireEvent('tagdetached');
						}
					});

					// Add Peer event listeners.
					this._obj.setPeerListener({
						onattach: function (nfcPeer) {
							self.fireEvent('peerattached', {
								nfcPeer: new NFCPeer(nfcPeer)
							});
						},
						ondetach: function () {
							self.FireEvent('peerdetached');
						}
					});
				}
			},

			getCachedMessage: function() {
				return this._obj.getCachedMessage();
			},

			constants: {
				powered: {
					get: function() {
						return this._obj.powered;
					}
				}
			}

		});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	adapter.prototype.declaredClass = 'Tizen.NFC.NFCAdapter';
	return adapter;
});
