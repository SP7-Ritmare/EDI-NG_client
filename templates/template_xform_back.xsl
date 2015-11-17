<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output
            method="xml"
            indent="yes"
            cdata-section-elements="query baseDocument"
            encoding="UTF-8"
            />

    <xsl:template match="userInterfaceLanguage">
        <defaultLanguage>
            <xsl:value-of select="@xml:lang" />
        </defaultLanguage>
    </xsl:template>

    <xsl:template match="metadataLanguage">
        <languageSelection>
            <byItem>
                <xsl:value-of select="@selectionItem" />
            </byItem>
        </languageSelection>
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

    <xsl:template match="parameters/parameter">
        <xsl:element name="{@name}">
            <xsl:value-of select="@value" />
        </xsl:element>
    </xsl:template>

    <xsl:template match="endpointType">
        <endpointType>
            <id>
                <xsl:value-of select="@xml:id" />
            </id>
            <method>
                <xsl:value-of select="@method" />
            </method>
            <queryParameter>
                <xsl:value-of select="@queryParameter" />
            </queryParameter>
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

    <xsl:template match="codelist|sparql|singleton">
        <datasource>
            <id><xsl:value-of select="@xml:id" /></id>
            <xsl:choose>
                <xsl:when test="name()='codelist'">
                    <type>virtuosoCodelist</type>
                </xsl:when>
                <xsl:otherwise>
                    <type>sparql</type>
                </xsl:otherwise>
            </xsl:choose>
            <endpointType><xsl:value-of select="@endpointType" /></endpointType>
            <xsl:choose>
                <xsl:when test="name()='singleton'">
                    <singleton>true</singleton>
                </xsl:when>
                <xsl:otherwise>
                    <singleton>false</singleton>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:copy-of select="uri" />
            <xsl:copy-of select="url" />
            <xsl:if test="query">
                <query>
                    <xsl:value-of select="query" />
                </query>
            </xsl:if>

        </datasource>
    </xsl:template>

    <xsl:template match="datasources">
        <datasources>
            <xsl:apply-templates select="./*" />
        </datasources>
    </xsl:template>

    <xsl:template match="item">
        <item>
            <xsl:element name="hasIndex"><xsl:value-of select="@hasIndex" /></xsl:element>
            <xsl:element name="outIndex"><xsl:value-of select="@outIndex" /></xsl:element>
            <xsl:element name="isFixed"><xsl:value-of select="@isFixed" /></xsl:element>
            <xsl:element name="hasDatatype"><xsl:value-of select="@hasDatatype" /></xsl:element>
            <xsl:if test="@datasource">
                <xsl:element name="datasource"><xsl:value-of select="@datasource" /></xsl:element>
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
            <xsl:element name="id"><xsl:value-of select="@xml:id" /></xsl:element>
            <xsl:choose>
                <xsl:when test="@isMandatory!='true'">
                    <xsl:element name="isMandatory">NA</xsl:element>
                </xsl:when>
                <xsl:otherwise>
                    <xsl:element name="isMandatory">forAll</xsl:element>
                </xsl:otherwise>
            </xsl:choose>
            <xsl:element name="isMultiple"><xsl:value-of select="@isMultiple" /></xsl:element>
            <xsl:if test="@alternativeTo">
                <xsl:element name="alternativeTo"><xsl:value-of select="@alternativeTo" /></xsl:element>
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
            <xsl:element name="id"><xsl:value-of select="@xml:id" /></xsl:element>
            <xsl:copy-of select="label" />
            <xsl:copy-of select="help" />
            <xsl:apply-templates select="element" />
        </group>
    </xsl:template>

    <xsl:template match="/template">
        <template>
            <xsl:apply-templates select="settings"/>
            <xsl:apply-templates select="endpointTypes"/>
            <xsl:apply-templates select="datasources"/>
            <xsl:apply-templates select="group"/>
        </template>
    </xsl:template>

    <!--

-->
</xsl:stylesheet>