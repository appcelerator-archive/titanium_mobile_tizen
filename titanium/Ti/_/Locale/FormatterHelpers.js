define(function() {
	// Function return value from array with provided index (even value is undefined) but if index is wrong - returns provided default vaule.
	// a - target array
	// i - index of element ot get
	// d - default value if no such element in array
	function getItemFromArray (a, i, d) {
		return (!a || isNaN(i) || (i < 0)) ? d : (i < a.length) ? a[i] : d;
	};

	// Internal function!
	// simplePattern - pattern that may have only '#', '0', and '-' as valued symbols
	// intValue - integer value to format
	// groupDevider - locale specific group devider.
	// negativeSignSymbol - If pattern has "-" symbol it will be replaces with this string. For positive values should be empty string.
	// limitResultToPatternLength - if intValue can't fit to pattern (int is bigger) this parameter allow or truncate string or overflow pattern
	function formatSimpleInteger(simplePattern, intValue, groupDevider, negativeSignSymbol, limitResultToPatternLength) {
		var vArray = ('' + Math.abs(intValue)).split(''),
		    pArray = ('' + simplePattern).split(''),
		    valueIndex = vArray.length - 1,
		    result = '',
			patternChar,
			i,
			cachedGroupDevider = ''; //we can add it only with "next digit", not alone as ",000,001.1" is wrong. should be "000,001.1". so we only cache it not adding.

		for (i = (pArray.length - 1); i >= 0; i--) {
			patternChar = pArray[i];
			switch (patternChar) {
				case '0':
					result = getItemFromArray(vArray, valueIndex--, '0') + cachedGroupDevider + result;
					cachedGroupDevider = '';
					break;
				case '#':
					var currentChar = getItemFromArray(vArray, valueIndex--, '');
					// adding cachedGroupDevider only in case we have anything to add except it.
					if (currentChar != '') {
						currentChar = currentChar + cachedGroupDevider;
					}
					result = currentChar + result;
					cachedGroupDevider = '';
					break;
				case '-':
					result = negativeSignSymbol + result;
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
				result = getItemFromArray(vArray, j, '') + result;
			}
		}
		return result;
	};

	// pattern format
	// '0' - Digit
	// '#' - Digit, zero shows as absent
	// '.' - Decimal separator or monetary decimal separator
	// '-' - Minus sign
	// ',' - Grouping separator
	// in pattern "," is group separator, "." is decimal separator!

	// v - value
	// p - pattern
	// localeNumberInfo - object with localisation info
	function formatDecimalInternal(v, p, localeNumberInfo) {
		function reverseString(s) {
			return s.split('').reverse().join('');
		};

		if (!p || isNaN(+v)) {
			return v; //return as it is.
		}

		var negativeSign = (v < 0) ? '-' : '', //process only abs(), and turn on flag.
			valueParts = ('' + v).replace('-', '').split('.'),  //safe remove sign as Math.abs has some accuracy for very small floats
			vInt = valueParts[0] || '',   // getting integer part.
			vFract = valueParts[1] || '', // getting fractional part.
			resFract = '', //fractional part result
			resInt = '', //integer part result
			ma = p.split('.'); //split pattern for fractional and integer pattern parts

		if (ma.length > 1) {
			//ma[1] - decimal part pattern
			var fractPatternReversed = reverseString('' + ma[1]),
				fractValueReversed = reverseString('' + vFract),
				// 1) fractional part has no group deviders!
				// 2) in some cultures negative sign can be placed in the end of number (after fractional part) so we are passing it
			    fractResultReversed = formatSimpleInteger(fractPatternReversed, fractValueReversed, '', negativeSign, true);
			resFract = localeNumberInfo.decimalSeparator + reverseString(fractResultReversed);
		}

		if (ma.length > 0) {
			//ma[0] - integer part pattern
			resInt = formatSimpleInteger(ma[0], vInt, localeNumberInfo.groupSeparator, negativeSign, false);
		}

		var result = (resInt.length > 0) ? (resInt + resFract) : ((resFract.length > 0) ? resFract : 0);

		//if value was negative and negative sign has not been set via pattern(during formatting) - set it according to locale pattern
		if (negativeSign && (result.indexOf('-') == -1)) {
			result = localeNumberInfo.negativePattern.replace('n', result);
		}

		return result;
	};

	// based on http://msdn.microsoft.com/en-us/library/system.globalization.numberformatinfo.numbergroupsizes.aspx
	function generatePatternFromGroupSizes(groupSizes, maxDigitsInPattern) {
		var gIndex = 0,
			digitsBeforeSign = maxDigitsInPattern || 20,
			digitsAfterSign = maxDigitsInPattern || 20,
			allGroups = [];

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

	// formats provided value as currency
	function formatCurrencyInternal(value, currencyFormatInfo) {
		if (!isFinite(value)) {
			return value;
		}

		var number = Math.abs(value),
			pattern = (value < 0) ? currencyFormatInfo.negativePattern : currencyFormatInfo.positivePattern,
			patternParts = /n|\$|-|%/g,
			res = '';

		number = formatDecimalInternal(number, generatePatternFromGroupSizes(currencyFormatInfo.groupSizes), currencyFormatInfo);

		for (; ; ) {
			var index = patternParts.lastIndex,
				ar = patternParts.exec(pattern);

			res += pattern.slice(index, ar ? ar.index : pattern.length);

			if (!ar) {
				break;
			}

			switch (ar[0]) {
				case 'n':
					res += number;
					break;
				case '$':
					res += currencyFormatInfo.currencySymbol;
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

	// value - js Date object.
	// format - mask for date\time (like: dd-MM-yy, HH:mm:ss e.t.c. )
	// cal - localized calendar object from Titanium localeStorage
	function formatDateInternal( value, format, cal) {
		if ( !cal || !format || !format.length) {
			return (value)?value.toString():'';
		}

		// Start with an empty string
		var ret = [],
			hour,
			part,
			zeros = [ '0', '00', '000' ],
			foundDay,
			checkedDay,
			dayPartRegExp = /([^d]|^)(d|dd)([^d]|$)/g,
			quoteCount = 0,
			tokenRegExp = getTokenRegExp();

		function padZeros( num, c ) {
			var r, s = num + '';
			if ( c > 1 && s.length < c ) {
				r = ( zeros[c - 2] + s);
				return r.substr( r.length - c, c );
			}
			else {
				r = s;
			}
			return r;
		}

		function hasDay() {
			if ( foundDay || checkedDay ) {
				return foundDay;
			}
			foundDay = dayPartRegExp.test( format );
			checkedDay = true;
			return foundDay;
		}

		function getPart( date, part ) {
			switch ( part ) {
				case 0:
					return date.getFullYear();
				case 1:
					return date.getMonth();
				case 2:
					return date.getDate();
				default:
					throw 'Invalid part value ' + part;
			}
		}

		function getTokenRegExp() {
			// regular expression for matching date and time tokens in format strings.
			return (/\/|dddd|ddd|dd|d|MMMM|MMM|MM|M|yyyy|yy|y|hh|h|HH|H|mm|m|ss|s|tt|t|fff|ff|f|zzz|zz|z|gg|g/g);
		};

		function appendPreOrPostMatch( preMatch, strings ) {
			// appends pre- and post- token match strings while removing escaped characters.
			// Returns a single quote count which is used to determine if the token occurs in a string literal.
			var quoteCount = 0,
				escaped = false,
				i,
				c;

			for (i = 0, il = preMatch.length; i < il; i++ ) {
				c = preMatch.charAt( i );
				switch ( c ) {
					case "\'":
						if ( escaped ) {
							strings.push( "\'" );
						}
						else {
							quoteCount++;
						}
						escaped = false;
						break;
					case '\\':
						if ( escaped ) {
							strings.push( '\\' );
						}
						escaped = !escaped;
						break;
					default:
						strings.push( c );
						escaped = false;
						break;
				}
			}
			return quoteCount;
		};

		for ( ; ; ) {
			// Save the current index
			var index = tokenRegExp.lastIndex,
				// Look for the next pattern
				ar = tokenRegExp.exec( format),
				// Append the text before the pattern (or the end of the string if not found)
				preMatch = format.slice( index, ar ? ar.index : format.length );

			quoteCount += appendPreOrPostMatch( preMatch, ret );

			if ( !ar ) {
				break;
			}

			// do not replace any matches that occur inside a string literal.
			if ( quoteCount % 2 ) {
				ret.push( ar[0] );
				continue;
			}

			var current = ar[ 0 ],
				clength = current.length;

			switch ( current ) {
				case 'ddd':  //Day of the week, as a three-letter abbreviation
				case 'dddd': // Day of the week, using the full name
					var names = ( clength === 3 ) ? cal.days.namesAbbr : cal.days.names;
					ret.push( names[value.getDay()] );
					break;
				case 'd':  // Day of month, without leading zero for single-digit days
				case 'dd': // Day of month, with leading zero for single-digit days
					foundDay = true;
					ret.push(
						padZeros( getPart(value, 2), clength )
					);
					break;
				case 'MMM':  // Month, as a three-letter abbreviation
				case 'MMMM': // Month, using the full name
					var name = (clength === 3) ? 'namesAbbr' : 'names';
						names = cal.monthsGenitive && hasDay()?cal.monthsGenitive[name]:cal.months[name];
					ret.push( names[getPart( value, 1 )]);
					break;
				case 'M':  // Month, as digits, with no leading zero for single-digit months
				case 'MM': // Month, as digits, with leading zero for single-digit months
					ret.push(
						padZeros( getPart(value, 1) + 1, clength )
					);
					break;
				case 'y':    // Year, as two digits, but with no leading zero for years less than 10
				case 'yy':   // Year, as two digits, with leading zero for years less than 10
				case 'yyyy': // Year represented by four full digits
					part = value.getFullYear();
					if ( clength < 4 ) {
						part = part % 100;
					}
					ret.push(
						padZeros( part, clength )
					);
					break;
				case 'h':   // Hours with no leading zero for single-digit hours, using 12-hour clock
				case 'hh':  // Hours with leading zero for single-digit hours, using 12-hour clock
					hour = value.getHours() % 12;
					if ( hour === 0 ) hour = 12;
					ret.push(
						padZeros( hour, clength )
					);
					break;
				case 'H':  // Hours with no leading zero for single-digit hours, using 24-hour clock
				case 'HH': // Hours with leading zero for single-digit hours, using 24-hour clock
					ret.push(
						padZeros( value.getHours(), clength )
					);
					break;
				case 'm':  // Minutes with no leading zero for single-digit minutes
				case 'mm': // Minutes with leading zero for single-digit minutes
					ret.push(
						padZeros( value.getMinutes(), clength )
					);
					break;
				case 's':  // Seconds with no leading zero for single-digit seconds
				case 'ss': // Seconds with leading zero for single-digit seconds
					ret.push(
						padZeros( value.getSeconds(), clength )
					);
					break;
				case 't':  // One character am/pm indicator ("a" or "p")
				case 'tt': // Multicharacter am/pm indicator
					part = (value.getHours() < 12 ? cal.AM  : cal.PM) || ' ';
					ret.push( clength === 1 ? part.charAt(0) : part );
					break;
				case 'f':   // Deciseconds
				case 'ff':  // Centiseconds
				case 'fff': // Milliseconds
					ret.push(
						padZeros( value.getMilliseconds(), 3 ).substr( 0, clength )
					);
					break;
				case 'z':  // Time zone offset, no leading zero
				case 'zz': // Time zone offset with leading zero
					hour = value.getTimezoneOffset() / 60;
					ret.push(
						( hour <= 0 ? '+' : '-' ) + padZeros( Math.floor(Math.abs(hour)), clength )
					);
					break;
				case 'zzz': // Time zone offset with leading zero
					hour = value.getTimezoneOffset() / 60;
					ret.push(
						( hour <= 0 ? '+' : '-' ) + padZeros( Math.floor(Math.abs(hour)), 2 ) +
							// Hard coded ":" separator, rather than using cal.TimeSeparator
							// Repeated here for consistency, plus ":" was already assumed in date parsing.
							':' + padZeros( Math.abs(value.getTimezoneOffset() % 60), 2 )
					);
					break;
				case 'g':
				case 'gg':
					//todo: do we need it at all? Fro now skipped.
					break;
				case '/':
					ret.push( cal['/'] );
					break;
				default:
					throw 'Invalid date format pattern \"' + current + '\".';
			}
		}
		return ret.join('');
	};

	return {
		formatDecimal: formatDecimalInternal,
		generatePatternFromGroupSizes: generatePatternFromGroupSizes,
		formatCurrency: formatCurrencyInternal,
		formatDate: formatDateInternal
	};
});