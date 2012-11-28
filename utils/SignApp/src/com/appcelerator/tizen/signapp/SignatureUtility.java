package com.appcelerator.tizen.signapp;
/*
 * Original version for this file comes from Tizen git, we just slight modified it
 *
 * Web IDE - sign
 * 
 * Copyright (C) 2000 - 2011 Samsung Electronics Co., Ltd. All rights reserved.
 *
 * Contact: 
 * Jihoon Song <jihoon80.song@samsung.com>
 * Kangho Kim <kh5325.kim@samsung.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Contributors:
 * - S-Core Co., Ltd

 */



import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class SignatureUtility {

	private static final String WIDGET_FILE_EXTENSION = ".WGT";


	public static final String EMPTY_STRING = "";

	public static String AUTHOR_SIGNATURE = "author-signature.xml"; //$NON-NLS-1$
	public static String DISTRIBUTOR_SIGNATURE_PREFIX = "signature"; //$NON-NLS-1$
	public static String DISTRIBUTOR_SIGNATURE_POSTFIX = ".xml"; //$NON-NLS-1$

	public static boolean checkForSignatureFile(String name) {
		if (checkForAuthorSignatureFile(name)) {
			return true;
		}
		return checkForDistributorSignatureFile(name);
	}

	public static boolean checkForAuthorSignatureFile(String name) {
		return name.compareTo(AUTHOR_SIGNATURE) == 0;
	}

	public static boolean checkForDistributorSignatureFile(String name) {
		String firstRegex = "(1|2|3|4|5|6|7|8|9)"; //$NON-NLS-1$
		String secondRegex = "(\\d)*" + DISTRIBUTOR_SIGNATURE_POSTFIX; //$NON-NLS-1$
		String wholeGroup = "(" + DISTRIBUTOR_SIGNATURE_PREFIX + firstRegex + secondRegex + ")"; //$NON-NLS-1$ //$NON-NLS-2$

		Pattern pattern = Pattern.compile(wholeGroup);
		Matcher matcher = pattern.matcher(name);
		return matcher.matches();
	}

	public static boolean checkForWgtPackage(String fileName) {
		
		return (fileName != null && fileName.toUpperCase().endsWith(WIDGET_FILE_EXTENSION));
	}

}