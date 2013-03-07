function tizen_media_content_directories(args) {
	var self = Titanium.UI.createWindow({ backgroundColor: '#FFFFFF', layout: 'vertical' }),
		foldersList = Ti.UI.createTableView({
			headerTitle: 'List of directories',
			left: '2%',
			top: 4,
			width: '96%',
			borderWidth: 1,
			borderColor: '#cccccc'
		}),
		viewFolders = Titanium.UI.createView({
			layout: 'horizontal',
			width: '96%',
			left: '2%',
			height: 110,
			top: 10
		}),
		foldersLabel = Titanium.UI.createLabel({
			text: 'Select a storage',
			color: '#000000',
			width: '48%'
		}),
		pickerFolders = Ti.UI.createPicker({
			left: '2%',
			width: '50%',
			height: '105'
		}),
		dataFolders = [],
		folderType;

	dataFolders[0] = Ti.UI.createPickerRow({ title: 'INTERNAL', value: 'INTERNAL' });
	dataFolders[1] = Ti.UI.createPickerRow({ title: 'EXTERNAL', value: 'EXTERNAL' });

	//Get folders with a media content Begin
	function getSelectedFoldersList() {
		var source = null;

		function onError(e) {
			Ti.API.error(e.message);
		}

		Ti.Tizen.Content.getDirectories(onMediaFolderArrayFilteredSuccess, onError);
	}

	function onMediaFolderArrayFilteredSuccess(folders) {
		var tableData = [],
			i = 0,
			foldersCount = folders.length;
		
		for (; i < foldersCount; i++) {
			if (folders[i].storageType === folderType) {
				var row = Ti.UI.createTableViewRow({
					title: folders[i].title
				});

				tableData.push(row);
			}
		}

		(tableData.length == 0) && Titanium.UI.createAlertDialog({
									title: 'Info',
									message: 'Content is empty. Create some directories first.'
								}).show();

		foldersList.setData(tableData);
	}

	pickerFolders.addEventListener('change', function(e) {
		folderType = e.row.value;
		getSelectedFoldersList(e.row.value);

		Ti.API.info("folderType: " + folderType);
	});
	//Get folders with a media content End

	pickerFolders.add(dataFolders);
	viewFolders.add(foldersLabel);
	viewFolders.add(pickerFolders);
	self.add(viewFolders);

	self.add(foldersList);

	return self;
}

module.exports = tizen_media_content_directories;