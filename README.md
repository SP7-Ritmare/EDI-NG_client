EDI-NG_client
=============
EDI-NG is a configurable HTML form page generator.
Its purpose is to provide advanced forms with validation features in order to create geo-metadata.

Form pages are defined using XML files called templates.
Once the form is filled in, it gets posted to a back end (namely EDI-NG_server, https://github.com/SP7-Ritmare/EDI-NG_server), which will create a metadata XML file based on the rules defined in the XML template file.

Following is a sample template file:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<template xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="edi_template.xsd">
    <settings>
        <userInterfaceLanguage xml:lang="en"/>
        <metadataLanguage selectionItem="ling_md_1"/>
        <metadataEndpoint>http://sp7.irea.cnr.it/jboss/edi/</metadataEndpoint>
        <sparqlEndpoint>http://sp7.irea.cnr.it:8891/sparql</sparqlEndpoint>
        <requiresValidation>true</requiresValidation>
        <baseDocument><![CDATA[
      
        <gmd:MD_Metadata
            xsi:schemaLocation="http://www.isotc211.org/2005/gmd
            http://schemas.opengis.net/iso/19139/20060504/gmd/gmd.xsd"
            xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco"
            xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:gml="http://www.opengis.net/gml"
            xmlns:xlink="http://www.w3.org/1999/xlink">
    
        </gmd:MD_Metadata>
      
    ]]></baseDocument>
        <xsltChain>
            <xslt>http://sp7.irea.cnr.it/jboss/MDService/rest/stylesheet_1.xsl?version=1.00</xslt>
        </xsltChain>
    </settings>
    <endpointTypes>
        <endpointType xml:id="virtuoso" method="GET" queryParameter="query">
            <parameters>
                <parameter name="format" value="application/sparql-results+json"/>
                <parameter name="save" value="display"/>
                <parameter name="fname" value="undefined"/>
            </parameters>
        </endpointType>
        <endpointType xml:id="sparqlCNR" method="GET" queryParameter="query">
            <parameters>
                <parameter name="format" value="application/json"/>
            </parameters>
        </endpointType>
        <endpointType xml:id="sparqlCSIRO" method="GET" queryParameter="query">
            <parameters>
                <parameter name="format" value="application/json"/>
            </parameters>
        </endpointType>
    </endpointTypes>
    <datasources>
        <codelist xml:id="languages" endpointType="virtuoso">
            <uri>http://inspire-registry.jrc.ec.europa.eu/registers/Languages/items</uri>
        </codelist>
        <sparql xml:id="person" endpointType="virtuoso">
            <query><![CDATA[
        
          PREFIX ns: <http://www.w3.org/2006/vcard/ns#>
          SELECT DISTINCT ?c ?l
          FROM <http://ermes-fp7space.eu/rdfdata/project>
          WHERE {
            ?c rdf:type foaf:Person .
            ?c ns:email ?l .
            ?c ns:org ?o .
            FILTER( REGEX( STR(?l), "$search_param", "i") )
          }
          ORDER BY ASC(?l)
        
      ]]></query>
        </sparql>
        <singleton xml:id="personS" endpointType="virtuoso" triggerItem="md_resp_1_uri">
            <query><![CDATA[
        
          PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>
          SELECT ?inst ?home ?phone
          FROM <http://ermes-fp7space.eu/rdfdata/project>
          WHERE {
            <$search_param> vcard:org ?o.
            ?o foaf:name ?inst .
            <$search_param> foaf:phone ?phone.
            # ?o foaf:homepage ?home .
            # FILTER(LANG(?inst)='it')
          }
        
      ]]></query>
        </singleton>
    </datasources>
    <group xml:id="m_on_m">
        <label xml:lang="en">Information on metadata</label>
        <label xml:lang="it">Informazioni sui metadati</label>
        <element xml:id="id_md" isMandatory="false" isMultiple="false">
            <label xml:lang="en">File identifier</label>
            <label xml:lang="it">Identificatore del file</label>
            <help xml:lang="en">This metadata item is not required by INSPIRE but is useful to draw the correspondence
                between the metadata record and the resource itself.
                It is therefore suggested that the workflow invoking EDI provides this piece of information as a request
                parameter.
            </help>
            <help xml:lang="it">Questo metadato non è richiesto da INSPIRE ma è utile per tracciare la corrispondenza
                tra il metadato e la risorsa corrispondente.
                É quindi consigliato che EDI riceva questa informazione come parametro della richiesta.
            </help>
            <hasRoot>/gmd:MD_Metadata/gmd:fileIdentifier</hasRoot>
            <produces>
                <item hasIndex="1" outIndex="" isFixed="true" hasDatatype="string">
                    <hasPath>/gmd:MD_Metadata/gmd:fileIdentifier/gco:CharacterString</hasPath>
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
