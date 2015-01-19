EDI-NG_client
=============
EDI-NG is a configurable HTML form page generator.
Its purpose is to provide advanced forms with validation features in order to create geo-metadata.

Form pages are defined using XML files called templates.
Once the form is filled in, it gets posted to a back end (namely EDI-NG_server, https://github.com/SP7-Ritmare/EDI-NG_server), which will create a metadata XML file based on the rules defined in the XML template file.

Following is a sample template file:
```xml
<template>
  <settings>
    <defaultLanguage>en</defaultLanguage>
    <languageSelection>
      <!--specifies which ite controls metadata language -->
      <byItem>ling_md_1</byItem>
    </languageSelection>

    <metadataEndpoint>https://adamassoft.it/jbossTest/edi/</metadataEndpoint>
    <sparqlEndpoint>http://sp7.irea.cnr.it:8891/sparql</sparqlEndpoint>
    <requiresValidation>false</requiresValidation>
    <baseDocument><![CDATA[
    <gmd:MD_Metadata
        xsi:schemaLocation="http://www.isotc211.org/2005/gmd
        http://schemas.opengis.net/iso/19139/20060504/gmd/gmd.xsd"
        xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml"
        xmlns:xlink="http://www.w3.org/1999/xlink">

    </gmd:MD_Metadata>
  ]]>
    </baseDocument>
    <xsltChain>
      <xslt>http://sp7.irea.cnr.it/jboss/MDService/rest/stylesheet_1.xsl?version=1.00</xslt>
    </xsltChain>
  </settings>
  <datasources>
    <datasource>
      <id>charsets</id>
      <uri>http://www.rndt.gov.it/codelists/MD_CharacterSetCode/items</uri>
      <type>virtuosoCodelist</type>
    </datasource>
    <datasource>
      <id>presentationForms</id>
      <uri>http://www.rndt.gov.it/codelists/CI_PresentationFormCode/items</uri>
      <query>
        <![CDATA[
            PREFIX ns: <http://www.w3.org/2006/vcard/ns#>
            SELECT ?c ?l ?name ?homepage
            FROM <http://ritmare.it/rdfdata/project>
            WHERE {
              ?c rdf:type foaf:Person.
              ?c ns:email ?l.
              ?c ns:org ?o .
              ?o rdfs:label ?name .
              ?o foaf:homepage ?homepage.
              FILTER( REGEX( STR(?l), "$search_param", "i") )
            }
            ORDER BY ASC(?l) ASC(?name)
        ]]>
      </query>
      <type>virtuosoCodelist</type>
    </datasource>
  </datasources>

  <group>
    <id>info_md</id>
    <label xml:lang="en">Information on metadata</label>
    <label xml:lang="it">Informazioni sui metadati</label>
    <!--Identificatore del file: -->
    <element>
      <id>id_md</id>
      <label xml:lang="en">File identifier</label>
      <label xml:lang="it">Identificatore del file</label>
      <isMandatory>forAll</isMandatory>
      <isMultiple>false</isMultiple>
      <hasRoot>/gmd:MD_Metadata/gmd:fileIdentifier</hasRoot>
      <produces>
        <item>
          <hasIndex>1</hasIndex>
          <hasPath>/gmd:MD_Metadata/gmd:fileIdentifier/gco:CharacterString</hasPath>
          <isFixed>true</isFixed>
          <hasDatatype>URN</hasDatatype>
          <queryStringParameter>uid</queryStringParameter>
        </item>
      </produces>
    </element>
  </group>
</template>
```

Creating a form based on a template file saved locally as "TEST_v1.00.xml" is as easy as using a javascript snippet like this inside a pure HTML page:
```javascript
  $(window).load(function() {
      edi.loadLocalTemplate("TEST", "1.00", onTemplateLoaded);
  });
```
> # Warning
> Due to CORS policies, some browsers might not allow loading from local files (i.e. local templates)
> In this case load templates from http(s) as in:
>```javascript
>  $(window).load(function() {
>      edi.loadTemplate("TEST", "1.00", onTemplateLoaded);
>  });
>```
