define(["require", "Ti/_/lang", "Ti/_/Evented", "Ti/API"],
	function (require, lang, Evented, API) {

		var locale = lang.val(navigator.language, navigator.browserLanguage).replace(/^([^\-\_]+)[\-\_](.+)?$/, function (o, l, c) { return l.toLowerCase() + (c && "-" + c.toUpperCase()); }),
			languageParts = locale.split("-"),
			language = languageParts[0],
			strings = {},
			cfg = require.config,
			app = cfg.app,
			localeNumberCurrencyInfo = null, // expandable object with  all available locale data.
			localeCalendarInfo = null, //lazy loaded object with formatting rulers for data\time
			formatterHelpers = null, //lazy loaded functions to format decimals, currency e.t.c.
			phoneFormatter = null; //phoneFormatter used to format phone numbers.

		document.title = app.name = app.names[language] || app.name;

		try {
			~cfg.locales.indexOf(language) && (strings = require("./Locale/" + language + "/i18n"));
		} catch (e) { }

		function getString(key, hint) {
			return strings[key] || hint || key || "";
		}

		Object.defineProperty(window, "L", { value: getString, enumerable: true });

		//lazy initialization of locale oriented formatters.
		function initFormatterHelpers(){
			if (!formatterHelpers)  formatterHelpers = require("Ti/_/Locale/FormatterHelpers");
		}

		//lazy initialization of locale number nad currency format storage.
		function initCurrentCalendarData(){
			if (!localeCalendarInfo) localeCalendarInfo = require("Ti/_/Locale/Calendar/"+locale);

			if (locale!="en-US")
				API.warn("Loading default locale (en-US) instead of "+locale);

			//if we can't load target's locale calendar - we are using default (en-US)
			if (!localeCalendarInfo) localeCalendarInfo = require("Ti/_/Locale/defaultCalendar");
		}

		//lazy initialization of locale number nad currency format storage.
		function initNumberCurrencyFormat(){
			if (!localeNumberCurrencyInfo) localeNumberCurrencyInfo = require("Ti/_/Locale/NumberCurrencyFormatStorage");
		}

		// lazy initialization of Phone number formatter
		function initPhoneFormatter(){
			if (!phoneFormatter) phoneFormatter = require("Ti/_/Locale/PhoneFormatter");
		}

		// Format a number into a locale specific decimal format. May use pattern.
		// Hint: According to documentation both parameters localeName and pattern are optional.
		//       So if second parameter is not valid locale name - it will be used as pattern.
		String.formatDecimal = function (numberValue, localeName, pattern) {

			// Function checks name according to basic rfc4647 validation rules, with advanced validation of first sub-tag.
			// It do not validate name against ISO 639-1, ISO 639-2, ISO 639-3 and ISO 639-5);
			function isValidLocaleName(localeName) {
				var rfc4647Basic = "^([A-Za-z]{2,3}|([xX])|([iI]))(-[A-Za-z0-9]{1,8})+$";
				return (('' + localeName).match(rfc4647Basic) != null);
			};
			if (!pattern) {
				//in this case parameter named as localName can be pattern (as both are optional parameters according to documentation)
				if (localeName) {
					if (!isValidLocaleName(localeName)) {
						//if second parameter is NOT valid locale name - it is is a pattern.
						pattern = localeName;
						localeName = undefined;
					}
				}
			}
			// if locale was not set from parameters - use current.
			if (!localeName) {
				localeName = locale;
			}
			// if we are sure that parameter named "localeName" should contain name of target locale but it does not match rfc4647 we cant continue
			if (!isValidLocaleName(localeName)) {
				// in case you passed 3 parameters and second parameter is not valid locale name.
				throw "Invalid locale name.";
			}
			initNumberCurrencyFormat();
			initFormatterHelpers();

			var numberInfo = localeNumberCurrencyInfo.getNumberInfoByLocale(localeName);
			// if no pattern in parameters - create "default pattern" based on locale's data
			if (!pattern) {
				//to unify we just generating custom pattern if no one provided. like ###.###.###.###.###.###.###.###.###.###,#####################
				//acording to numberInfo.groupSizes
				pattern = formatterHelpers.generatePatternFromGroupSizes(numberInfo.groupSizes, (""+numberValue).length * 2);
			}
			return formatterHelpers.formatDecimal(numberValue, pattern, numberInfo);
		};

		// format a number into a locale specific currency format. TagretLocale i soptional and only for mobileWeb and Tizen
		String.formatCurrency = function (amt, targetLocale) {
			initNumberCurrencyFormat();
			initFormatterHelpers();
			return formatterHelpers.formatCurrency(amt, localeNumberCurrencyInfo.getCurrencyInfoByLocale(targetLocale || locale)) || amt;
		};

		// expands format name into the full pattern.
		expandFormat = function( cal, format ) {
			return (!format || !format.length) ? format : cal.patterns[ format ] || format;
		};

		// format a date into a locale specific date format. Optionally pass a second argument (string) as either "short" (default), "medium" or "long" for controlling the date format.
		String.formatDate = function (dt, fmt) {
			// For now "MEDIUM" value of format not supported! Only short - "d", and long - "D"
			initFormatterHelpers();
			initCurrentCalendarData();

			if (!localeCalendarInfo){
				API.warn("Calendar info for locale '"+locale+"' is not loaded. Formatting date with default JS functions.");
				return [('0'+dt.getDate()).slice(-2),('0'+(dt.getMonth()+1)).slice(-2),dt.getFullYear()].join('/');
			}
			else
				return formatterHelpers.formatDate(dt, expandFormat(localeCalendarInfo, (fmt == "long")?"D":"d"), localeCalendarInfo);
		};

		// format a date into a locale specific time format.
		String.formatTime = function (dt, fmt) {
			// For now "MEDIUM" value of format not supported! Only short - "t", and long - "T"
			initFormatterHelpers();
			initCurrentCalendarData();

			if (!localeCalendarInfo){
				API.warn("Calendar info for locale '"+locale+"' is not loaded. Formatting time with default JS functions.");
				return [('0'+dt.getHours()).slice(-2),('0'+dt.getMinutes()).slice(-2),('0'+dt.getSeconds()).slice(-2)].join(':');
			}
			else
				return formatterHelpers.formatDate(dt, expandFormat(localeCalendarInfo, (fmt == "long")?"T":"t"), localeCalendarInfo);
		};

		return lang.setObject("Ti.Locale", Evented, {

			constants: {
				currentCountry: languageParts[1] || "",
				currentLanguage: languageParts[0] || "",
				currentLocale: locale
			},

			// Adds dashes to phone number. Result is unified with same function on Android 4.1.1
			formatTelephoneNumber: function (s) {
				initPhoneFormatter();
				return (phoneFormatter && phoneFormatter.formatTelephoneNumber)?phoneFormatter.formatTelephoneNumber(s, locale): s;
			},

			// locale = "en-US" => "USD"
			getCurrencyCode: function (locale) {
				initNumberCurrencyFormat();
				return localeNumberCurrencyInfo.getCurrencyInfoByLocale(locale).currencyCode;
			},

			// currencyCode = "USD" => "$"
			getCurrencySymbol: function (currencyCode) {
				initNumberCurrencyFormat();
				return localeNumberCurrencyInfo.getCurrencyInfoByCode(currencyCode).currencySymbol;
			},

			// locale = "en-US" => "$"
			getLocaleCurrencySymbol: function (locale) {
				initNumberCurrencyFormat();
				return localeNumberCurrencyInfo.getCurrencyInfoByLocale(locale).currencySymbol;
			},

			getString: getString,

			_getString: function (key, hint) {
				return lang.val(hint, getString(key, hint));
			}
		});
	});