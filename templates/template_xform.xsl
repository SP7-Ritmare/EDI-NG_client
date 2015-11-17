<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output
            method="xml"
            indent="yes"
            cdata-section-elements="query baseDocument"
            encoding="UTF-8"
            />

    <xsl:template match="/template/settings/defaultLanguage">
        <userInterfaceLanguage>
            <xsl:attribute name="xml:lang"><xsl:value-of select="./text()"/></xsl:attribute>
        </userInterfaceLanguage>
    </xsl:template>

    <xsl:template match="languageSelection">
        <metadataLanguage>
            <!-- <xsl:attribute name="xml:lang">en</xsl:attribute> -->
            <xsl:attribute name="selectionItem"><xsl:value-of select="byItem" /></xsl:attribute>
        </metadataLanguage>
    </xsl:template>

    <xsl:template match="requiresAuthentication">

    </xsl:template>

    <xsl:template match="metadataEndpoint|sparqlEndpoint|requiresValidation|xsltChain">
        <xsl:copy-of select="."/>
    </xsl:template>

    <xsl:template match="baseDocument">
        <baseDocument>
            <xsl:value-of select="."/>
        </baseDocument>
    </xsl:template>

    <xsl:template match="/template/settings">
        <settings>
            <xsl:apply-templates select="*" />
        </settings>
    </xsl:template>

    <xsl:template match="parameters/*">
        <parameter>
            <xsl:attribute name="name"><xsl:value-of select="name()" /></xsl:attribute>
            <xsl:attribute name="value"><xsl:value-of select="text()" /></xsl:attribute>
        </parameter>
    </xsl:template>

    <xsl:template match="endpointType">
        <endpointType>
            <xsl:attribute name="xml:id"><xsl:value-of select="id" /></xsl:attribute>
            <xsl:attribute name="method"><xsl:value-of select="method" /></xsl:attribute>
            <xsl:attribute name="queryParameter"><xsl:value-of select="queryParameter" /></xsl:attribute>
            <parameters>
                <xsl:apply-templates select="parameters/*" />
            </parameters>
        </endpointType>
    </xsl:template>

    <xsl:template match="endpointTypes">
        <endpointTypes>
            <xsl:apply-templates select="endpointType" />
        </endpointTypes>
    </xsl:template>

    <xsl:template match="datasource[type='virtuosoCodelist']">
        <codelist>
            <xsl:attribute name="xml:id"><xsl:value-of select="id" /></xsl:attribute>
            <xsl:attribute name="endpointType"><xsl:value-of select="endpointType" /></xsl:attribute>
            <xsl:copy-of select="uri" />
            <xsl:copy-of select="url" />
        </codelist>
    </xsl:template>

    <xsl:template match="datasource[(type='sparql' or type=' sparql ') and singleton='false']">
        <sparql>
            <xsl:attribute name="xml:id"><xsl:value-of select="id" /></xsl:attribute>
            <xsl:attribute name="endpointType"><xsl:value-of select="endpointType" /></xsl:attribute>
            <query>
                <xsl:value-of select="query" />
            </query>
            <xsl:copy-of select="url" />
        </sparql>
    </xsl:template>

    <xsl:template match="datasource[(type='sparql' or type=' sparql ') and singleton='true']">
        <singleton>
            <xsl:attribute name="xml:id"><xsl:value-of select="id" /></xsl:attribute>
            <xsl:attribute name="endpointType"><xsl:value-of select="endpointType" /></xsl:attribute>
            <xsl:attribute name="triggerItem"><xsl:value-of select="triggerItem" /></xsl:attribute>
            <query>
                <xsl:value-of select="query" />
            </query>
            <xsl:copy-of select="url" />
        </singleton>
    </xsl:template>

    <xsl:template match="datasources">
        <datasources>
            <xsl:apply-templates select="datasource" />
        </datasources>
    </xsl:template>

    <xsl:template match="item">
        <item>
            <xsl:attribute name="hasIndex"><xsl:value-of select="hasIndex" /></xsl:attribute>
            <xsl:attribute name="outIndex"><xsl:value-of select="outIndex" /></xsl:attribute>
            <xsl:attribute name="isFixed"><xsl:value-of select="isFixed" /></xsl:attribute>
            <xsl:attribute name="hasDatatype"><xsl:value-of select="hasDatatype" /></xsl:attribute>
            <xsl:if test="datasource">
                <xsl:attribute name="datasource"><xsl:value-of select="datasource" /></xsl:attribute>
            </xsl:if>
            <xsl:copy-of select="label" />
            <xsl:copy-of select="help" />
            <xsl:copy-of select="hasPath" />
            <xsl:copy-of select="hasValue" />
            <xsl:copy-of select="defaultValue" />
            <xsl:copy-of select="westLongitude" />
            <xsl:copy-of select="eastLongitude" />
            <xsl:copy-of select="northLatitude" />
            <xsl:copy-of select="southLatitude" />
            <xsl:copy-of select="start" />
            <xsl:copy-of select="end" />
        </item>
    </xsl:template>

    <xsl:template match="element">
        <element>
            <xsl:attribute name="xml:id"><xsl:value-of select="id" /></xsl:attribute>
            <xsl:choose>
                <xsl:when test="isMandatory!='NA'">
                    <xsl:attribute name="isMandatory">true</xsl:attribute>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:attribute name="isMandatory">false</xsl:attribute>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:attribute name="isMultiple"><xsl:value-of select="isMultiple" /></xsl:attribute>
            <xsl:if test="alternativeTo">
                <xsl:attribute name="alternativeTo"><xsl:value-of select="alternativeTo" /></xsl:attribute>
            </xsl:if>
            <xsl:copy-of select="label" />
            <xsl:copy-of select="help" />
            <xsl:copy-of select="hasRoot" />
            <produces>
                <xsl:apply-templates select="produces/item" />
            </produces>
        </element>
    </xsl:template>

    <xsl:template match="group">
        <group>
            <xsl:attribute name="xml:id"><xsl:value-of select="id" /></xsl:attribute>
            <xsl:copy-of select="label" />
            <xsl:copy-of select="help" />
            <xsl:apply-templates select="element" />
        </group>
    </xsl:template>

    <xsl:template match="/template">
        <template xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  xsi:noNamespaceSchemaLocation="edi_template.xsd">
            <xsl:apply-templates select="settings"/>
            <xsl:apply-templates select="endpointTypes"/>
            <xsl:apply-templates select="datasources"/>
            <xsl:apply-templates select="group"/>
        </template>
    </xsl:template>

</xsl:stylesheet>