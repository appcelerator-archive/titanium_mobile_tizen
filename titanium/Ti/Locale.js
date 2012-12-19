define(["require", "Ti/_/lang", "Ti/_/Evented", "Ti/API"],
	function (require, lang, Evented, API) {

	    var locale = lang.val(navigator.language, navigator.browserLanguage).replace(/^([^\-\_]+)[\-\_](.+)?$/, function (o, l, c) { return l.toLowerCase() + (c && "-" + c.toUpperCase()); }),
		languageParts = locale.split("-"),
		language = languageParts[0],
		strings = {},
		cfg = require.config,
		app = cfg.app;

	    document.title = app.name = app.names[language] || app.name;

	    try {
	        ~cfg.locales.indexOf(language) && (strings = require("./Locale/" + language + "/i18n"));
	    } catch (e) { }

	    function getString(key, hint) {
	        return strings[key] || hint || key || "";
	    }

	    Object.defineProperty(window, "L", { value: getString, enumarable: true });

	    // Generated from MS .NET 4.0 System.Globalization.CultureInfo
	    // Each row has two arrays(a and b) of values for some locale:
	    // a[0] - currencyCode
	    // a[1] - currencySymbol
	    // a[2] - positivePattern
	    // a[3] - negativePattern
	    // a[4] - decimalSeparator
	    // a[5] - groupSeparator
	    // a[6] - currencyDecimalDigits
	    // a[7] - CurrencyGroupSizes (not array - as joined string like: '320')

	    // b[0] - negativePattern. If absend - use default "-n"
	    // b[1] - numberGroupSizes (not array - as joined string like: '320'). If absend - use 'currencyGroupSizes' from currency 
	    // b[2] - decimalSeparator. If absend - use 'decimalSeparator' from currency 
	    // b[3] - groupSeparator. If absend - use 'groupSeparator' from currency 
	    var globalLocalizer = {
		"ar-SA":[["SAR","\u0631.\u0633.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"bg-BG":[["BGN","\u043b\u0432.","n $","-n $",",","\u00a0",2,"3"],[]],
		"ca-ES":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"zh-TW":[["TWD","NT$","$n","-$n",".",",",2,"3"],[]],
		"cs-CZ":[["CZK","K\u010d","n $","-n $",",","\u00a0",2,"3"],[]],
		"da-DK":[["DKK","kr.","$ n","$ -n",",",".",2,"3"],[]],
		"de-DE":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"el-GR":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"en-US":[["USD","$","$n","($n)",".",",",2,"3"],[]],
		"fi-FI":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"fr-FR":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"he-IL":[["ILS","\u20aa","$ n","$-n",".",",",2,"3"],[]],
		"hu-HU":[["HUF","Ft","n $","-n $",",","\u00a0",2,"3"],[]],
		"is-IS":[["ISK","kr.","n $","-n $",",",".",0,"3"],[]],
		"it-IT":[["EUR","\u20ac","$ n","-$ n",",",".",2,"3"],[]],
		"ja-JP":[["JPY","\u00a5","$n","-$n",".",",",0,"3"],[]],
		"ko-KR":[["KRW","\u20a9","$n","-$n",".",",",0,"3"],[]],
		"nl-NL":[["EUR","\u20ac","$ n","$ -n",",",".",2,"3"],[]],
		"nb-NO":[["NOK","kr","$ n","$ -n",",","\u00a0",2,"3"],[]],
		"pl-PL":[["PLN","z\u0142","n $","-n $",",","\u00a0",2,"3"],[]],
		"pt-BR":[["BRL","R$","$ n","-$ n",",",".",2,"3"],[]],
		"rm-CH":[["CHF","fr.","$ n","$-n",".","'",2,"3"],[]],
		"ro-RO":[["RON","lei","n $","-n $",",",".",2,"3"],[]],
		"ru-RU":[["RUB","\u0440.","n$","-n$",",","\u00a0",2,"3"],[]],
		"hr-HR":[["HRK","kn","n $","-n $",",",".",2,"3"],["- n"]],
		"sk-SK":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"sq-AL":[["ALL","Lek","n$","-n$",",",".",2,"3"],[]],
		"sv-SE":[["SEK","kr","n $","-n $",",",".",2,"3"],["-n"]],
		"th-TH":[["THB","\u0e3f","$n","-$n",".",",",2,"3"],[]],
		"tr-TR":[["TRY","TL","n $","-n $",",",".",2,"3"],[]],
		"ur-PK":[["PKR","Rs","$n","$n-",".",",",2,"3"],[]],
		"id-ID":[["IDR","Rp","$n","($n)",",",".",0,"3"],[]],
		"uk-UA":[["UAH","\u20b4","n$","-n$",",","\u00a0",2,"3"],[]],
		"be-BY":[["BYR","\u0440.","n $","-n $",",","\u00a0",2,"3"],[]],
		"sl-SI":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"et-EE":[["EEK","kr","n $","-n $",".","\u00a0",2,"3"],["-n"]],
		"lv-LV":[["LVL","Ls","$ n","-$ n",",","\u00a0",2,"3"],[]],
		"lt-LT":[["LTL","Lt","n $","-n $",",",".",2,"3"],[]],
		"tg-Cyrl-TJ":[["TJS","\u0442.\u0440.","n $","-n $",";","\u00a0",2,"30"],["-n"]],
		"fa-IR":[["IRR","\u0631\u064a\u0627\u0644","$ n","$n-","/",",",2,"3"],["n-"]],
		"vi-VN":[["VND","\u20ab","n $","-n $",",",".",2,"3"],[]],
		"hy-AM":[["AMD","\u0564\u0580.","n $","-n $",".",",",2,"3"],[]],
		"az-Latn-AZ":[["AZN","man.","n $","-n $",",","\u00a0",2,"3"],[]],
		"eu-ES":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"hsb-DE":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"mk-MK":[["MKD","\u0434\u0435\u043d.","n $","-n $",",",".",2,"3"],[]],
		"tn-ZA":[["ZAR","R","$ n","$-n",".",",",2,"3"],[]],
		"xh-ZA":[["ZAR","R","$ n","$-n",".",",",2,"3"],[]],
		"zu-ZA":[["ZAR","R","$ n","$-n",".",",",2,"3"],[]],
		"af-ZA":[["ZAR","R","$ n","$-n",".",",",2,"3"],[]],
		"ka-GE":[["GEL","Lari","n $","-n $",",","\u00a0",2,"3"],[]],
		"fo-FO":[["DKK","kr.","$ n","$ -n",",",".",2,"3"],[]],
		"hi-IN":[["INR","\u0930\u0941","$ n","$ -n",".",",",2,"32"],[]],
		"mt-MT":[["EUR","\u20ac","$n","-$n",".",",",2,"3"],[]],
		"se-NO":[["NOK","kr","$ n","$ -n",",","\u00a0",2,"3"],[]],
		"ms-MY":[["MYR","RM","$n","($n)",".",",",0,"3"],[]],
		"kk-KZ":[["KZT","\u0422","$n","-$n","-","\u00a0",2,"3"],["-n"]],
		"ky-KG":[["KGS","\u0441\u043e\u043c","n $","-n $","-","\u00a0",2,"3"],["-n"]],
		"sw-KE":[["KES","S","$n","($n)",".",",",2,"3"],[]],
		"tk-TM":[["TMT","m.","n$","-n$",",","\u00a0",2,"3"],[]],
		"uz-Latn-UZ":[["UZS","so'm","n $","-n $",",","\u00a0",0,"3"],[]],
		"tt-RU":[["RUB","\u0440.","n $","-n $",",","\u00a0",2,"3"],[]],
		"bn-IN":[["INR","\u099f\u09be","$ n","$ -n",".",",",2,"32"],[]],
		"pa-IN":[["INR","\u0a30\u0a41","$ n","$ -n",".",",",2,"32"],[]],
		"gu-IN":[["INR","\u0ab0\u0ac2","$ n","$ -n",".",",",2,"32"],[]],
		"or-IN":[["INR","\u0b1f","$ n","$ -n",".",",",2,"32"],[]],
		"ta-IN":[["INR","\u0bb0\u0bc2","$ n","$ -n",".",",",2,"32"],[]],
		"te-IN":[["INR","\u0c30\u0c42","$ n","$ -n",".",",",2,"32"],[]],
		"kn-IN":[["INR","\u0cb0\u0cc2","$ n","$ -n",".",",",2,"32"],[]],
		"ml-IN":[["INR","\u0d15","$ n","$ -n",".",",",2,"32"],[]],
		"as-IN":[["INR","\u099f","n$","$ -n",".",",",2,"32"],[]],
		"mr-IN":[["INR","\u0930\u0941","$ n","$ -n",".",",",2,"32"],[]],
		"sa-IN":[["INR","\u0930\u0941","$ n","$ -n",".",",",2,"32"],[]],
		"mn-MN":[["MNT","\u20ae","n$","-n$",",","\u00a0",2,"3"],[]],
		"bo-CN":[["CNY","\u00a5","$n","$-n",".",",",2,"30"],[]],
		"cy-GB":[["GBP","\u00a3","$n","-$n",".",",",2,"3"],[]],
		"km-KH":[["KHR","\u17db","n$","-n$",".",",",2,"3"],["- n"]],
		"lo-LA":[["LAK","\u20ad","n$","(n$)",".",",",2,"30"],["(n)"]],
		"gl-ES":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"kok-IN":[["INR","\u0930\u0941","$ n","$ -n",".",",",2,"32"],[]],
		"syr-SY":[["SYP","\u0644.\u0633.\u200f","$ n","$n-",".",",",2,"3"],[]],
		"si-LK":[["LKR","\u0dbb\u0dd4.","$ n","($ n)",".",",",2,"3"],["-n"]],
		"iu-Cans-CA":[["CAD","$","$n","($n)",".",",",2,"30"],[]],
		"am-ET":[["ETB","ETB","$n","-$n",".",",",2,"30"],[]],
		"ne-NP":[["NPR","\u0930\u0941","$n","-$n",".",",",2,"3"],["-n"]],
		"fy-NL":[["EUR","\u20ac","$ n","$ -n",",",".",2,"3"],[]],
		"ps-AF":[["AFN","\u060b","$n","$n-","\u066b","\u066c",2,"3"],["n-"]],
		"fil-PH":[["PHP","PhP","$n","($n)",".",",",2,"3"],[]],
		"dv-MV":[["MVR","\u0783.","n $","n $-",".",",",2,"3"],[]],
		"ha-Latn-NG":[["NIO","N","$ n","$-n",".",",",2,"3"],[]],
		"yo-NG":[["NIO","N","$ n","$-n",".",",",2,"3"],[]],
		"quz-BO":[["BOB","$b","$ n","($ n)",",",".",2,"3"],[]],
		"nso-ZA":[["ZAR","R","$ n","$-n",".",",",2,"3"],[]],
		"ba-RU":[["RUB","\u04bb.","n $","-n $",",","\u00a0",2,"30"],[]],
		"lb-LU":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"kl-GL":[["DKK","kr.","$ n","$ -n",",",".",2,"30"],[]],
		"ig-NG":[["NIO","N","$ n","$-n",".",",",2,"3"],[]],
		"ii-CN":[["CNY","\u00a5","$n","$-n",".",",",2,"3"],["-n"]],
		"arn-CL":[["CLP","$","$ n","-$ n",",",".",2,"3"],[]],
		"moh-CA":[["CAD","$","$n","($n)",".",",",2,"3"],["-n"]],
		"br-FR":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"ug-CN":[["CNY","\u00a5","$n","$-n",".",",",2,"3"],[]],
		"mi-NZ":[["NZD","$","$n","-$n",".",",",2,"3"],[]],
		"oc-FR":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"co-FR":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"gsw-FR":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"sah-RU":[["RUB","\u0441.","n$","-n$",",","\u00a0",2,"3"],[]],
		"qut-GT":[["GTQ","Q","$n","($n)",".",",",2,"3"],[]],
		"rw-RW":[["RWF","RWF","$ n","$-n",",","\u00a0",2,"3"],[]],
		"wo-SN":[["XOF","XOF","n $","-n $",",","\u00a0",2,"3"],[]],
		"prs-AF":[["AFN","\u060b","$n","$n-",".",",",2,"3"],["n-"]],
		"gd-GB":[["GBP","\u00a3","$n","-$n",".",",",2,"3"],[]],
		"ar-IQ":[["IQD","\u062f.\u0639.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"zh-CN":[["CNY","\u00a5","$n","$-n",".",",",2,"3"],[]],
		"de-CH":[["CHF","Fr.","$ n","$-n",".","'",2,"3"],[]],
		"en-GB":[["GBP","\u00a3","$n","-$n",".",",",2,"3"],[]],
		"es-MX":[["MXN","$","$n","-$n",".",",",2,"3"],[]],
		"fr-BE":[["EUR","\u20ac","$ n","$ -n",",",".",2,"3"],[]],
		"it-CH":[["CHF","fr.","$ n","$-n",".","'",2,"3"],[]],
		"nl-BE":[["EUR","\u20ac","$ n","$ -n",",",".",2,"3"],[]],
		"nn-NO":[["NOK","kr","$ n","$ -n",",","\u00a0",2,"3"],[]],
		"pt-PT":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"sr-Latn-CS":[["CSD","Din.","n $","-n $",",",".",2,"3"],[]],
		"sv-FI":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"az-Cyrl-AZ":[["AZN","\u043c\u0430\u043d.","n $","-n $",",","\u00a0",2,"3"],[]],
		"dsb-DE":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"se-SE":[["SEK","kr","n $","-n $",",",".",2,"3"],["-n"]],
		"ga-IE":[["EUR","\u20ac","$n","-$n",".",",",2,"3"],[]],
		"ms-BN":[["BND","$","$n","($n)",",",".",0,"3"],[]],
		"uz-Cyrl-UZ":[["UZS","\u0441\u045e\u043c","n $","-n $",",","\u00a0",2,"3"],[]],
		"bn-BD":[["BDT","\u09f3","$ n","$ -n",".",",",2,"32"],[]],
		"mn-Mong-CN":[["CNY","\u00a5","$n","$-n",".",",",2,"30"],[]],
		"iu-Latn-CA":[["CAD","$","$n","($n)",".",",",2,"3"],["-n"]],
		"tzm-Latn-DZ":[["DZD","DZD","n $","-n $",".",",",2,"3"],["n-"]],
		"quz-EC":[["USD","$","$ n","($ n)",",",".",2,"3"],[]],
		"ar-EG":[["EGP","\u062c.\u0645.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"zh-HK":[["HKD","HK$","$n","($n)",".",",",2,"3"],[]],
		"de-AT":[["EUR","\u20ac","$ n","-$ n",",",".",2,"3"],[]],
		"en-AU":[["AUD","$","$n","-$n",".",",",2,"3"],[]],
		"es-ES":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"fr-CA":[["CAD","$","n $","(n $)",",","\u00a0",2,"3"],[]],
		"sr-Cyrl-CS":[["CSD","\u0414\u0438\u043d.","n $","-n $",",",".",2,"3"],[]],
		"se-FI":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"quz-PE":[["PEN","S/.","$ n","$ -n",".",",",2,"3"],[]],
		"ar-LY":[["LYD","\u062f.\u0644.\u200f","$n","$n-",".",",",3,"3"],["n-"]],
		"zh-SG":[["SGD","$","$n","($n)",".",",",2,"3"],[]],
		"de-LU":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"en-CA":[["CAD","$","$n","-$n",".",",",2,"3"],[]],
		"es-GT":[["GTQ","Q","$n","($n)",".",",",2,"3"],[]],
		"fr-CH":[["CHF","fr.","$ n","$-n",".","'",2,"3"],[]],
		"hr-BA":[["BAM","KM","n $","-n $",",",".",2,"3"],["- n"]],
		"smj-NO":[["NOK","kr","$ n","$ -n",",","\u00a0",2,"3"],[]],
		"ar-DZ":[["DZD","\u062f.\u062c.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"zh-MO":[["MOP","MOP","$n","($n)",".",",",2,"3"],[]],
		"de-LI":[["CHF","CHF","$ n","$-n",".","'",2,"3"],[]],
		"en-NZ":[["NZD","$","$n","-$n",".",",",2,"3"],[]],
		"es-CR":[["CRC","\u20a1","$n","($n)",",",".",2,"3"],[]],
		"fr-LU":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"bs-Latn-BA":[["BAM","KM","n $","-n $",",",".",2,"3"],[]],
		"smj-SE":[["SEK","kr","n $","-n $",",",".",2,"3"],["-n"]],
		"ar-MA":[["MAD","\u062f.\u0645.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"en-IE":[["EUR","\u20ac","$n","-$n",".",",",2,"3"],[]],
		"es-PA":[["PAB","B/.","$ n","($ n)",".",",",2,"3"],[]],
		"fr-MC":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"sr-Latn-BA":[["BAM","KM","n $","-n $",",",".",2,"3"],[]],
		"sma-NO":[["NOK","kr","$ n","$ -n",",","\u00a0",2,"3"],[]],
		"ar-TN":[["TND","\u062f.\u062a.\u200f","$ n","$n-",".",",",3,"3"],["n-"]],
		"en-ZA":[["ZAR","R","$ n","$-n",",","\u00a0",2,"3"],["-n"]],
		"es-DO":[["DOP","RD$","$n","($n)",".",",",2,"3"],[]],
		"sr-Cyrl-BA":[["BAM","\u041a\u041c","n $","-n $",",",".",2,"3"],[]],
		"sma-SE":[["SEK","kr","n $","-n $",",",".",2,"3"],["-n"]],
		"ar-OM":[["OMR","\u0631.\u0639.\u200f","$ n","$n-",".",",",3,"3"],["n-"]],
		"en-JM":[["JMD","J$","$n","-$n",".",",",2,"3"],[]],
		"es-VE":[["VEF","Bs. F.","$ n","$ -n",",",".",2,"3"],[]],
		"bs-Cyrl-BA":[["BAM","\u041a\u041c","n $","-n $",",",".",2,"3"],[]],
		"sms-FI":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"ar-YE":[["YER","\u0631.\u064a.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"en-029":[["USD","$","$n","-$n",".",",",2,"3"],[]],
		"es-CO":[["COP","$","$ n","($ n)",",",".",2,"3"],[]],
		"sr-Latn-RS":[["RSD","Din.","n $","-n $",",",".",2,"3"],[]],
		"smn-FI":[["EUR","\u20ac","n $","-n $",",","\u00a0",2,"3"],[]],
		"ar-SY":[["SYP","\u0644.\u0633.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"en-BZ":[["BZD","BZ$","$n","($n)",".",",",2,"30"],["-n"]],
		"es-PE":[["PEN","S/.","$ n","$ -n",".",",",2,"3"],[]],
		"sr-Cyrl-RS":[["RSD","\u0414\u0438\u043d.","n $","-n $",",",".",2,"3"],[]],
		"ar-JO":[["JOD","\u062f.\u0627.\u200f","$ n","$n-",".",",",3,"3"],["n-"]],
		"en-TT":[["TTD","TT$","$n","($n)",".",",",2,"30"],["-n"]],
		"es-AR":[["ARS","$","$ n","$-n",",",".",2,"3"],[]],
		"sr-Latn-ME":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"ar-LB":[["LBP","\u0644.\u0644.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"en-ZW":[["ZWL","Z$","$n","($n)",".",",",2,"3"],[]],
		"es-EC":[["USD","$","$ n","($ n)",",",".",2,"3"],[]],
		"sr-Cyrl-ME":[["EUR","\u20ac","n $","-n $",",",".",2,"3"],[]],
		"ar-KW":[["KWD","\u062f.\u0643.\u200f","$ n","$n-",".",",",3,"3"],["n-"]],
		"en-PH":[["PHP","Php","$n","($n)",".",",",2,"3"],[]],
		"es-CL":[["CLP","$","$ n","-$ n",",",".",2,"3"],[]],
		"ar-AE":[["AED","\u062f.\u0625.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"es-UY":[["UYU","$U","$ n","($ n)",",",".",2,"3"],[]],
		"ar-BH":[["BHD","\u062f.\u0628.\u200f","$ n","$n-",".",",",3,"3"],["n-"]],
		"es-PY":[["PYG","Gs","$ n","($ n)",",",".",2,"3"],[]],
		"ar-QA":[["QAR","\u0631.\u0642.\u200f","$ n","$n-",".",",",2,"3"],["n-"]],
		"en-IN":[["INR","Rs.","$ n","$ -n",".",",",2,"32"],[]],
		"es-BO":[["BOB","$b","$ n","($ n)",",",".",2,"3"],[]],
		"en-MY":[["MYR","RM","$n","($n)",".",",",2,"3"],[]],
		"es-SV":[["USD","$","$n","($n)",".",",",2,"30"],["-n"]],
		"en-SG":[["SGD","$","$n","($n)",".",",",2,"3"],[]],
		"es-HN":[["HNL","L.","$ n","$ -n",".",",",2,"30"],["-n"]],
		"es-NI":[["NIO","C$","$ n","($ n)",".",",",2,"30"],["-n"]],
		"es-PR":[["USD","$","$ n","($ n)",".",",",2,"30"],["-n"]],
		"es-US":[["USD","$","$n","($n)",".",",",2,"3"],["-n"]],

	        getCurrencyInfoForLocale: function (locale) {
	            var result = {};

	            var localeItem = globalLocalizer[locale];
	            var cur = ["USD", "$", "$n", "($n)", ".", ",", 2, "3"];

	            if (localeItem && (localeItem.length > 0) && localeItem[0]) {
	                cur = localeItem[0];
	            }

	            //unpack to readable format
	            result.currencyCode = cur[0];
	            result.currencySymbol = cur[1];
	            result.positivePattern = cur[2] || "n";
	            result.negativePattern = cur[3] || "-n";
	            result.decimalSeparator = cur[4];
	            result.groupSeparator = cur[5];
	            result.decimalDigits = cur[6];
	            result.groupSizes = ((cur[7] + "").split("")).map(function (a) { return parseInt(a, 10); }); //converting string like "320" to array [3,2,1]

	            return result;
	        },
	        getNumberInfoForLocale: function (locale) {
	            var localeItem = globalLocalizer[locale];
	            var num = ["-n", 3, ".", ","];
	            var cur = ["USD", "$", "$n", "($n)", ".", ",", 2, "3"];
	            var result = {};

	            if (localeItem && (localeItem.length > 0) && localeItem[0]) {
	                cur = localeItem[0];
	            }

	            if (localeItem && (localeItem.length > 1) && localeItem[1]) {
	                num = localeItem[1];
	            }

	            //unpack to readable format
	            result.negativePattern = num[0] || "-n";
	            result.decimalSeparator = num[2] || cur[4];
	            result.groupSeparator = num[3] || cur[5];
	            result.groupSizes = (((num[1] || cur[7]) + "").split("")).map(function (a) { return parseInt(a, 10); }); //converting string like "320" to array [3,2,1]

	            return result;
	        }
	    };

	    /// Function return value from array with provided index (even value is undefined) but if index is wrong - returns provided default vaule.
	    /// a - target array 
	    /// i - index of element ot get
	    /// d - default value if no such element in array
	    var getItemFromArray = function (a, i, d) {
	        return (!a || isNaN(i) || (i < 0)) ? d : (i < a.length) ? a[i] : d;
	    };

	    // Function checks name according to basic rfc4647 validation rules, with advanced validation of first sub-tag.
	    // It do not validate name against ISO 639-1, ISO 639-2, ISO 639-3 and ISO 639-5);
	    var isValidLocaleName = function (localeName) {
	        var rfc4647Basic = "^([A-Za-z]{2,3}|([xX])|([iI]))(-[A-Za-z0-9]{1,8})+$";
	        return (('' + localeName).match(rfc4647Basic) != null);
	    };


	    /// Internal function!
	    /// simplePattern - pattern that may have only '#', '0', and '-' as valued symbols
	    /// intValue - integer value to format
	    /// groupDevider - locale specific group devider.
	    /// neganiveSignSymbol - If pattern has "-" symbol it will be replaces with this string. For positive values should be empty string.
	    /// limitResultToPatternLength - if intValue can't fit to pattern (int is bigger) this parameter allow or truncate string or overflow pattern 
	    var formatSimpleIntInternal = function (simplePattern, intValue, groupDevider, neganiveSignSymbol, limitResultToPatternLength) {
	        var vArray = ("" + Math.abs(intValue)).split('');
	        var pArray = ("" + simplePattern).split('');
	        var valueIndex = vArray.length - 1;
	        var result = "";
	        //we can add it only with "next digit", not alone as ",000,001.1" is wrong. should be "000,001.1". so we only cache it not adding.
	        var cachedGroupDevider = '';

	        for (var i = (pArray.length - 1); i >= 0; i--) {
	            var patternChar = pArray[i];
	            switch (patternChar) {
	                case '0':
	                    result = getItemFromArray(vArray, valueIndex--, "0") + cachedGroupDevider + result;
	                    cachedGroupDevider = '';
	                    break;
	                case '#':
	                    var currentChar = getItemFromArray(vArray, valueIndex--, "");
	                    // adding cachedGroupDevider only in case we have anything to add except it.
	                    if (currentChar != "") {
	                        currentChar = currentChar + cachedGroupDevider;
	                    }
	                    result = currentChar + result;
	                    cachedGroupDevider = '';
	                    break;
	                case '-':
	                    result = neganiveSignSymbol + result;
	                    cachedGroupDevider = '';
	                    break;
	                case ',':
	                    cachedGroupDevider = groupDevider;
	                    break;
	                default:
	                    result = patternChar + result;
	                    cachedGroupDevider = '';
	            }
	        }
	        //if we are not limited to pattern Lenght - add all not added digits
	        if (!limitResultToPatternLength) {
	            for (var j = valueIndex; j >= 0; j--) {
	                result = getItemFromArray(vArray, j, "") + result;
	            }
	        }
	        return result;
	    };

	    /* pattern format
	    '0' - Digit
	    '#' - Digit, zero shows as absent
	    '.' - Decimal separator or monetary decimal separator
	    '-' - Minus sign
	    ',' - Grouping separator            
	    */
	    //in pattern "," is group separator, "." is decimal separator!!!

	    /// v - value
	    /// p - pattern
	    /// localeNumberInfo - object with localisation info
	    var formatDecimalInternal = function (v, p, localeNumberInfo) {
	        var reverseStirng = function (s) {
	            return s.split("").reverse().join("");
	        };

	        if (!p || isNaN(+v)) {
	            return v; //return as it is.
	        }
	        var negativeSign = (v < 0) ? '-' : ''; //process only abs(), and turn on flag.

	        //safe remove sign as Math.abs has some accuracy for very small floats
	        var valueParts = ('' + v).replace('-', '').split('.');
	        var vInt = (valueParts.length > 0) ? valueParts[0] : '';   // getting integer part. 
	        var vFract = (valueParts.length > 1) ? valueParts[1] : ''; // getting fractional part.

	        var resFract = ''; //fractional part result
	        var resInt = ''; //integer part result

	        //split pattern for fractional and integer pattern parts
	        var ma = p.split('.');
	        if (ma.length > 1) {
	            //ma[1] - decimal part pattern
	            var fractPatternReversed = reverseStirng("" + ma[1]);
	            var fractValueReversed = reverseStirng(vFract + "");
	            // 1) fractional part has no group deviders!
	            // 2) in some cases negative sign can ne placed in the end of number (after fractional part) so we passing it
	            var fractResultReversed = formatSimpleIntInternal(fractPatternReversed, fractValueReversed, '', negativeSign, true);
	            resFract = localeNumberInfo.decimalSeparator + reverseStirng(fractResultReversed);
	        }

	        if (ma.length > 0) {
	            //ma[0] - integer part pattern
	            resInt = formatSimpleIntInternal(ma[0], vInt, localeNumberInfo.groupSeparator, negativeSign, false);
	        }

	        var result = (resInt.length > 0) ? (resInt + resFract) : ((resFract.length > 0) ? resFract : 0);

	        //if value was negative and negative sign has not been set via pattern(during formatting) - set it according to locale pattern
	        if (negativeSign && (result.indexOf('-') == -1)) {
	            result = localeNumberInfo.negativePattern.replace('n', result);
	        }

	        return result;
	    };

	    // format a number into a locale specific decimal format.
	    String.formatDecimal = function (numberValue, localeName, pattern) {
	        if (!pattern) {
	            //in this case parameter named as localName can be pattern as bouth are optional parameters
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
	            localeName = locale; //localeName = "en-US"; 
	        }

	        if (!isValidLocaleName(localeName)) {
	            throw "Invalid locale name."; //todo: localize error message?
	        }

	        var numberInfo = globalLocalizer.getNumberInfoForLocale(localeName);

	        // if no pattern in parameters - create "default pattern" based on localizer's data
	        if (!pattern) {
			//to unify we just generating custom pattern if no one provided. like ###.###.###.###.###.###.###.###.###.###,#####################
	        	//acording to numberInfo.groupSizes
			pattern = generatePatternFromDotNetNotation(numberInfo.groupSizes);
	        }

	        return formatDecimalInternal(numberValue, pattern, numberInfo);
	    };

	    /// based on http://msdn.microsoft.com/en-us/library/system.globalization.numberformatinfo.numbergroupsizes.aspx
	    var generatePatternFromDotNetNotation = function (groupSizes, maxDigitsInPattern) {
	        var gIndex = 0;

	        var digitsBeforeSign = maxDigitsInPattern || 20;
	        var digitsAfterSign = maxDigitsInPattern || 20;

	        var allGroups = [];
	        //converting Micorsoft's notation to pattern
	        while (0 < digitsBeforeSign) {
	            var currentGroupSize = (groupSizes[gIndex++] || 0) || digitsBeforeSign;
	            allGroups.unshift((new Array(currentGroupSize + 1)).join('#'));
	            digitsBeforeSign -= currentGroupSize;

	            if (groupSizes.length >= gIndex) {
	                gIndex = groupSizes.length - 1;
	            }
	        }
	        return allGroups.join(',') + '.' + (new Array(digitsAfterSign + 1)).join('#');
	    };

	    var formatCurrencyInternal = function (value, targetLocale) {
	        if (!isFinite(value)) {
	            return value;
	        }

	        var number = Math.abs(value);
	        var formatInfo = globalLocalizer.getCurrencyInfoForLocale(targetLocale);
	        number = formatDecimalInternal(number, generatePatternFromDotNetNotation(formatInfo.groupSizes), formatInfo);

	        var pattern = (value < 0) ? formatInfo.negativePattern : formatInfo.positivePattern;
	        var patternParts = /n|\$|-|%/g;
	        var res = '';

	        for (; ; ) {
	            var index = patternParts.lastIndex;
	            var ar = patternParts.exec(pattern);

	            res += pattern.slice(index, ar ? ar.index : pattern.length);

	            if (!ar) {
	                break;
	            }

	            switch (ar[0]) {
	                case 'n':
	                    res += number;
	                    break;
	                case '$':
	                    res += formatInfo.currencySymbol;
	                    break;
	                case '-':
	                    // 0 can't be negative
	                    if (/[1-9]/.test(number)) {
	                        res += (value < 0) ? '-' : '';
	                    }
	                    break;
	            }
	        }

	        return res;
	    };
	    
	    // format a date into a locale specific date format. Optionally pass a second argument (string) as either "short" (default), "medium" or "long" for controlling the date format.
	    String.formatDate = function (dt, fmt) {
	        API.debug('Method "String.formatDate" is not implemented yet.');
	        return dt.toString();
	    };

	    // format a date into a locale specific time format.
	    String.formatTime = function (dt) {
	        return dt.toLocaleTimeString();
	    };

	    // format a number into a locale specific currency format. TagretLocale i soptional and only for mobileWeb and Tizen
	    String.formatCurrency = function (amt, tagretLocale) {
	        return formatCurrencyInternal(amt, tagretLocale || locale) || amt;
	    };

	    return lang.setObject("Ti.Locale", Evented, {

	        constants: {
	            currentCountry: languageParts[1] || "",
	            currentLanguage: languageParts[0] || "",
	            currentLocale: locale
	        },

	        formatTelephoneNumber: function (s) {
	            return s;
	        },

	        // locale = "en-US" => "USD"
	        getCurrencyCode: function (locale) {
	            var result = ""; // or use "USD" as default?
	            var currencyElment = globalLocalizer[locale];
	            if (currencyElment && currencyElment[0]) {
	                result = "" + currencyElment[0][0];
	            }
	            return result;
	        },

	        // currencyCode = "USD" => "$"
	        getCurrencySymbol: function (currencyCode) {
	            var targetCode = currencyCode.toUpperCase();
	            var result = "$";
	            for (var index in globalLocalizer) {
	                var currencyElment = globalLocalizer[index];
	                if (currencyElment && currencyElment[0]) {
	                    if (("" + currencyElment[0][0]).toUpperCase() == targetCode) {
	                        result = currencyElment[0][1] + "";
	                        break;
	                    }
	                }
	            }
	            return result;
	        },

	        // locale = "en-US" => "$"
	        getLocaleCurrencySymbol: function (locale) {
	            var result = ""; // or use "$" as default?
	            var currencyElment = globalLocalizer[locale];
	            if (currencyElment && currencyElment[0]) {
	                result = "" + currencyElment[0][1];
	            }
	            return result;
	        },

	        getString: getString,

	        _getString: function (key, hint) {
	            return lang.val(hint, getString(key, hint));
	        }
	    });
	});