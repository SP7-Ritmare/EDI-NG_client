<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:sos="http://www.opengis.net/sos/2.0"
    xmlns:xlink="http://www.w3.org/1999/xlink"  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xmlns:swes="http://www.opengis.net/swes/2.0" xmlns:gmd="http://www.isotc211.org/2005/gmd"
    xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:sml="http://www.opengis.net/sensorml/2.0"
    xmlns:sf="http://www.opengis.net/sampling/2.0" xmlns:gml="http://www.opengis.net/gml/3.2"
    xmlns:swe="http://www.opengis.net/swe/2.0"
    exclude-result-prefixes="xs" version="2.0">
    
    <!-- gml:identification -->
    <xsl:template match="sml:identifier[ not(./sml:Term/sml:value) ]" />
    <xsl:template match="sml:identification[ not(.//sml:Term/@definition='http://mmisw.org/ont/ioos/definition/manufacturerName')]">
        <sml:identification>
            <sml:IdentifierList>
                <sml:identifier>
                    <sml:Term definition="http://mmisw.org/ont/ioos/definition/shortName">
                        <sml:label>Short Name</sml:label>
                        <sml:value><xsl:value-of select="//TheName" /></sml:value>
                    </sml:Term>
                </sml:identifier>
            </sml:IdentifierList>
        </sml:identification>
    </xsl:template>
    <xsl:template match="//TheName" />
    
    <!-- sml:keywords -->
    <xsl:template match="sml:keywords[not(./sml:KeywordList/sml:keyword)]" />
    
    <!-- sml:classification -->
    <xsl:template match="sml:classification[not(./sml:ClassifierList/sml:classifier/sml:Term/sml:value)]" />
    <xsl:template match="sml:classifier[not(./sml:Term/sml:value)]" />
    
    <!-- sml:validTime -->
    <xsl:template match="sml:validTime[ not(./gml:TimePeriod[@gml:id='deploymentDates']/gml:beginPosition) and not(./gml:TimePeriod[@gml:id='deploymentDates']/gml:endPosition) ]" />

    <!-- sml:characteristics -->
    <xsl:template match="sml:characteristics[@name='generalProperties' and not(./sml:CharacteristicList/sml:characteristic[@name='physicalProperties']/swe:DataRecord/swe:field/swe:DataRecord/swe:field/swe:Category/swe:value) ]" />

    <!-- sml:capabilities -->
    <xsl:template match="sml:capabilities[not(.//swe:value)]" />
    <xsl:template match="swe:DataRecord[not(.//swe:value)]" />
    
    <!-- sml:contacts -->
    <xsl:template match="sml:contact[@xlink:arcrole='http://mmisw.org/ont/ioos/definition/manufacturerName' and not(./gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString) ]"/>
    <xsl:template match="sml:contact[@xlink:arcrole='http://inspire.ec.europa.eu/metadata-codelist/ResponsiblePartyRole/owner' and not(./gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString) ]"/>
    <!--<xsl:template match="sml:contact[@xlink:arcrole='http://inspire.ec.europa.eu/metadata-codelist/ResponsiblePartyRole/pointOfContact' and not(.//gmd:CI_ResponsibleParty/gmd:organizationName/gco:CharacterString) ]"/>-->
     
    <!-- sml:documentation -->
    <xsl:template match="sml:documentation[@xlink:arcrole='datasheet' and not (./sml:DocumentList/gmd:CI_OnlineResource/gmd:linkage/gmd:URL) ]"/>
    <xsl:template match="sml:documentation[@xlink:arcrole='image' and not (./sml:DocumentList/gmd:CI_OnlineResource/gmd:linkage/gmd:URL) ]"/>
    
    <!-- sml:history -->
    <xsl:template match="sml:history[not (./sml:EventList/sml:event/sml:Event/sml:label) and not(./sml:EventList/sml:event/sml:Event/gml:description) and not(./sml:EventList/sml:event/sml:Event/sml:time/gml:TimeInstant/gml:timePosition)]"/>
    
    <!-- sml:featureOfInterest -->
    <xsl:template match="sml:featuresOfInterest[not (sml:FeatureList/swe:label) and not(sml:FeatureList/sml:feature) ]" />
    
    <!-- sml:output -->
    <xsl:template match="sml:outputs/sml:OutputList/dateTime">
        <xsl:if test="text()='true'">
            <sml:output name="phenomenonTime" xlink:href="http://www.opengis.net/def/property/OGC/0/PhenomenonTime">
                <swe:Time definition="http://www.opengis.net/def/property/OGC/0/PhenomenonTime">
                    <swe:uom xlink:href="http://www.opengis.net/def/uom/ISO-8601/0/Gregorian"/>
                </swe:Time>
            </sml:output>
        </xsl:if>
    </xsl:template>
    
    <xsl:template match="sml:output[@name]">
        <sml:output name="{replace(replace(replace(@name, '                  ', ' '), '\s+', '_'), '\{|\}|\[|\]|\(|\)|&gt;|&lt;|:|&amp;|&#163;|&#8356;|&#64;', '')}">
            <xsl:apply-templates select="*" />
        </sml:output>
    </xsl:template>
    
    <!-- UOM -->
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
    
    <!-- sml:position -->
    <xsl:template match="sml:position[not(.//swe:value)]" />
    
    
    <!-- swes:observableProperty -->
    <xsl:template match="swes:observableProperty">
        <xsl:choose>
            <xsl:when test="swes:observableProperty/text() = 'not_define'" />
            <xsl:otherwise>
                <xsl:for-each select="//sml:output/swe:Quantity">
                    <swes:observableProperty>
                        <xsl:value-of select="@definition"/>
                    </swes:observableProperty>        
                </xsl:for-each>
                <xsl:if test="//sml:outputs/sml:OutputList/dateTime/text()='true'">
                    <swes:observableProperty>http://www.opengis.net/def/property/OGC/0/PhenomenonTime</swes:observableProperty>
                </xsl:if>
            </xsl:otherwise>
        </xsl:choose>
    </xsl:template>
    
    <!-- identity template -->
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>