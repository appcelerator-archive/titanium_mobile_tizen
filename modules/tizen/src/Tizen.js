// Wraps Tizen module called "Tizen".

define(['Ti/_/lang', 'Ti/_/Evented', 'Tizen/_/AttributeFilter', 'Tizen/_/AttributeRangeFilter', 'Tizen/_/CompositeFilter', 'Tizen/_/SortMode',
	'Tizen/_/SimpleCoordinates', 'Tizen/_/Power', 'Tizen/_/Calendar', 'Tizen/_/Download', 'Tizen/_/Alarm', 'Tizen/_/CallHistory', 'Tizen/_/Notification', 'Tizen/_/Apps',
	'Tizen/_/SystemSetting', 'Tizen/_/Bluetooth', 'Tizen/_/Messaging', 'Tizen/_/SystemInfo', 'Tizen/_/NFC', 'Tizen/_/Contact/ContactRef', 'Tizen/_/Bookmark', 
	'Tizen/_/DataControl', 'Tizen/_/Package', 'Tizen/_/MessagePort', 'Tizen/_/DataSynchronization', 'Tizen/_/Push', 'Tizen/_/WebSetting'],
	function(lang, Evented, AttributeFilter, AttributeRangeFilter, CompositeFilter, SortMode, SimpleCoordinates, Power, 
			 Calendar, Download, Alarm, CallHistory, Notification, Apps, SystemSetting, Bluetooth, Messaging, SystemInfo, 
			 NFC, ContactRef, Bookmark, DataControl, Package, MessagePort, DataSynchronization, Push, WebSetting) {

		var Tizen = lang.mixProps(require.mix({}, Evented), {

			createAttributeFilter: function(args) {
				return new AttributeFilter(args);
			},

			createAttributeRangeFilter: function(args) {
				return new AttributeRangeFilter(args);
			},

			createCompositeFilter: function(args) {
				return new CompositeFilter(args);
			},

			createSortMode: function(args) {
				return new SortMode(args);
			},

			createSimpleCoordinates: function(args) {
				return new SimpleCoordinates(args);
			},

			createContactRef: function(args){
				return new ContactRef(args);
			},

			constants: {
				FILTER_MATCH_FLAG_EXACTLY: 'EXACTLY',
				FILTER_MATCH_FLAG_FULLSTRING: 'FULLSTRING',
				FILTER_MATCH_FLAG_CONTAINS: 'CONTAINS',
				FILTER_MATCH_FLAG_STARTSWITH: 'STARTSWITH',
				FILTER_MATCH_FLAG_ENDSWITH: 'ENDSWITH',
				FILTER_MATCH_FLAG_EXISTS: 'EXISTS',
				SORT_MODE_ORDER_ASC: 'ASC',
				SORT_MODE_ORDER_DESC: 'DESC',
				COMPOSITE_FILTER_TYPE_UNION: 'UNION',
				COMPOSITE_FILTER_TYPE_INTERSECTION: 'INTERSECTION',
				Power: Power,
				Calendar: Calendar,
				Alarm: Alarm,
				CallHistory: CallHistory,
				Notification: Notification,
				Apps: Apps,
				Download: Download,
				SystemSetting: SystemSetting,
				Bluetooth: Bluetooth,
				Messaging: Messaging,
				SystemInfo: SystemInfo,
				NFC: NFC,
				Bookmark: Bookmark,
				DataControl: DataControl,
				Package: Package,
				MessagePort: MessagePort,
				DataSync: DataSynchronization,
				Push: Push,
				WebSetting: WebSetting
			}

		}, true);

		return Tizen;
	});
