package com.appcelerator.tizen.signapp;

/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements. See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership. The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

import org.apache.xml.security.signature.XMLSignature;
import org.apache.xml.security.signature.XMLSignatureException;
import org.apache.xml.security.utils.Constants;
import org.apache.xml.security.utils.ElementProxy;
import org.apache.xml.security.utils.XMLUtils;

/**
 * @author $Author: coheigea $
 */
public class CreateSignature {

	/** {@link org.apache.commons.logging} logging facility */
	static org.apache.commons.logging.Log log = org.apache.commons.logging.LogFactory
			.getLog(CreateSignature.class.getName());

	static {
		org.apache.xml.security.Init.init();
	}

	/**
	 * Method main
	 * 
	 * @param unused
	 * @throws Exception
	 */
	public static void main(String argth[]) throws Exception {
		try {
			InputProccesor inputParams = new InputProccesor();
			inputParams.proccesInputData(argth);

			ElementProxy.setDefaultPrefix(Constants.SignatureSpecNS, "gl");

			// Initialise input values
			String pathToProject = inputParams.getPathToProject();

			// All the parameters for the keystore

			String keystorePass = inputParams.getKeystorePass();
			String privateKeyAlias = inputParams.getAlias();
			String privateKeyPass = inputParams.getKeyPass();
			String certificateAlias = inputParams.getAlias();
			File signatureFile = new File(pathToProject + "signature1.xml");

			KeyStore ks = KeyStore.getInstance(inputParams.getKeystoreType());
			InputStream fis = InputProccesor.class.getClassLoader().getResourceAsStream(inputParams.getCertPath());
			// FileInputStream fis = new FileInputStream(inputParams.getCertPath());

			// load the keystore
			ks.load(fis, keystorePass.toCharArray());

			PrivateKey privateKey = null;
	                java.util.Enumeration<String> alias = ks.aliases();
	                while (alias.hasMoreElements()) {
	                    String recievedAliasEntry = alias.nextElement();
	                    if (ks.isKeyEntry(recievedAliasEntry)) {
	                        privateKeyAlias = recievedAliasEntry;

	                        privateKey = (PrivateKey)ks.getKey(recievedAliasEntry, privateKeyPass.toCharArray());
	                    }
	                }			
	                if(privateKey == null){
			// get the private key for signing.
	                    privateKey = (PrivateKey) ks.getKey(privateKeyAlias,privateKeyPass.toCharArray());
	                }
	                
			javax.xml.parsers.DocumentBuilderFactory dbf = javax.xml.parsers.DocumentBuilderFactory
					.newInstance();

			// XML Signature needs to be namespace aware
			dbf.setNamespaceAware(true);

			javax.xml.parsers.DocumentBuilder db = dbf.newDocumentBuilder();
			org.w3c.dom.Document doc = db.newDocument();

			// Build a sample document. It will look something like:
			// <!-- Comment before -->
			// <apache:RootElement
			// xmlns:apache="http://www.apache.org/ns/#app1">Some simple text
			// </apache:RootElement>

			// The BaseURI is the URI that's used to prepend to relative URIs
			String BaseURI = signatureFile.toURI().toURL().toString();
			// Create an XML Signature object from the document, BaseURI and
			// signature algorithm (in this case DSA)
			XMLSignature sig = new XMLSignature(doc, BaseURI,
					XMLSignature.ALGO_ID_SIGNATURE_RSA_SHA256);
			

			// Append the signature element to the root element before signing
			// because
			// this is going to be an enveloped signature.
			// This means the signature is going to be enveloped by the
			// document.
			// Two other possible forms are enveloping where the document is
			// inside
			// the
			// signature and detached where they are seperate.
			// Note that they can be mixed in 1 signature with seperate
			// references
			// as
			// shown below.

			doc.appendChild(sig.getElement());

			{

				findDocuments(sig, pathToProject, SignatureUtility.EMPTY_STRING);
			}

			{
				// Add in the KeyInfo for the certificate that we used the
				// private
				// key of
				X509Certificate cert = (X509Certificate) ks
						.getCertificate(certificateAlias);

				sig.addKeyInfo(cert);
				sig.addKeyInfo(cert.getPublicKey());
				System.out.println("Start signing");
 
				sig.sign(privateKey);

				System.out.println("Finished signing");
			}

			FileOutputStream f = new FileOutputStream(signatureFile);

			XMLUtils.outputDOMc14nWithComments(doc, f);

			f.close();
			System.out.println("Wrote signature to " + BaseURI);
		} catch (WrongInputException e) {
			// exiting, Command Line error
		}
	}

	private static void findDocuments(XMLSignature signature,
			String pathToProject, String subFoldersPath) {

		File targetFolder = new File(pathToProject);
		for (String fileName : targetFolder.list()) {
			// IResource projectMember = projectMembers[i];
			String pathToFile = pathToProject + File.separator + fileName;
			File fileInTargetFolder = new File(pathToFile);
			if (!isFolder(fileInTargetFolder)) {

				if (!SignatureUtility
						.checkForDistributorSignatureFile(fileName)
						&& !fileName.equals(".project")) { //$NON-NLS-1$
					if (fileInTargetFolder.exists()
							&& !fileInTargetFolder.isHidden()
							&& !fileInTargetFolder.getName().endsWith("~") //$NON-NLS-1$
							&& !fileInTargetFolder.getName().startsWith(".") && !SignatureUtility.checkForWgtPackage(fileName)) { //$NON-NLS-1$
						if ((!fileName
								.equals(SignatureUtility.AUTHOR_SIGNATURE))) {
							// String path = ((IFile)
							// projectMember).getProjectRelativePath().toString();
							try {
								signature.addDocument(
										subFoldersPath + fileName, null,
										Constants.ALGO_ID_DIGEST_SHA1);
							} catch (XMLSignatureException e) {
								e.printStackTrace();
							}
						}
					}
				}
			} else if (isFolder(fileInTargetFolder)) {
				if (fileInTargetFolder != null && fileInTargetFolder.exists()
						&& !fileInTargetFolder.isHidden()
						&& !fileInTargetFolder.getName().startsWith(".")) //$NON-NLS-1$

					findDocuments(signature, pathToProject + File.separator
							+ fileName, subFoldersPath + fileName + "/");
			}
		}
	}

	private static boolean isFolder(File filePath) {
		return filePath.list() != null;
	}
}
