define(function() {

    // +=========================== Number formatting ============================+
    // | General rules basically based on Android 4.1.1 code to match the results |
    // +==========================================================================+

    /** The current locale is unknown, look for a country code or don't format */
    var FORMAT_UNKNOWN = 0;
    /** NANP formatting */
    var FORMAT_NANP = 1;
    /** Japanese formatting */
    var FORMAT_JAPAN = 2;

    /** List of country codes for countries that use the NANP */
    var NANP_COUNTRIES = [
        "US", // United States
        "CA", // Canada
        "AS", // American Samoa
        "AI", // Anguilla
        "AG", // Antigua and Barbuda
        "BS", // Bahamas
        "BB", // Barbados
        "BM", // Bermuda
        "VG", // British Virgin Islands
        "KY", // Cayman Islands
        "DM", // Dominica
        "DO", // Dominican Republic
        "GD", // Grenada
        "GU", // Guam
        "JM", // Jamaica
        "PR", // Puerto Rico
        "MS", // Montserrat
        "MP", // Northern Mariana Islands
        "KN", // Saint Kitts and Nevis
        "LC", // Saint Lucia
        "VC", // Saint Vincent and the Grenadines
        "TT", // Trinidad and Tobago
        "TC", // Turks and Caicos Islands
        "VI"  // U.S. Virgin Islands
    ];

    var japanesePhoneNumberFormatter = null;

    /**
     * Breaks the given number down and formats it according to the rules
     * for the country the number is from.
     *
     * @param s The phone number to format
     * param defaultCountryCode Two letter country code to use as default.
     * @return A locally acceptable formatting of the input, or the raw input if
     *  formatting rules aren't known for the number
     */

    function formatTelephoneNumberInternal(s, defaultCountryCode) {
        return formatNumber(s, getFormatTypeFromCountryCode(defaultCountryCode));
    }

    // Check for the NANP countries or Japan. Android 4.1.1 don't know about anything else.
    function getFormatTypeFromCountryCode(s) {
        s = s.toUpperCase;
        if (NANP_COUNTRIES.indexOf(s) > 0) {
            return FORMAT_NANP;
        }

        if ("JP" == s) {
            return FORMAT_JAPAN;
        }
        return FORMAT_UNKNOWN;
    }

    /**
     * Formats a phone number in-place. Currently {@link #FORMAT_JAPAN} and {@link #FORMAT_NANP}
     * is supported as a second argument.
     *
     * @param s The number to be formatted, will be modified with the formatting
     * @param defaultFormattingType The default formatting rules to apply if the number does
     * not begin with +[country_code]
     */
    function formatNumber(s, defaultFormattingType) {
        var formatType = defaultFormattingType;
        if (s.length > 2 && s.charAt(0) == '+') {
            if (s.charAt(1) == '1') {
                formatType = FORMAT_NANP;
            } else if (s.charAt(1) == '8' && s.charAt(2) == '1') { //+81 JP
                formatType = FORMAT_JAPAN;
            } else {
                formatType = FORMAT_UNKNOWN;
            }
        }

        switch (formatType) {
            case FORMAT_NANP:
                return formatNanpNumber(s);
            case FORMAT_JAPAN:
                return formatJapaneseNumber(s);
            default:
                return removeDashesAndSpaces(s);
        }
    }


    /*
     * Formats a phone number using the NANP formatting rules. Numbers will be formatted as:
     *
     * +1-xxx-xxx-xxxx
     *  1-xxx-xxx-xxxx
     *    xxx-xxx-xxxx
     *        xxx-xxxx
     *           xxxxx
     */

    function formatNanpNumber(s) {
        // Strip the dashes first, as we're going to add them back
        s = removeDashesAndSpaces(s);

        // Nanp number validator: (general validator may checks allowable values of "N" in +1-NPA-NXX-xxxx)
        // general: ^(((\+){0,1}1){0,1}([2-9](([0-9]{2})||(?!)))){0,1}([2-9][0-9]{2})([0-9]{4})$
        // simplifyed: ^(((\+){0,1}1){0,1}([\d]{3})){0,1}([\d]{3})([\d]{4})$
        if (!s.match(/^(((\+){0,1}1){0,1}([\d]{3})){0,1}([\d]{3})([\d]{4})$/)) {
            return s;
        }

        var dashRevercedPositions = [5, 8, 11]; //index of dashes in dushless string conted from the END of string
        var l = s.length;
        var result = "";

        for (var k = 0; k < l; k++) {
            result += s.charAt(k) + ((dashRevercedPositions.indexOf(l - k) < 0) ? "" : "-");
        }

        return result;
    }

    /**
     * Formats a phone number in-place using the Japanese formatting rules.
     * Numbers will be formatted as:
     *
     * <p><code>
     * 03-xxxx-xxxx
     * 090-xxxx-xxxx
     * 0120-xxx-xxx
     * +81-3-xxxx-xxxx
     * +81-90-xxxx-xxxx
     * </code></p>
     *
     * @param text the number to be formatted, will be modified with
     * the formatting
     */
   
    function formatJapaneseNumber(s) {
        if (!japanesePhoneNumberFormatter)
        {
            japanesePhoneNumberFormatter = require("Ti/LocaleUtils/JapanesePhoneNumberFormatter");
        }
        return japanesePhoneNumberFormatter.formatJapaneseNumber(s);
    }

    ///
    /// Removes dashes and spaces from the string.
    /// todo: ask - do we need to remove spaces?
    function removeDashesAndSpaces(s) {
        return (s + "").replace(/[- ]/g, '');
    }

    return {
        formatTelephoneNumber : function(phoneNumber, currentLocale){
            var localeParts = (currentLocale)?currentLocale.split(/-/):[];
            return formatTelephoneNumberInternal(phoneNumber, localeParts[localeParts.length-1]);
        }
    }
});