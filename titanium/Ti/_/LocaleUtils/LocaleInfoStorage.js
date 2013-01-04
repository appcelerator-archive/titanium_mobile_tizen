define(function() {

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
		"es-US":[["USD","$","$n","($n)",".",",",2,"3"],["-n"]]
	};


	function getCurrencyInfoByLocaleInternal(locale) {
		var result = {},
			cur = ["USD", "$", "$n", "($n)", ".", ",", 2, "3"],
			localeItem = globalLocalizer[locale];

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
	};

	function getCurrencyInfoByCodeInternal(currencyCode) {
		var targetCode = currencyCode.toUpperCase(),
			locale = "en-US",
			result = {},
			cur = ["USD", "$", "$n", "($n)", ".", ",", 2, "3"];

		for (var index in globalLocalizer) {
			var currencyElement = globalLocalizer[index];
			if (currencyElement && currencyElement[0]) {
				if (("" + currencyElement[0][0]).toUpperCase() == targetCode) {
					cur = currencyElement[0]
					break;
				}
			}
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
	};

	function getNumberInfoForLocaleInternal(locale) {
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

	return {
		getNumberInfoForLocale: function (locale) {
			return getNumberInfoForLocaleInternal(locale);
		},
		getCurrencyInfoByLocale: function (locale) {
			return getCurrencyInfoByLocaleInternal(locale);
		},
		getCurrencyInfoByCode: function (currencyCode) {
			return getCurrencyInfoByCodeInternal(currencyCode);
		},
		getCalendarByLocale: function (locale) {
			//TODO: STUB!!!
			return {"/": "/", ":": ":", AM: "AM", PM: "PM",
				days: {
					names: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
					namesAbbr: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ]
				},
				months: {
					names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
					namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
				},
				monthsGenitive: {
					names: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "" ],
					namesAbbr: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "" ]
				},
				patterns: {
					d: "M/d/yyyy",
					D: "dddd, MMMM dd yyyy",
					t: "h:mm tt",
					T: "h:mm:ss tt"
				}
			}
		}

	}
});