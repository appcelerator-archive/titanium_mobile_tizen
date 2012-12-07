package com.appcelerator.tizen.signapp;

import java.util.HashMap;
import java.util.Map;

/**
 * Parse command line parameters, use default values if no params See appache
 * samples for original version
 * https://svn.apache.org/repos/asf/santuario/xml-security
 * -java/trunk/samples/org
 * /apache/xml/security/samples/signature/CreateSignature.java
 */
public class InputProccesor {

	private static final String PROJECT_PATH_INPUT = "-sig_proj";
	private static final String CERT_FILE_PATH_INPUT = "-cert";
	private static final String KEYSTORE_TYPE_INPUT = "-storetype";
	private static final String STORE_PASS_INPUT = "-storepass";
	private static final String ALIAS_INPUT = "-alias";
	private static final String KEY_PASS_INPUT = "-keypass";

	private static final String CERT_FILE_PATH_DEFAULT = "com/appcelerator/tizen/signapp/samsung.devmode.sdk.cert.p12";
	private static final String KEYSTORE_TYPE_DEFAULT = "pkcs12";
	private static final String KEYSTORE_PASS_DEFAULT = "1234";
	//have no any affect
	private static final String ALIAS_INPUT_DEFAULT = "1";
	private static final String KEY_PASS_INPUT_DEFAULT = "1234";

	Map<String, String> inputMap;

	static private Map<String, String> defaultInputMap = new HashMap<String, String>();
	static {
		defaultInputMap.put(PROJECT_PATH_INPUT, "/");
		defaultInputMap.put(CERT_FILE_PATH_INPUT, CERT_FILE_PATH_DEFAULT);
		defaultInputMap.put(KEYSTORE_TYPE_INPUT, KEYSTORE_TYPE_DEFAULT);
		defaultInputMap.put(STORE_PASS_INPUT, KEYSTORE_PASS_DEFAULT);
		defaultInputMap.put(ALIAS_INPUT, ALIAS_INPUT_DEFAULT);
		defaultInputMap.put(KEY_PASS_INPUT, KEY_PASS_INPUT_DEFAULT);
	}

	public void showErrorOnConsole() throws WrongInputException {
		System.err.println("You enter wrong parameters. " +
				" Use:\n" +
				"sig_proj D:\\work\\env\\libs\\temp\\ \n"+
				"or\n"+
				"-sig_proj D:\\work\\env\\libs\\temp\\ -cert D:\\work\\project\\workspaces\\titanium-2\\titanium_mobile_tizen\\utils\\SignApp\\src\\com\\appcelerator\\tizen\\signapp\\samsung.devmode.sdk.cert.p12 -storetype pkcs12 -storepass 1234 -alias 1 -keypass 1234");
		throw new WrongInputException();
	}

	public void proccesInputData(String[] consoleArg)
			throws WrongInputException {

		if (consoleArg == null || consoleArg.length == 0)
			showErrorOnConsole();

		if (consoleArg.length == 1) {
			inputMap = new HashMap<String, String>(defaultInputMap);
			inputMap.put(PROJECT_PATH_INPUT, consoleArg[0]);
		} else if (consoleArg.length == 2) {
			inputMap = new HashMap<String, String>(defaultInputMap);
			inputMap.put(PROJECT_PATH_INPUT, consoleArg[1]);
		} else {
			inputMap = new HashMap<String, String>();
			for (int i = 0; i < consoleArg.length; i = i + 2) {
				if (!defaultInputMap.containsKey(consoleArg[i]))
					showErrorOnConsole();
				inputMap.put(consoleArg[i], consoleArg[i + 1]);
			}
		}
		projectPathResolver();
		validate();
	}

	private void validate() throws WrongInputException {
		if (inputMap.get(PROJECT_PATH_INPUT) == null)
			showErrorOnConsole();
		for (String keyparam : defaultInputMap.keySet()) {
			if (inputMap.get(keyparam) == null)
				showErrorOnConsole();
		}
	}

	private void projectPathResolver() {
		String projectPath = inputMap.get(PROJECT_PATH_INPUT);
		if (projectPath != null && !projectPath.endsWith("/")
				&& !projectPath.endsWith("\\")) {
			String newProjectPath = projectPath.concat("\\");
			inputMap.put(PROJECT_PATH_INPUT, newProjectPath);
		}
	}

	public String getPathToProject() {
		return inputMap.get(PROJECT_PATH_INPUT);
	}

	public String getKeystoreType() {
		return inputMap.get(KEYSTORE_TYPE_INPUT);
	}

	public String getCertPath() {
		return inputMap.get(CERT_FILE_PATH_INPUT);
	}

	public String getKeystorePass() {
		return inputMap.get(STORE_PASS_INPUT);
	}

	public String getAlias() {
		return inputMap.get(ALIAS_INPUT);
	}

	public String getKeyPass() {
		return inputMap.get(KEY_PASS_INPUT);
	}
}
