/*
 * Appcelerator Titanium Mobile
 * Copyright (c) 2011-2012 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 */

var suites = [
	{name: "analytics"},
	{name: "accelerometer"},
	{name: "blob"},
	{name: "buffer"},
	{name: "codec"},
	{name: "commonjs/commonjs"},
	{name: "console"},
	{name: "database"},
	{name: "facebook"},
	{name: "filesystem/filesystem"},
	{name: "json"},
	{name: "jss"},
	{name: "kroll"},
	{name: "locale"},
	{name: "media/media"},
	{name: "network_httpclient"},
	{name: "network"},
	{name: "network_socket"},
	{name: "network_socket_tcp"},
	{name: "platform"},
	{name: "properties"},
	{name: "stream"},
	{name: "titanium"},
	{name: "ui/ui"},
	{name: "ui_2dMatrix"},
	{name: "ui_clipboard"},
	{name: "ui_controls"},
	{name: "utils/utils"},
	{name: "yahoo"},
	{name: "ui_alert_dialog"},
	{name: "ui_searchbar"},
	{name: "ui_progress_bar"},
	{name: "ui_option_dialog"},
	{name: "ui_activity_indicator"},
	{name: "ui_label"},
	{name: "ui/tableViewSection"},
	{name: "ui/mobile-NavigationGroup"},
	{name: "ui/tabGroup"},
	{name: "ui/tab"},	
	{name: "map"},
	{name: "ui/image_view"},
	{name: "ui/switch"},
	{name: "ui/button"},
	{name: "ui/picker"},
	{name: "ui_TextArea"},
	{name: "ui_TextField"},
	{name: "ui/ScrollView"},
	{name: "ui/ScrollableView"},
	{name: "ui_animation"},
	{name: "ui/window"}
];

if (Ti.Platform.osname === 'android') {
	suites = suites.concat([
		{name: "android/android_database/android_database"},
		{name: "android/android_filesystem"},
		{name: "android/android_geolocation"},
		{name: "android/android_kroll"},
		{name: "android/android_network_httpclient"},
		{name: "android/android_notificationmgr"},
		{name: "android/android_platform"},
		{name: "android/android_resources/android_resources"},
		{name: "android/android_string"},
		{name: "android/android_ui/android_ui"}
	]);

} else if((Ti.Platform.osname === 'iPhone') || (Ti.Platform.osname === 'iPad')) {
	suites = suites.concat([
		{name: "iphone/iphone_2Dmatrix"},
		{name: "iphone/iphone_ui"},
		{name: "iphone/iphone_UI_3DMatrix"}
	]);
}


/*
these lines must be present and should not be modified.  "suites" argument to setSuites is 
expected to be an array (should be an empty array at the very least in cases where population of 
the suites argument is based on platform type and may result in no valid suites being added to the 
argument)
*/
var init = require("init");
init.setSuites(suites);
init.start();
