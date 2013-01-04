define(["require", "Ti/_/lang", "Ti/_/Evented", "Ti/API"],
    function (require, lang, Evented, API) {

        var locale = lang.val(navigator.language, navigator.browserLanguage).replace(/^([^\-\_]+)[\-\_](.+)?$/, function (o, l, c) { return l.toLowerCase() + (c && "-" + c.toUpperCase()); }),
            languageParts = locale.split("-"),
            language = languageParts[0],
            strings = {},
            cfg = require.config,
            app = cfg.app,
            localeInfoStorage = null, // expandable object with  all available locale data.
            formatterHelpers = null, //lazy loaded functions to format decimals, currency e.t.c.
            phoneFormatter = null; //phoneFormatter used to format phone numbers.

        document.title = app.name = app.names[language] || app.name;

        try {
            ~cfg.locales.indexOf(language) && (strings = require("./Locale/" + language + "/i18n"));
        } catch (e) { }

        function getString(key, hint) {
            return strings[key] || hint || key || "";
        }

        Object.defineProperty(window, "L", { value: getString, enumarable: true });

        //lazy initialization of locale oriented formatters.
        function initFormatterHelpers(){
            if (!formatterHelpers)
            {
                formatterHelpers = require("Ti/LocaleUtils/FormatterHelpers");
            }
        }

        //lazy initialization of locale storage.
        function initLocaleInfoStorage(){
            if (!localeInfoStorage)
            {
                localeInfoStorage = require("Ti/LocaleUtils/LocaleInfoStorage");
            }
        }

        // lazy initialization of Phone number formatter
        function initPhoneFormatter(){
            if (!phoneFormatter)
            {
                phoneFormatter = require("Ti/LocaleUtils/PhoneFormatter");
            }
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

            if (!isValidLocaleName(localeName)) {
                // in case you passed 3 parameters and second parameter is not valid locale name.
                throw "Invalid locale name."; //todo: Do we need to localize error message?
            }
            initLocaleInfoStorage();
            initFormatterHelpers();

            var numberInfo = localeInfoStorage.getNumberInfoForLocale(localeName);
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
            initLocaleInfoStorage();
            initFormatterHelpers();
            return formatterHelpers.formatCurrency(amt, localeInfoStorage.getCurrencyInfoByLocale(targetLocale || locale)) || amt;
        };

        // expands format name into the full pattern.
        expandFormat = function( cal, format ) {
            return (!format || !format.length) ? format : cal.patterns[ format ] || format;
        };

        // format a date into a locale specific date format. Optionally pass a second argument (string) as either "short" (default), "medium" or "long" for controlling the date format.
        String.formatDate = function (dt, fmt) {
            // todo: For now "MEDIUM" value of format not supported!
            initLocaleInfoStorage();
            initFormatterHelpers();
            var cal = localeInfoStorage.getCalendarByLocale(locale);
            return formatterHelpers.formatDate(dt, expandFormat(cal, (fmt == "long")?"D":"d"), cal);
            //return dt.toString();
        };

        // format a date into a locale specific time format.
        String.formatTime = function (dt, fmt) {
            // todo: For now "MEDIUM" value of format not supported!
            initLocaleInfoStorage();
            initFormatterHelpers();
            var cal = localeInfoStorage.getCalendarByLocale(locale);
            return formatterHelpers.formatDate(dt, expandFormat(cal, (fmt == "long")?"T":"t"), cal);
            //return dt.toLocaleTimeString();
        };

        return lang.setObject("Ti.Locale", Evented, {

            constants: {
                currentCountry: languageParts[1] || "",
                currentLanguage: languageParts[0] || "",
                currentLocale: locale
            },

            formatTelephoneNumber: function (s) {
                initPhoneFormatter();
                return (phoneFormatter && phoneFormatter.formatTelephoneNumber)?phoneFormatter.formatTelephoneNumber(s, locale): s;
            },

            // locale = "en-US" => "USD"
            getCurrencyCode: function (locale) {
                initLocaleInfoStorage();
                return localeInfoStorage.getCurrencyInfoByLocale(locale).currencyCode;
            },

            // currencyCode = "USD" => "$"
            getCurrencySymbol: function (currencyCode) {
                initLocaleInfoStorage();
                return localeInfoStorage.getCurrencyInfoByCode(currencyCode).currencySymbol;
            },

            // locale = "en-US" => "$"
            getLocaleCurrencySymbol: function (locale) {
                initLocaleInfoStorage();
                return localeInfoStorage.getCurrencyInfoByLocale(locale).currencySymbol;
            },

            getString: getString,

            _getString: function (key, hint) {
                return lang.val(hint, getString(key, hint));
            }
        });
    });