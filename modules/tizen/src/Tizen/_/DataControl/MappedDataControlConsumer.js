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

		addValue: function(reqId /*unsigned long*/, key /*DOMString*/, value /*DOMString*/, callback) {
			// Tizen distinguishes between undefined parameter (this gives an error) and missing parameter (correct).
			var args = [
				reqId,
				key,
				value
			];
			(typeof callback !== 'undefined') && args.push(function (reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId
					})
				},
				function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
			return this._obj.addValue.apply(this._obj, args)
		},

		removeValue: function(reqId /*unsigned long*/, key /*DOMString*/, value /*DOMString*/, callback) {
			return this._obj.removeValue(reqId, key, value, 
				callback && function (reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId
					})
				},
				callback && function (reqId, e) {
					onError(e, callback, reqId);
				}
			)
		},

		getValue: function(reqId /*unsigned long*/, key /*DOMString*/, callback) {
			return this._obj.getValue(reqId, key, 
				callback && function (values, reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId,
						values: values
					})
				},
				callback && function (reqId, e) {
					onError(e, callback, reqId);
				}
			);
		},

		updateValue: function(reqId /*unsigned long*/, key /*DOMString*/, oldValue /*DOMString*/, newValue /*DOMString*/, callback) {
			return this._obj.updateValue(reqId, key, oldValue, newValue, 
				callback && function (reqId) {
					callback({
						code: 0,
						success: true,
						reqId: reqId
					})
				},
				callback && function (e) {
					onError(e, callback, reqId);
				}
			);
		}
	});

	// Initialize declaredClass, so that toString() works properly on such objects.
	// Correct operation of toString() is required for proper wrapping and automated testing.
	obj.prototype.declaredClass = 'Tizen.DataControl.MappedDataControlConsumer';
	return obj;
});
