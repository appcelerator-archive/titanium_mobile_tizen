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
import java.io.IOException;
import java.io.InputStream;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.UnrecoverableKeyException;
import java.security.cert.Certificate;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;

import javax.xml.crypto.dsig.DigestMethod;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;

import org.apache.xml.security.c14n.Canonicalizer;
import org.apache.xml.security.exceptions.XMLSecurityException;
import org.apache.xml.security.keys.content.X509Data;
import org.apache.xml.security.signature.ObjectContainer;
import org.apache.xml.security.signature.SignatureProperties;
import org.apache.xml.security.signature.SignatureProperty;
import org.apache.xml.security.signature.XMLSignature;
import org.apache.xml.security.signature.XMLSignatureException;
import org.apache.xml.security.transforms.TransformationException;
import org.apache.xml.security.transforms.Transforms;
import org.apache.xml.security.utils.Constants;
import org.apache.xml.security.utils.XMLUtils;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

/**
 * @author $Author: coheigea $
 */
public class CreateSignature {

	/** {@link org.apache.commons.logging} logging facility */
	static org.apache.commons.logging.Log log = org.apache.commons.logging.LogFactory.getLog(CreateSignature.class
			.getName());

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

		FileOutputStream fileOutputStream = null;
		String signatureFilePath = "error";
		try {
			InputProccesor inputParams = new InputProccesor();
			inputParams.proccesInputData(argth);

			// Initialise input values

			File signatureFile = new File(inputParams.getPathToProject() + "signature1.xml");

			// The signatureFilePath is the URI that's used to prepend to
			// relative URIs
			signatureFilePath =  signatureFile.toURI().toURL().toString();

			KeyStore ks = extracteKeyStore(inputParams, inputParams.getKeystorePass());

			Document doc = extractedDoc();

			XMLSignature sig = createSigNnature(inputParams.getAlias(), signatureFilePath, ks, doc);

			doc.appendChild(sig.getElement());

			signProjectDocuments(sig, inputParams.getPathToProject(), SignatureUtility.EMPTY_STRING);

			addPropsObjSign(doc, sig);

			System.out.println("Start signing");
			sig.sign(extractPrivateKey(inputParams.getAlias(), inputParams.getKeyPass(), ks));
			System.out.println("Finished signing");

			fileOutputStream = new FileOutputStream(signatureFile);

			XMLUtils.outputDOMc14nWithComments(doc, fileOutputStream);

		} catch (WrongInputException e) {
			e.printStackTrace();
		} finally {
			if (fileOutputStream == null)
				System.out.println("Failed write signature to " + signatureFilePath);
			else
				fileOutputStream.close();
			System.out.println("Wrote signature to " + signatureFilePath);
		}
	}

	private static KeyStore extracteKeyStore(InputProccesor inputParams, String keystorePass) throws KeyStoreException,
			IOException, NoSuchAlgorithmException, CertificateException {
		InputStream fis;
		KeyStore ks = KeyStore.getInstance(inputParams.getKeystoreType());
		if (InputProccesor.CERT_FILE_PATH_DEFAULT.equals(inputParams.getCertPath())) {
			fis = InputProccesor.class.getClassLoader().getResourceAsStream(inputParams.getCertPath());
		} else {
			fis = new FileInputStream(inputParams.getCertPath());
		}
		// load the keystore
		ks.load(fis, keystorePass.toCharArray());
		return ks;
	}

	private static XMLSignature createSigNnature(String certificateAlias, String baseURI, KeyStore ks, Document doc)
			throws XMLSecurityException, KeyStoreException {
		XMLSignature.setDefaultPrefix(Constants.SignatureSpecNS, "");

		// Create an XML Signature object from the document, BaseURI and
		// signature algorithm (in this case RSA)
		XMLSignature sig = new XMLSignature(doc, baseURI, XMLSignature.ALGO_ID_SIGNATURE_RSA_SHA256,
				Canonicalizer.ALGO_ID_C14N_EXCL_OMIT_COMMENTS);

		sig.getKeyInfo().add(extractX509Data(certificateAlias, ks, doc));
		sig.setId(SignatureConstants.distributorId);
		return sig;
	}

	private static X509Data extractX509Data(String certificateAlias, KeyStore ks, Document doc)
			throws XMLSecurityException {
		X509Data x509Data = new X509Data(doc);
		X509Certificate[] certChain = getCertificateChain(certificateAlias, ks);
		for (X509Certificate c : certChain) {
			x509Data.addCertificate(c);
		}
		return x509Data;
	}

	private static X509Certificate[] getCertificateChain(String alias, KeyStore keyStore) {
		ArrayList<X509Certificate> list = new ArrayList<X509Certificate>();
		try {
			Certificate[] chain = keyStore.getCertificateChain(alias);
			if (chain != null && chain.length > 0) {
				for (int i = 0; i < chain.length; i++) {
					if (chain[i] instanceof X509Certificate) {
						list.add((X509Certificate) chain[i]);
					}
				}
			}
		} catch (KeyStoreException e) {
			e.printStackTrace();
		}

		X509Certificate[] ret = new X509Certificate[list.size()];

		return list.toArray(ret);
	}

	// Signature file should consist props object
	// This code create Props object and added to sign file
	private static void addPropsObjSign(Document doc, XMLSignature sig) {
		try {
			createSignatureProperties(doc, sig, "");
			Transforms transforms = new Transforms(doc);
			transforms.addTransform(Transforms.TRANSFORM_C14N11_OMIT_COMMENTS);
			sig.addDocument("#prop", transforms, DigestMethod.SHA256); //$NON-NLS-1$
		} catch (XMLSignatureException e) {
			e.printStackTrace();
		} catch (TransformationException e) {
			e.printStackTrace();
		}
	}

	private static Document extractedDoc() throws ParserConfigurationException, XMLSecurityException {

		DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();

		// XML Signature needs to be namespace aware
		factory.setNamespaceAware(true);

		DocumentBuilder db = factory.newDocumentBuilder();
		Document doc = db.newDocument();
		return doc;
	}

	// get Private key from keystore by password (get alias from keystore)
	private static PrivateKey extractPrivateKey(String privateKeyAlias, String privateKeyPass, KeyStore ks)
			throws KeyStoreException, NoSuchAlgorithmException, UnrecoverableKeyException {
		PrivateKey privateKey = null;

		// Samsung cert has diferent alias
		java.util.Enumeration<String> alias = ks.aliases();
		while (alias.hasMoreElements()) {
			String recievedAliasEntry = alias.nextElement();
			if (ks.isKeyEntry(recievedAliasEntry)) {
				privateKeyAlias = recievedAliasEntry;

				privateKey = (PrivateKey) ks.getKey(recievedAliasEntry, privateKeyPass.toCharArray());
			}
		}

		// get the private key for signing.
		privateKey = (PrivateKey) ks.getKey(privateKeyAlias, privateKeyPass.toCharArray());

		return privateKey;
	}

	// find files and folders of project and singnig them to the doc
	private static void signProjectDocuments(XMLSignature signature, String pathToProject, String subFoldersPath)
			throws Exception {
		File targetFolder = new File(pathToProject);
		try {
			for (String fileName : targetFolder.list()) {
				// IResource projectMember = projectMembers[i];
				String pathToFile = pathToProject + File.separator + fileName;
				File fileInTargetFolder = new File(pathToFile);
				if (!isFolder(fileInTargetFolder)) {

					if (!SignatureUtility.checkForDistributorSignatureFile(fileName) && !fileName.equals(".project")) { //$NON-NLS-1$
						if (fileInTargetFolder.exists()
								&& !fileInTargetFolder.isHidden()
								&& !fileInTargetFolder.getName().endsWith("~") //$NON-NLS-1$
								&& !fileInTargetFolder.getName().startsWith(".") && !SignatureUtility.checkForWgtPackage(fileName)) { //$NON-NLS-1$
							if ((!fileName.equals(SignatureUtility.AUTHOR_SIGNATURE))) {
								// String path = ((IFile)
								// projectMember).getProjectRelativePath().toString();
								try {
									signature.addDocument(subFoldersPath + fileName, null, SignatureConstants.SHA256);
								} catch (XMLSignatureException e) {
									e.printStackTrace();
								}
							}
						}
					}
				} else if (isFolder(fileInTargetFolder)) {
					if (fileInTargetFolder != null && fileInTargetFolder.exists() && !fileInTargetFolder.isHidden()
							&& !fileInTargetFolder.getName().startsWith(".")) //$NON-NLS-1$

						signProjectDocuments(signature, pathToProject + File.separator + fileName, subFoldersPath
								+ fileName + "/");
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			throw e;
		}
	}

	private static boolean isFolder(File filePath) {
		return filePath.list() != null;
	}

	static private ObjectContainer createSignatureProperties(Document doc, XMLSignature signature, String identifier)
			throws XMLSignatureException {

		String signTypeTarget = SignatureConstants.distributorTarget;
		String signTypeRoleURI = SignatureConstants.distributorRoleURI;

		ObjectContainer container = new ObjectContainer(doc);
		container.setId("prop"); //$NON-NLS-1$
		SignatureProperties properties = new SignatureProperties(doc);
		try {
			properties.setXPathNamespaceContext(SignatureConstants.signaturePropertiesPrefix,
					SignatureConstants.signaturePropertiesURI);
		} catch (XMLSecurityException e) {
			e.printStackTrace();
		}
		container.appendChild(properties.getElement());
		signature.appendObject(container);

		/* profile */
		SignatureProperty profileProperty = new SignatureProperty(doc, signTypeTarget, SignatureConstants.profile);
		Element profileElement = XMLUtils.createElementInSignatureSpace(doc, SignatureConstants.profileProperty); //$NON-NLS-1$
		profileElement.setAttribute(Constants._ATT_URI, SignatureConstants.profileURI);
		profileProperty.appendChild(profileElement);
		properties.addSignatureProperty(profileProperty);

		/* role */
		SignatureProperty roleProperty = new SignatureProperty(doc, signTypeTarget, SignatureConstants.role);
		Element roleElement = XMLUtils.createElementInSignatureSpace(doc, SignatureConstants.roleProperty); //$NON-NLS-1$
		roleElement.setAttribute(Constants._ATT_URI, signTypeRoleURI);
		roleProperty.appendChild(roleElement);
		properties.addSignatureProperty(roleProperty);

		/* identifier */
		SignatureProperty identifierProperty = new SignatureProperty(doc, signTypeTarget, SignatureConstants.identifier);
		Element identifierElement = XMLUtils.createElementInSignatureSpace(doc, SignatureConstants.identifierProperty); //$NON-NLS-1$
		identifierProperty.appendChild(identifierElement);
		// String identifierString = generateIdentifierString(identifier,
		// signature);
		// identifierElement.setTextContent(identifierString);
		properties.addSignatureProperty(identifierProperty);

		/* created */
		/*
		 * SignatureProperty createdProperty = new SignatureProperty(doc,
		 * signTypeTarget); createdProperty.setId(SignatureConstants.created);
		 * Element createdElement =
		 * doc.createElement(SignatureConstants.createdProperty);
		 * createdElement.setTextContent(getCurrentTime());
		 * createdProperty.appendChild(createdElement);
		 * properties.addSignatureProperty(createdProperty);
		 */

		return container;
	}

}
