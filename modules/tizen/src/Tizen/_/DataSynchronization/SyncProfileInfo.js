define(['Ti/_/declare', 'Tizen/_/DataSynchronization/SyncInfo', 'Tizen/_/DataSynchronization/SyncServiceInfo'],
function(declare, SyncInfo, SyncServiceInfo) {
	var obj = declare(null, {

		constructor: function(args, nativeObj) {
			if(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			} else {
				// Check if the required parameters are present (do not check for the optional ones).
				if(args.serviceInfo.length > 0) {
					var serviceInfoArr = [];
					for(var i=0; i<args.serviceInfo.length; ++i) {
						serviceInfoArr.push(args.serviceInfo[i]._obj);
					}
					this._obj = new tizen.SyncProfileInfo(args.profileName, args.syncInfo._obj, serviceInfoArr);
				} else {
					this._obj = new tizen.SyncProfileInfo(args.profileName, args.syncInfo._obj);
				}
			}
		},

		constants: {
			profileId: {
				get: function() {
					return this._obj.profileId;
				}
			},
		},

		properties: {
			profileName: {
				get: function() {
					return this._obj.profileName;
				},
				set: function(value) {
					this._obj.profileName = value;
				}
			},
			syncInfo: {
				get: function() {
					return new SyncInfo(void 0, this._obj.syncInfo);
				},
				set: function(value) {
					this._obj.syncInfo = value._obj;
				}
			},
			serviceInfo: {
				get: function() {
					if(!this._obj || !this._obj.serviceInfo)
						return this._obj.serviceInfo;
						
					var objects = this._obj.serviceInfo,
						i = 0,
						objectsCount = objects.length,
						result = [];
					for(; i < objectsCount; i++) {
						result.push(new SyncServiceInfo(void 0, objects[i]));
					}
					return result;
				},
				set: function(value) {
					var objects = value,
						i = 0,
						objectsCount = objects.length;
					this._obj.serviceInfo = [];
					for(; i < objectsCount; i++) {
						this._obj.serviceInfo.push(objects[i]._obj);
					}					
				}
			},
		},

	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataSynchronization.SyncProfileInfo';
	return obj;
});
