define(['Ti/API'], function(API) {

	return {

		createTZDate: function(dateObj) {
			return new tizen.TZDate(dateObj.getUTCFullYear(), dateObj.getUTCMonth(), dateObj.getUTCDate(), dateObj.getUTCHours(), dateObj.getUTCMinutes());
		},

		createDate: function(tzDateObj) {
			return new Date(tzDateObj.getUTCFullYear(), tzDateObj.getUTCMonth(), tzDateObj.getUTCDate(), tzDateObj.getUTCHours(), tzDateObj.getUTCMinutes());
		},

		createTimeDuration: function(msecs) {
			return new tizen.TimeDuration(msecs / 1000, 'SECS');
		},

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
					Ti.API.error('Something happened with get method for duration');
			}

			return res;
		}
	}
});