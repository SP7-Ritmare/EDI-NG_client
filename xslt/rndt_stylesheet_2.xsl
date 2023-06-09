<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:gmd="http://www.isotc211.org/2005/gmd" 
    xmlns:gco="http://www.isotc211.org/2005/gco"
    xmlns:gml="http://www.opengis.net/gml"
    exclude-result-prefixes="xs"
    version="2.0">

    <xsl:template match="gmd:descriptiveKeywords[ not( .//gmd:keyword ) ]" />
    <xsl:template match="gmd:distance[ not( .//*/text() ) ]" />
    <xsl:template match="gmd:equivalentScale[ not( .//gco:Integer ) ]" />
    <xsl:template match="gmd:extent[ not( .//gml:beginPosition ) and not( .//gco:Decimal ) ]" />
    <xsl:template match="gmd:distributionInfo[ not( .//gmd:URL ) ]" />
    <xsl:template match="gmd:resourceMaintenance[ not( descendant::gmd:MD_MaintenanceFrequencyCode/text() ) ]" />
    
    <!-- identity template -->
    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>