<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:sos="http://www.opengis.net/sos/2.0"
    xmlns:swe="http://www.opengis.net/swe/1.0.1"
    xmlns:sml="http://www.opengis.net/sensorML/1.0.1"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:gml="http://www.opengis.net/gml" 
    xmlns:swes="http://www.opengis.net/swes/2.0"
    exclude-result-prefixes="xs"
    version="2.0">
    
    <xsl:template match="swe:uom">
        <xsl:choose>
            <xsl:when test="text()">            
                <swe:uom code="{./@code}">
                    <xsl:if test="./@xlink:href">
                        <xsl:attribute name="xlink:href" select="./@xlink:href"></xsl:attribute>
                    </xsl:if>
                </swe:uom>
            </xsl:when>
            <xsl:otherwise>
                <xsl:copy-of select="."/>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <!-- Keyword -->
    <xsl:template match="sml:keywords[not(.//sml:keyword)]" />
    
    <!-- Identification -->
    <xsl:template match="sml:identifier[ @name='Short Name' and not(./sml:Term[@definition='urn:ogc:def:identifier:OGC:shortName']/sml:value) ]" />
    <xsl:template match="sml:identifier[ @name='Long Name' and not(./sml:Term[@definition='urn:ogc:def:identifier:OGC:longName']/sml:value) ]" />
    <xsl:template match="sml:identifier[ @name='Manufacturer Name' and not(./sml:Term[@definition='urn:ogc:def:identifier:OGC:manufacturerName']/sml:value) ]" />
    <xsl:template match="sml:identifier[ @name='Model Number' and not(./sml:Term[@definition='urn:ogc:def:identifier:SBE:modelNumber']/sml:value) ]" />
    <xsl:template match="sml:identifier[ @name='Serial Number' and not(./sml:Term[@definition='urn:ogc:def:identifier:OGC:serialNumber']/sml:value) ]" />
    
    <!-- Classification -->
    <!--
    <xsl:template match="sml:classifier[ @name='Intended application' and not(./sml:Term[@definition='']/sml:value) ]" />
    <xsl:template match="sml:classifier[ @name='Sensor type' and not(./sml:Term[@definition='']/sml:value) ]" />
    <xsl:template match="sml:classifier[ @name='Deployment role' and not(./sml:Term[@definition='']/sml:value) ]" />
    <xsl:template match="sml:classification[ not(./*) ]" />
    -->
    <xsl:template match="sml:classification[not(.//sml:value)]" />
    <xsl:template match="sml:classifier[not(.//sml:value)]" />
    
    <!-- Valid time -->
    <xsl:template match="sml:validTime[ not(./gml:TimePeriod[@gml:id='deploymentDates']/gml:beginPosition) and not(./gml:TimePeriod[@gml:id='deploymentDates']/gml:endPosition) ]" />
    <xsl:template match="sml:validTime">
        <xsl:if test="gml:endPosition/text()='true'">
            <gml:endPosition indeterminatePosition="now"/>
        </xsl:if>
    </xsl:template>
    
    <!-- Capabilities -->
    <xsl:template match="swe:field[ @name='material' and not(./swe:Category[@definition='urn:ogc:dictionary:OGC:material']/swe:value) ]" />
    <!-- <xsl:template match="swe:field[ @name='altezza' and not (./swe:Quantity/swe:value) ]"/> 
    <xsl:template match="swe:field[ @name='voltaggio' and not (./swe:Quantity/swe:value) ]"/>
    <xsl:template match="sml:capabilities[ @name='Operational Capabilities' and not (./swe:DataRecord/swe:field[@xlink:role='urn:ogc:def:property:dataStorage']/swe:Category[@definition='urn:ogc:def:classifier:SBE:storageType']/swe:value) ]"/>-->
    <xsl:template match="sml:capabilities[not(.//swe:value)]" />
    
    <!-- Contact -->
    <xsl:template match="sml:contact[@xlink:arcrole='urn:ogc:def:classifiers:OGC:contactType:manufacturer' and not (./sml:ResponsibleParty/sml:organizationName) and not (./sml:ResponsibleParty/sml:contactInfo) ]"/>
    <xsl:template match="sml:contact[@xlink:arcrole='urn:ogc:def:classifiers:OGC:contactType:manufacturer' and descendant::sml:deliveryPoint/text() = ', ' ]"/>
    <xsl:template match="sml:contact[@xlink:arcrole='urn:ogc:def:classifiers:OGC:contactType:owner' and not (./sml:ResponsibleParty/sml:organizationName) and not (./sml:ResponsibleParty/sml:contactInfo) ]"/>
    <xsl:template match="sml:contact[@xlink:arcrole='urn:ogc:def:classifiers:OGC:contactType:operator' and not (./sml:ResponsibleParty/sml:organizationName) and not (./sml:ResponsibleParty/sml:contactInfo) ]"/>
    
    <!-- Documentation -->
    <xsl:template match="sml:documentation[@xlink:arcrole='urn:ogc:def:classifiers:OGC:documentType:datasheet' and not (./sml:Document) ]"/>
    <xsl:template match="sml:documentation[@xlink:arcrole='urn:ogc:def:object:OGC:1.0:image' and not (./sml:Document/sml:onlineResource) ]"/>
    
    <!-- History -->
    <xsl:template match="sml:EventList[@gml:id='smlUpdates' and not (./sml:member/sml:Event/sml:date) and not(./sml:member/sml:Event/gml:description) ]"/>
    <xsl:template match="sml:EventList[@gml:id='operations' and not (./sml:member/sml:Event/sml:date) and not(./sml:member/sml:Event/gml:description) ]"/>
    <xsl:template match="sml:EventList[@gml:id='calibration' and not (./sml:member/sml:Event/sml:date) and not(./sml:member/sml:Event/gml:description) ]"/>
    <xsl:template match="sml:EventList[@gml:id='otherEvents' and not (./sml:member/sml:Event/sml:date) and not(./sml:member/sml:Event/gml:description) ]"/>
    <xsl:template match="sml:history[not(.//sml:date)]" />
    
    <!-- Position -->
    <xsl:template match="sml:position[not(.//swe:value)]" />
    
    <!-- position -->
    <xsl:template match="sml:outputs/sml:OutputList/DateTime">
        <xsl:if test="text()='true'">
            <sml:output name="phenomenonTime" xlink:href="http://www.opengis.net/def/property/OGC/0/PhenomenonTime">
                <swe:Time definition="http://www.opengis.net/def/property/OGC/0/PhenomenonTime">
                </swe:Time>
            </sml:output>
        </xsl:if>
    </xsl:template>
    
    <!-- Output -->
    <xsl:template match="sml:field[@name]">
        <sml:field name="{replace(replace(@name, '\s+', '_'), '\{|\}|\[|\]|\(|\)', '')}">
            <xsl:apply-templates select="*" />
        </sml:field>
    </xsl:template>
    
    <xsl:template match="swes:observableProperty">
        <xsl:for-each select="//sml:output/swe:Quantity">
            <swes:observableProperty>
                <xsl:value-of select="@definition"/>
            </swes:observableProperty>        
        </xsl:for-each>
        <xsl:if test="//dateTime/text()='true'">
            <swes:observableProperty>http://www.opengis.net/def/property/OGC/0/PhenomenonTime</swes:observableProperty>
        </xsl:if>
    </xsl:template>
    
    <!--<xsl:template match="sml:output/@name">
        <xsl:value-of select="string-join(tokenize(.,'\s'),'_') "/>
    </xsl:template>-->
    <!--<xsl:template match="sml:output/@name">
        <!-\-<xsl:attribute name="name">-\->
            <xsl:value-of select="escape-html-uri()"></xsl:value-of>
        <!-\-</xsl:attribute>-\->
    </xsl:template>-->
    
    <!-- identity template -->
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>