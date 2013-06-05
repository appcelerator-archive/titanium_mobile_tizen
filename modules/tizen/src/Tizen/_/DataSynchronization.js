define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/DataSynchronization/SyncInfo', 'Tizen/_/DataSynchronization/SyncServiceInfo', 'Tizen/_/DataSynchronization/SyncProfileInfo',
'Tizen/_/DataSynchronization/SyncStatistics'], 
function(lang, Evented, SyncInfo, SyncServiceInfo, SyncProfileInfo, SyncStatistics) {
	return lang.mixProps(require.mix({}, Evented), {

		constants: {
			SYNC_MODE_MANUAL: 'MANUAL',
			SYNC_MODE_PERIODIC: 'PERIODIC',
			SYNC_MODE_PUSH: 'PUSH',
			SYNC_TYPE_TWO_WAY: 'TWO_WAY',
			SYNC_TYPE_SLOW: 'SLOW',
			SYNC_TYPE_ONE_WAY_FROM_CLIENT: 'ONE_WAY_FROM_CLIENT',
			SYNC_TYPE_REFRESH_FROM_CLIENT: 'REFRESH_FROM_CLIENT',
			SYNC_TYPE_ONE_WAY_FROM_SERVER: 'ONE_WAY_FROM_SERVER',
			SYNC_TYPE_REFRESH_FROM_SERVER: 'REFRESH_FROM_SERVER',
			SYNC_INTERVAL_5_MINUTES: '5_MINUTES',
			SYNC_INTERVAL_15_MINUTES: '15_MINUTES',
			SYNC_INTERVAL_1_HOUR: '1_HOUR',
			SYNC_INTERVAL_4_HOURS: '4_HOURS',
			SYNC_INTERVAL_12_HOURS: '12_HOURS',
			SYNC_INTERVAL_1_DAY: '1_DAY',
			SYNC_INTERVAL_1_WEEK: '1_WEEK',
			SYNC_INTERVAL_1_MONTH: '1_MONTH',
			SYNC_SERVICE_TYPE_CONTACT: 'CONTACT',
			SYNC_SERVICE_TYPE_EVENT: 'EVENT',
			SYNC_STATUS_SUCCESS: 'SUCCESS',
			SYNC_STATUS_FAIL: 'FAIL',
			SYNC_STATUS_STOP: 'STOP',
			SYNC_STATUS_NONE: 'NONE',
		},

		add: function(profile /*SyncProfileInfo*/) {
			tizen.datasync.add(profile._obj);
		},

		update: function(profile /*SyncProfileInfo*/) {
			tizen.datasync.update(profile._obj);
		},

		remove: function(profileId /*SyncProfileId*/) {
			tizen.datasync.remove(profileId);
		},

		getMaxProfilesNum: function() {
			return tizen.datasync.getMaxProfilesNum();
		},

		getProfilesNum: function() {
			return tizen.datasync.getProfilesNum();
		},

		getSyncProfileInfo: function(profileId /*SyncProfileId*/) {
			return new SyncProfileInfo(void 0, tizen.datasync.get(profileId));
		},

		getAll: function() {
			var objects = tizen.datasync.getAll(),
				i = 0,
				objectsCount = objects.length,
				result = [];
			for(; i < objectsCount; i++) {
				result.push(new SyncProfileInfo(void 0, objects[i]));
			}
			return result;
		},

		startSync: function(profileId /*SyncProfileId*/, progressCallback /*SyncProgressCallback*/) {
			// Tizen distinguishes between undefined optional parameters (this gives an error) and missing optional parameters (this is correct).
			var args = [ profileId ];
			(typeof progressCallback !== 'undefined') && args.push({
				onprogress: function(profileId, serviceType, isFromServer, totalPerService, syncedPerService) {
					progressCallback({
						code: 0,
						success: true,
						profileId: profileId,
						progress : {
							serviceType: serviceType,
							isFromServer: isFromServer,
							totalPerService: totalPerService,
							syncedPerService: syncedPerService
						}
					});
				},
				oncompleted: function(profileId) {
					progressCallback({
						code: 0,
						success: true,
						completed: ture,
						profileId: profileId
					});
				},
				onstopped: function(profileId) {
					progressCallback({
						code: 0,
						success: true,
						stopped : true,
						profileId: profileId
					});
				},
				onfailed: function(profileId, e) {
					progressCallback({
						code: e.code,
						success: false,
						error: e.type + ': ' + e.message
					});
				}
			});
			tizen.datasync.startSync.call(tizen.datasync, args);
		},

		stopSync: function(profileId /*SyncProfileId*/) {
			tizen.datasync.stopSync(profileId);
		},

		getLastSyncStatistics: function(profileId /*SyncProfileId*/) {
			var objects = tizen.datasync.getLastSyncStatistics(profileId),
				i = 0,
				objectsCount = objects.length,
				result = [];
			for(; i < objectsCount; i++) {
				result.push(new SyncStatistics(objects[i]));
			}
			return result;
		},

		createSyncInfo: function(args) {
			return new SyncInfo(args); 
		},

		createSyncServiceInfo: function(args) {
			return new SyncServiceInfo(args); 
		},

		createSyncProfileInfo: function(args) {
			return new SyncProfileInfo(args);
		},

	}, true);
});