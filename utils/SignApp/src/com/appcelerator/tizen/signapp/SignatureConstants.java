package com.appcelerator.tizen.signapp;

public abstract interface SignatureConstants
{
    public static final String distributorTarget = "#DistributorASignature";
    public static final String authorTarget = "#AuthorSignature";
    public static final String roleProperty = "dsp:Role";
    public static final String identifierProperty = "dsp:Identifier";
    public static final String createdProperty = "dsp:Created";
    public static final String distributorProfile = "<dsp:Profile\n URI=\"http://www.w3.org/ns/widgets-digsig#profile\" />";
    public static final String profileProperty = "dsp:Profile";
    public static final String uri = "URI";
    public static final String profileURI = "http://www.w3.org/ns/widgets-digsig#profile";
    public static final String prefix = "dsp";
    public static final String distributorRoleURI = "http://www.w3.org/ns/widgets-digsig#role-distributor";
    public static final String authorRoleURI = "http://www.w3.org/ns/widgets-digsig#role-author";
    public static final String authorId = "AuthorSignature";
    public static final String distributorId = "DistributorASignature";
    public static final String signaturePropertiesURI = "http://www.w3.org/2009/xmldsig-properties";
    public static final String signaturePropertiesPrefix = "xmlns:dsp";
    public static final String profile = "profile";
    public static final String identifier = "identifier";
    public static final String role = "role";
    public static final String created = "created";
    public static final String id = "Id";
    public static final String colan = ":";
    public static final String percent = "%";
    public static final String authorFormat = "%a";
    public static final String certificateFormat = "%f";
    public static final String widgetFormat = "%w";
    public static final String hashFormat = "%h";
    public static final Object timeFormat = "%t";
    public static final String author = "author";
    public static final String widget = "widget";
    public static final String widgetIdAttribute = "id";
    public static final String SHA256 = "http://www.w3.org/2001/04/xmlenc#sha256";
}