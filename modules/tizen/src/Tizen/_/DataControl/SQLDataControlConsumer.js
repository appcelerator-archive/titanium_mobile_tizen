define(['Ti/_/declare', 'Tizen/_/DataControl/DataControlConsumerObject'], function(declare, DataControlConsumerObject) {

	function onError (e, callback, reqId) {
		callback({
			success: false,
			error: e.type + ': ' + e.message,
			code: e.code,
			reqId: reqId
		});
	}

	var obj = declare(DataControlConsumerObject, {

		constructor: function(args, nativeObj) {
			if(nativeObj) {
				// nativeObj is a native Tizen object; simply wrap it (take ownership of it)
				this._obj = nativeObj;
			}
		},

		insert: function(reqId /*unsigned long*/, insertionData /*RowData*/, callback) {
			return this._obj.insert(reqId, insertionData, 
				callback && function (reqId, insertRowId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId,
						insertRowId: insertRowId
					})
				},
				callback && function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
		},

		update: function(reqId /*unsigned long*/, updateData /*RowData*/, where /*DOMString*/, callback) {
			return this._obj.update(reqId, updateData, where, 
				callback && function (reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId,
					})
				},
				callback && function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
		},

		remove: function(reqId /*unsigned long*/, where /*DOMString*/, callback) {
			return this._obj.remove(reqId, where, 
				callback && function (reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId,
					})
				},
				callback && function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
		},

		select: function(reqId /*unsigned long*/, columns /*DOMString*/, where /*DOMString*/, callback, page /*unsigned long*/, maxNumberPerPage /*unsigned long*/) {
			return this._obj.select(reqId, columns, where, 
				callback && function (rows, reqId) {
					callback({
						code: 0,
						success: true,
						rows: rows,
						reqId: reqId,
					})
				},
				callback && function (reqId, e) {
					onError(e, callback, reqId);
				},
				page, maxNumberPerPage
			);
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataControl.SQLDataControlConsumer';
	return obj;
});
