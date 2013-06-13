// Helper functions for the wrapper of Tizen module "Calendar".
// Main purpose of these functions is to map from native Tizen time-related types to 
// built-in JavaScript types. The reason for this is that the wrapper accepts
// built-in time-related types, whereas Tizen accepts its own time-related types.

define(function() {

	return {

		// Creates a native Tizen object "TZDate" out of a built-in JavaScript date object.
		createTZDate: function(dateObj) {
			return new tizen.TZDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes());
		},

		// Creates a built-in JavaScript date object out of a native Tizen object "TZDate".
		createDate: function(tzDateObj) {
			return new Date(tzDateObj.getUTCFullYear(), tzDateObj.getUTCMonth(), tzDateObj.getUTCDate(), tzDateObj.getUTCHours(), tzDateObj.getUTCMinutes());
		},

		// Create a native Tizen TimeDuration object out of a milliseconds value.
		createTimeDuration: function(msecs) {
			return new tizen.TimeDuration(msecs / 1000, 'SECS');
		},

		// Convert a native Tizen TimeDuration object to a milloseconds value.
		toMsec: function(tzTimeDuration) {
			var res;

			switch (tzTimeDuration.unit) {
				case 'SECS':
					res = tzTimeDuration.length * 1000;
					break;
				case 'MSECS':
					res = tzTimeDuration.length;
					break;
				default:
					console.error('Something happened with get method for duration');
			}

			return res;
		}
	};
});