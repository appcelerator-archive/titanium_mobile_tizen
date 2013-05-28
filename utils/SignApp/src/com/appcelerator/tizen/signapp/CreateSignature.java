package com.appcelerator.tizen.signapp;

import java.io.OutputStream;
import java.io.PrintWriter;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.GnuParser;
import org.apache.commons.cli.HelpFormatter;
import org.apache.commons.cli.Option;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;
import org.tizen.common.sign.signer.TizenSigner;

public class CreateSignature {

	public static void main(String[] args) {
		
		Options options = buildCliOptions();
		String tizenDir = "";
		String targetDir = "";
		String authorP12 = "";
		String authorP12pwd = "";
		String authorCA = "";
		String rootCA = "";
		
		if (args.length < 1) {
			printHelp(options, 80, "Signer utility parameters:", null, 3, 5,
					true, System.out);
		}

		final CommandLineParser cmdLineGnuParser = new GnuParser();
		CommandLine commandLine;

		try {
			commandLine = cmdLineGnuParser.parse(options, args);
			if (commandLine.hasOption("h")) {
				printHelp(options, 80, "Signer utility parameters:", null, 3,
						5, true, System.out);
			}
			
			if(commandLine.hasOption("s")){
				tizenDir = commandLine.getOptionValue("s");
			} else {
				//it is mandatory parameter, cannot continue without it
				System.out.println("mandatory 'sdk' parameter is absent.");
				printHelp(options, 80, "Signer utility parameters:", null, 3, 5,
						true, System.out);
				return;
			}			

			if(commandLine.hasOption("t")){
				targetDir = commandLine.getOptionValue("t");
			} else {
				//it is mandatory parameter, cannot continue without it
				System.out.println("mandatory 'target' parameter is absent.");
				printHelp(options, 80, "Signer utility parameters:", null, 3, 5,
						true, System.out);
				return;
			}			
			
			authorP12 = commandLine.getOptionValue("a", "");
			authorP12pwd = commandLine.getOptionValue("p", "");
			authorCA = commandLine.getOptionValue("c", "");
			rootCA = commandLine.getOptionValue("r", "");			
			

			if(authorP12.isEmpty() && authorP12pwd.isEmpty() && authorCA.isEmpty()){
				//use default  certificate instead of provided by user for authors signature
				authorP12 = tizenDir + "/tools/ide/sample/samsung.devmode.sdk.cert.p12"; //"com/appcelerator/tizen/signapp/samsung.devmode.sdk.cert.p12";
				authorP12pwd = "1234";
				authorCA = tizenDir + "/tools/certificate-generator/certificates/developer/tizen-developer-ca.cer";
				rootCA = "";
			}

		} catch (ParseException parseException) {
			System.err
					.println("Encountered exception while parsing using GnuParser:\n"
							+ parseException.getMessage());
		}

		try {
			TizenSigner.authorSign(targetDir, 
				authorP12, 
				authorP12pwd, 
				authorCA, 
				rootCA);
			
			TizenSigner.distSign(targetDir, 
				tizenDir + "/tools/certificate-generator/patches/partner/certificates/tizen-distributor-signer.p12", 
				"tizenpkcs12passfordsigner",
				tizenDir + "/tools/certificate-generator/patches/partner/certificates/tizen-distributor-signer.cer", 
				tizenDir + "/tools/certificate-generator/patches/partner/certificates/tizen-distributor-ca.cer",
				1);
		} catch (Exception e) {
			e.printStackTrace();
		}			
	}
	
	private static Options buildCliOptions() {
		Options options = new Options();
		
		Option tizenDir = new Option( "s", "sdk", true, "Tizen SDK directory" );
		options.addOption(tizenDir);
		
		Option targetDir = new Option( "t", "target", true, "target directory" );
		options.addOption(targetDir);
		
		Option authorP12 = new Option( "a", "authorp12", true, "author certificate");
		options.addOption(authorP12);
		
		Option authorP12pwd = new Option( "p", "authorpwd", true, "password for author certificate");
		options.addOption(authorP12pwd);
		
		Option authorCA = new Option( "c", "authorca", true, "author certificate authority path");
		options.addOption(authorCA);
		
		Option rootCA = new Option( "r", "rootca", true, "root certificate authority path, optional");
		options.addOption(rootCA);
		
		Option help = new Option( "h", "help", false, "print usage");
		options.addOption(help);
		return options;
	}
	
	public static void printUsage(  
			final String applicationName,  
			final Options options,  
			final OutputStream out) {  
		final PrintWriter writer = new PrintWriter(out);  
		final HelpFormatter usageFormatter = new HelpFormatter();  
		usageFormatter.printUsage(writer, 80, applicationName, options);  
		writer.close();  
	}
	
	public static void printHelp(final Options options,
			final int printedRowWidth, final String header,
			final String footer, final int spacesBeforeOption,
			final int spacesBeforeOptionDescription,
			final boolean displayUsage, final OutputStream out) {
		final String commandLineSyntax = "java -cp <requried jars>";
		final PrintWriter writer = new PrintWriter(out);
		final HelpFormatter helpFormatter = new HelpFormatter();
		helpFormatter.printHelp(writer, printedRowWidth, commandLineSyntax,
				header, options, spacesBeforeOption,
				spacesBeforeOptionDescription, footer, displayUsage);
		writer.close();
	} 	
}
