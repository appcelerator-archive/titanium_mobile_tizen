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
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			var args = [
				reqId,
				insertionData
			];
			(typeof callback !== 'undefined') && args.push(function (reqId, insertRowId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId,
						insertRowId: insertRowId
					})
				},
				function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
			return this._obj.insert.apply(this._obj, args);
		},

		update: function(reqId /*unsigned long*/, updateData /*RowData*/, where /*DOMString*/, callback) {
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			var args = [
				reqId,
				updateData,
				where
			];
			(typeof callback !== 'undefined') && args.push(function (reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId,
					})
				},
				function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
			return this._obj.update.apply(this._obj, args);
		},

		remove: function(reqId /*unsigned long*/, where /*DOMString*/, callback) {
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			var args = [
				reqId,
				where
			];
			(typeof callback !== 'undefined') && args.push(function (reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId,
					})
				},
				function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
			return this._obj.remove.apply(this._obj, args);
		},

		select: function(reqId /*unsigned long*/, columns /*DOMString*/, where /*DOMString*/, callback, page /*unsigned long*/, maxNumberPerPage /*unsigned long*/) {
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			var args = [
				reqId,
				columns,
				where,
				function (rows, reqId) {
					callback({
						code: 0,
						success: true,
						rows: rows,
						reqId: reqId,
					});
				},
				function (reqId, e) {
					onError(e, callback, reqId);
				},
			];
			(typeof page !== 'undefined') && args.push(page);
			(typeof maxNumberPerPage !== 'undefined') && args.push(maxNumberPerPage);
			return this._obj.select.apply(this._obj, args);
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataControl.SQLDataControlConsumer';
	return obj;
});
