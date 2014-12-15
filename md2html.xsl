<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:xs="http://www.w3.org/2001/XMLSchema" exclude-result-prefixes="xs" version="2.0">
  <xsl:output method="html" encoding="utf-8" indent="no"/>
  <xsl:strip-space elements="*"/>
  <xsl:param name="mode"/>
  <xsl:param name="version"/>
  <xsl:param name="template"/>
  <xsl:template match="/">
    <xsl:choose>
      <xsl:when test="$mode=&apos;block&apos;">
        <xsl:apply-templates select="/template"/>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select="/template" mode="fullPage"/>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template match="/template">
    <xsl:call-template name="blocco"/>
  </xsl:template>
  <xsl:template match="/template" mode="fullPage">
    <xsl:text disable-output-escaping="yes">&lt;!DOCTYPE html&gt;</xsl:text>
    <html lang="it">
      <head>
        <meta charset="utf-8"/>
        <title>RITMARE EDI <xsl:value-of select="$template"/> v<xsl:value-of select="$version"/>
        </title>
        <link rel="stylesheet" href="ritmare.css"/>
        <link rel="stylesheet" href="datepicker.css"/>
        <link rel="stylesheet" href="jquery-ui.css"/>
        <!--<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script> -->
        <script src="jquery-1.9.1.js"/>
        <script src="jquery-ui.js"/>
        <style> body { font-family: &quot;Trebuchet MS&quot;, &quot;Helvetica&quot;, &quot;Arial&quot;, &quot;Verdana&quot;, &quot;sans-serif&quot;; font-size: 62.5%; } element { display: none; } /* debug */ #results, #debug { display: none; overflow: auto; } .info { display: none; } </style>
        <script type="text/javascript" src="jquery.string.1.1.0-min.js"/>
        <script src="xml2json.js"/>
        <script src="json2xml.js"/>
        <script src="langs.js"/>
        <script src="spin.js"/>
        <script src="mdeditor.js?version=2.00"/>
        <script src="assets.min.js"/>
        <script src="//google-code-prettify.googlecode.com/svn/loader/run_prettify.js?skin=sunburst"/>
        <script src="//google-code-prettify.googlecode.com/svn/trunk/src/prettify.js"/>
        <style> .prettyprint ol.linenums &gt; li { list-style-type: decimal; } pre.prettyprint{ width: auto; overflow: auto; max-height: 600px } </style>
        <link href="bootstrap.min.css" rel="stylesheet" media="screen"/>
        <link href="mdeditor.css" rel="stylesheet"/>
        <!--[if lt IE 9]>

      		<script src="https://html5shim.googlecode.com/svn/trunk/html5.js"></script>

    		<![endif] -->
        <link href="//code.google.com/p/google-code-prettify/source/browse/trunk/src/prettify.css"/>
      </head>
      <body class="data">
        <div class="content-wrap">
          <div class="container">
            <h1>RITMARE EDI <xsl:value-of select="$template"/> v<xsl:value-of select="$version"/>
            </h1>
            <xsl:call-template name="blocco"/>
          </div>
        </div>
        <script> $(&apos;body&apos;).scrollspy(); setTimeout(function () { $(&apos;.bs-docs-sidenav&apos;).affix({ offset: { top: 10, bottom: 270 } }) }, 100) </script>
      </body>
    </html>
  </xsl:template>
  <xsl:template match="//group" mode="menu">
    <script language="javascript"> var <xsl:value-of select="id"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
        <xsl:with-param name="id" select="id"/>
      </xsl:apply-templates>
    </script>
    <li>
      <a href="#tab_{id}">
        <label>
          <xsl:attribute name="for">
            <xsl:value-of select="id"/>
          </xsl:attribute>
          <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
        </label>
      </a>
    </li>
  </xsl:template>
  <xsl:template name="fileId">
    <h2>
      <label class="control-label">Identificatore file:</label>&#160;<span id="fileId"/>
    </h2>
  </xsl:template>
  <xsl:template name="blocco">
    <script> var elements = []; </script>
    <div class="row">
      <div class="span3 bs-docs-sidebar">
        <ul class="nav nav-list  bs-docs-sidenav" id="myTab">
          <xsl:apply-templates select="//group" mode="menu"/>
        </ul>
      </div>
      <article class="span8" id="mdcontent">
        <form id="theForm" method="post">
          <div class="form-group">
            <div id="bottone"><!--<input type="submit" value="submit" /> -->  <button id="postButton" type="submit" class="btn btn-primary">post</button>
            </div>
            <!--<xsl:if test="count(//group) > 0">
	
                        	<xsl:apply-templates select="//group"></xsl:apply-templates>
	
                    	</xsl:if>
	
                    	<xsl:if test="count(//group) = 0">
	
                        	<xsl:apply-templates select="//element"></xsl:apply-templates>
	
                    	</xsl:if> -->
            <xsl:apply-templates select="group | alternative | element"/>
          </div>
        </form>
      </article>
    </div>
  </xsl:template>
  <xsl:template match="group">
    <xsl:variable name="theId">the_<xsl:value-of select="id"/>
    </xsl:variable>
    <section id="tab_{id}" class="form-horizontal active">
      <div class="page-header">
        <script language="javascript"> var <xsl:value-of select="$theId"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
            <xsl:with-param name="id" select="$theId"/>
          </xsl:apply-templates>
        </script>
        <h2>
          <xsl:attribute name="for">
            <xsl:value-of select="$theId"/>
          </xsl:attribute>
          <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
        </h2>
        <span class="help-inline">
          <xsl:attribute name="for">
            <xsl:value-of select="$theId"/>
          </xsl:attribute>
          <xsl:if test="help!=&apos;&apos;">
            <script language="javascript"> var <xsl:value-of select="$theId"/>_help = []; <xsl:apply-templates select="help" mode="help-translations">
                <xsl:with-param name="id" select="$theId"/>
              </xsl:apply-templates>
            </script>
            <a href="javascript:void(0)" data-toggle="popover" data-trigger="hover">
              <xsl:attribute name="data-original-title">
                <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
              </xsl:attribute>
              <xsl:attribute name="for">
                <xsl:value-of select="$theId"/>
              </xsl:attribute>
              <xsl:attribute name="data-content">
                <xsl:value-of select="help[@xml:lang=/template/settings/defaultLanguage]"/>
              </xsl:attribute>
              <i class="icon-question-sign"/>
            </a>
          </xsl:if>
        </span>
      </div>
      <xsl:apply-templates select="alternative | element"/>
    </section>
  </xsl:template>
  <xsl:template match="alternative">
    <div class="alternative">
      <xsl:for-each select="./element[produces/item]">
        <xsl:apply-templates select="."/>
        <xsl:if test="position() != last()">
          <p>oppure</p>
        </xsl:if>
      </xsl:for-each>
    </div>
  </xsl:template>
  <xsl:template match="element[produces/item]">
    <xsl:variable name="idPrefix">
      <xsl:value-of select="id"/>
    </xsl:variable>
    <xsl:variable name="id">
      <xsl:value-of select="id"/>
    </xsl:variable>
    <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_labels = []; <xsl:apply-templates select="label" mode="label-translations"/>
    </script>
    <div class="item control-group templateElement">
      <xsl:attribute name="represents_element">
        <xsl:value-of select="id"/>
      </xsl:attribute>
      <xsl:attribute name="isMandatory">
        <xsl:value-of select="isMandatory"/>
      </xsl:attribute>
      <xsl:attribute name="hasRoot">
        <xsl:value-of select="hasRoot"/>
      </xsl:attribute>
      <xsl:attribute name="id">
        <xsl:value-of select="id"/>
      </xsl:attribute>
      <xsl:if test="count(./produces/item[isFixed=&apos;false&apos;])=0">
        <xsl:attribute name="style">display: none;</xsl:attribute>
      </xsl:if>
      <label class="control-label">
        <xsl:attribute name="isMandatory">
          <xsl:value-of select="isMandatory"/>
        </xsl:attribute>
        <span class="theLabel">
          <xsl:attribute name="for">
            <xsl:value-of select="id"/>
          </xsl:attribute>
          <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
        </span>
        <span class="help-inline">
          <xsl:if test="help!=&apos;&apos;">
            <script language="javascript"> var <xsl:value-of select="id"/>_help = []; <xsl:apply-templates select="help" mode="help-translations">
                <xsl:with-param name="id" select="id"/>
              </xsl:apply-templates>
            </script>
            <a href="javascript:void(0)" data-toggle="popover" data-trigger="hover">
              <xsl:attribute name="data-original-title">
                <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
              </xsl:attribute>
              <xsl:attribute name="for">
                <xsl:value-of select="id"/>
              </xsl:attribute>
              <xsl:attribute name="data-content">
                <xsl:value-of select="help[@xml:lang=/template/settings/defaultLanguage]"/>
              </xsl:attribute>
              <i class="icon-question-sign"/>
            </a>
          </xsl:if>
        </span>
      </label>
      <!--<div class="offset1 control-group"> -->
    
      <!--<xsl:if test="help!=&apos;&apos;">
          <script language="javascript"> var <xsl:value-of select="id"/>_help = []; <xsl:apply-templates select="help" mode="item-label-translations">
              <xsl:with-param name="id" select="id"/>
            </xsl:apply-templates>
          </script>
          <a type="button" href="#" class="btn btn-info right" data-toggle="popover" title="">
            <xsl:attribute name="data-original-title">
              <xsl:value-of select="label"/>
            </xsl:attribute>
            <xsl:attribute name="for">
              <xsl:value-of select="id"/>
            </xsl:attribute>
            <xsl:attribute name="data-content">
              <xsl:value-of select="help"/>
            </xsl:attribute> Help </a>
        </xsl:if> -->
      <xsl:apply-templates select="./produces/item" mode="generic">
        <xsl:with-param name="element_id">
          <xsl:value-of select="id"/>
        </xsl:with-param>
      </xsl:apply-templates>
      <!--</div> -->
    </div>  <xsl:if test="isMultiple=&apos;true&apos;">
      <button type="button" class="btn btn-mini btn-primary duplicator">
        <xsl:attribute name="duplicates">
          <xsl:value-of select="id"/>
        </xsl:attribute> + <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
      </button>
    </xsl:if>
  </xsl:template>
  <xsl:template match="produces/item" mode="generic">
    <xsl:param name="element_id"/>
    <xsl:choose>
      <xsl:when test="count(../item[isFixed=&apos;false&apos;])&gt;1">
        <xsl:if test="position()=1">
          <div class="offset1 control-group"/>
        </xsl:if>
        <div class="offset1 control-group">
          <xsl:apply-templates select=".">
            <xsl:with-param name="element_id">
              <xsl:value-of select="$element_id"/>
            </xsl:with-param>
          </xsl:apply-templates>
        </div>
      </xsl:when>
      <xsl:otherwise>
        <xsl:apply-templates select=".">
          <xsl:with-param name="element_id">
            <xsl:value-of select="$element_id"/>
          </xsl:with-param>
        </xsl:apply-templates>
      </xsl:otherwise>
    </xsl:choose>
  </xsl:template>
  <xsl:template match="produces/item[isFixed=&apos;false&apos; and (hasDatatype=&apos;dependent&apos; or hasDatatype=&apos;string&apos; or hasDatatype=&apos;URN&apos; or hasDatatype=&apos;URI&apos; or hasDatatype=&apos;autoCompletion&apos; or hasDatatype=&apos;int&apos; or hasDatatype=&apos;real&apos;)]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="hasDatatype"/>_</xsl:variable>
    <xsl:variable name="id">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <xsl:if test="label">
      <script language="javascript"> var <xsl:value-of select="$id"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
          <xsl:with-param name="id" select="$id"/>
        </xsl:apply-templates>
      </script>
      <label class="control-label">
        <xsl:attribute name="isMandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="for">
          <xsl:value-of select="$id"/>
        </xsl:attribute>
        <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
      </label>
    </xsl:if>
    <p class="controls">
      <input id="{$id}">
        <xsl:choose>
          <xsl:when test="hasDatatype = &apos;uri&apos;">
            <xsl:attribute name="type">url</xsl:attribute>
          </xsl:when>
          <xsl:when test="hasDatatype = &apos;int&apos; or hasDatatype=&apos;real&apos;">
            <xsl:attribute name="type">number</xsl:attribute>
          </xsl:when>
          <xsl:otherwise>
            <xsl:attribute name="type">text</xsl:attribute>
          </xsl:otherwise>
        </xsl:choose>
        <xsl:attribute name="element_id">
          <xsl:value-of select="$element_id"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="path">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="mandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:if test="../../isMandatory != &apos;NA&apos;">
          <xsl:attribute name="required">required</xsl:attribute>
        </xsl:if>
        <xsl:attribute name="class">mandatory_<xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="validateAs">
          <xsl:value-of select="hasDatatype"/>
        </xsl:attribute>
        <xsl:attribute name="datatype">
          <xsl:value-of select="hasDatatype"/>
        </xsl:attribute>
        <xsl:attribute name="fixed">
          <xsl:value-of select="isFixed"/>
        </xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="defaultValue"/>
        </xsl:attribute>
        <xsl:attribute name="queryStringParameter">
          <xsl:value-of select="queryStringParameter"/>
        </xsl:attribute>
        <xsl:attribute name="isLanguageNeutral">
          <xsl:value-of select="isLanguageNeutral"/>
        </xsl:attribute>
        <xsl:attribute name="outIndex">
          <xsl:value-of select="outIndex"/>
        </xsl:attribute>
        <xsl:if test="hasDatatype=&apos;dependent&apos;">
          <xsl:attribute name="query">
            <xsl:value-of select="hasValue"/>
          </xsl:attribute>
        </xsl:if>
        <xsl:if test="hasDatatype=&apos;autoCompletion&apos;">
          <xsl:attribute name="useCode">
            <xsl:value-of select="useCode"/>
          </xsl:attribute>
          <xsl:attribute name="query">
            <xsl:value-of select="hasValue"/>
          </xsl:attribute>
          <div class="uris">
            <p>
              <input type="text" disabled="disabled" size="80" id="{$id}_uri"/>
            </p>
            <p>
              <input type="text" disabled="disabled" size="80" id="{$id}_urn"/>
            </p>
          </div>
        </xsl:if>
      </input>
      <!--<xsl:if test="hasDatatype=&apos;autoCompletion&apos;">
        <script language="javascript"> var id = &quot;#<xsl:value-of select="$id"/>&quot;; var textbox = $(&quot;#<xsl:value-of select="$id"/>&quot;); var query = textbox.attr(&quot;query&quot;); var labels; console.log(&quot;setto l&apos;evento&quot;); textbox.keyup(function() { console.log(&quot;length: &quot; + $(this).val().length); if ( $(this).val().length &lt;= 0 ) { $(&quot;#<xsl:value-of select="$id"/>_uri&quot;).val(&quot;&quot;); } console.log(&quot;autocomp1 &quot; + $(this).val()); query = $(this).attr(&quot;query&quot;); query = replaceAll(query, &quot;$search_param&quot;, $(this).val()); console.log(&quot;launch query: &quot; + query); labels = new Array(); $.getJSON( &quot;http://sp7.irea.cnr.it:8890/sparql&quot;, { query: query, format: &quot;application/sparql-results+json&quot;, save:&quot;display&quot;, fname : undefined }, function( data ) { dati = data.results.bindings; console.log(&quot;autocomp2: &quot; + JSON.stringify(data)); for ( i = 0; i &lt; dati.length; i++ ) { labels.push({ value: dati[i].c.value, label: (dati[i].a ? dati[i].a.value : dati[i].l.value) }); console.log(&quot;a &quot; + i + &quot; - &quot; + (dati[i].a ? dati[i].a.value : dati[i].l.value)); } $( &quot;#<xsl:value-of select="$id"/>&quot; ).autocomplete({ source: labels, select: function( event, ui ) { $( &quot;#<xsl:value-of select="$id"/>&quot; ).val( ui.item.label ); $( &quot;#<xsl:value-of select="$id"/>_uri&quot; ).val( ui.item.value ); return false; } }); }); }); </script>
      </xsl:if> -->
    </p>
  </xsl:template>  <xsl:template match="produces/item[isFixed=&apos;false&apos; and hasDatatype=&apos;boolean&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
        <xsl:with-param name="id" select="$idPrefix"/>
      </xsl:apply-templates>
    </script>
    <xsl:if test="label">
      <label class="control-label">
        <xsl:attribute name="isMandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="for">
          <xsl:value-of select="$idPrefix"/>
        </xsl:attribute>
        <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
      </label>
    </xsl:if>
    <p class="controls">
      <input id="{$idPrefix}" type="checkbox" readonly="readonly">
        <xsl:attribute name="element_id">
          <xsl:value-of select="$element_id"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="path">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="mandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:if test="../../isMandatory != &apos;NA&apos;">
          <xsl:attribute name="required">required</xsl:attribute>
        </xsl:if>
        <xsl:attribute name="class">span2 mandatory_<xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="datatype">
          <xsl:value-of select="hasDatatype"/>
        </xsl:attribute>
        <xsl:attribute name="fixed">
          <xsl:value-of select="isFixed"/>
        </xsl:attribute>
        <xsl:attribute name="value">
          <xsl:value-of select="defaultValue"/>
        </xsl:attribute>
        <xsl:attribute name="isLanguageNeutral">
          <xsl:value-of select="isLanguageNeutral"/>
        </xsl:attribute>
        <xsl:attribute name="queryStringParameter">
          <xsl:value-of select="queryStringParameter"/>
        </xsl:attribute>
        <xsl:attribute name="outIndex">
          <xsl:value-of select="outIndex"/>
        </xsl:attribute>
      </input>
    </p>
  </xsl:template>
  <xsl:template match="produces/item[isFixed=&apos;false&apos; and hasDatatype=&apos;date&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
        <xsl:with-param name="id" select="$idPrefix"/>
      </xsl:apply-templates>
    </script>
    <xsl:if test="label">
      <label class="control-label">
        <xsl:attribute name="isMandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="for">
          <xsl:value-of select="$idPrefix"/>
        </xsl:attribute>
        <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
      </label>
    </xsl:if>
    <p class="controls">
      <span class="input-append date datepicker" textbox="{$idPrefix}" data-date-format="yyyy-mm-dd">
        <input id="{$idPrefix}" type="text" readonly="readonly">
          <xsl:attribute name="element_id">
            <xsl:value-of select="$element_id"/>
          </xsl:attribute>
          <xsl:attribute name="name">
            <xsl:value-of select="hasPath"/>
          </xsl:attribute>
          <xsl:attribute name="path">
            <xsl:value-of select="hasPath"/>
          </xsl:attribute>
          <xsl:attribute name="mandatory">
            <xsl:value-of select="../../isMandatory"/>
          </xsl:attribute>
          <xsl:if test="../../isMandatory != &apos;NA&apos;">
            <xsl:attribute name="required">required</xsl:attribute>
          </xsl:if>
          <xsl:attribute name="class">span2 mandatory_<xsl:value-of select="../../isMandatory"/>
          </xsl:attribute>
          <xsl:attribute name="datatype">
            <xsl:value-of select="hasDatatype"/>
          </xsl:attribute>
          <xsl:attribute name="fixed">
            <xsl:value-of select="isFixed"/>
          </xsl:attribute>
          <xsl:if test="defaultValue != &apos;&apos;">
            <xsl:attribute name="value">
              <xsl:value-of select="defaultValue"/>
            </xsl:attribute>
          </xsl:if>
          <xsl:attribute name="isLanguageNeutral">
            <xsl:value-of select="isLanguageNeutral"/>
          </xsl:attribute>
          <xsl:attribute name="queryStringParameter">
            <xsl:value-of select="queryStringParameter"/>
          </xsl:attribute>
          <xsl:attribute name="outIndex">
            <xsl:value-of select="outIndex"/>
          </xsl:attribute>
        </input>
        <span class="add-on">
          <i class="icon-calendar"/>
        </span>
      </span>
    </p>
  </xsl:template>
  <xsl:template match="produces/item[isFixed=&apos;false&apos; and hasDatatype=&apos;dateRange&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <div class="dateRange" divPrefix="{$idPrefix}"><!--field 1 -->  <p class="controls">
        <table>
          <tr>
            <td>
              <xsl:apply-templates select="start">
                <xsl:with-param name="idPrefix">
                  <xsl:value-of select="$element_id"/>
                </xsl:with-param>
              </xsl:apply-templates>
            </td>
            <td/>
            <td>
              <xsl:apply-templates select="end">
                <xsl:with-param name="idPrefix">
                  <xsl:value-of select="$element_id"/>
                </xsl:with-param>
              </xsl:apply-templates>
            </td>
          </tr>
        </table>
      </p>
    </div>
  </xsl:template>
  <xsl:template match="start|end">
    <xsl:param name="element_id"/>
    <xsl:param name="idPrefix"/>
    <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_<xsl:value-of select="name()"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
        <xsl:with-param name="id" select="concat($idPrefix, &apos;_&apos;, name())"/>
      </xsl:apply-templates>
    </script>
    <label class="control-label" for="{$idPrefix}_{name()}">
      <xsl:attribute name="isMandatory">
        <xsl:value-of select="../../../isMandatory"/>
      </xsl:attribute>
      <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
    </label>
    <span class="input-append date datepicker" textbox="{$idPrefix}_{name()}" data-date-format="yyyy-mm-dd">
      <input id="{$idPrefix}_{name()}" type="text" readonly="readonly">
        <xsl:attribute name="element_id">
          <xsl:value-of select="$idPrefix"/>
        </xsl:attribute>
        <xsl:attribute name="path">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="mandatory">
          <xsl:value-of select="../../../isMandatory"/>
        </xsl:attribute>
        <xsl:if test="../../../isMandatory != &apos;NA&apos;">
          <xsl:attribute name="required">required</xsl:attribute>
        </xsl:if>
        <xsl:attribute name="class">span2 mandatory_<xsl:value-of select="../../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="datatype">date</xsl:attribute>
        <xsl:attribute name="fixed">
          <xsl:value-of select="../isFixed"/>
        </xsl:attribute>
        <xsl:if test="../defaultValue != &apos;&apos;">
          <xsl:attribute name="value">
            <xsl:value-of select="../defaultValue"/>
          </xsl:attribute>
        </xsl:if>
        <xsl:attribute name="isLanguageNeutral">
          <xsl:value-of select="../isLanguageNeutral"/>
        </xsl:attribute>
        <xsl:attribute name="queryStringParameter">
          <xsl:value-of select="../queryStringParameter"/>
        </xsl:attribute>
        <xsl:attribute name="outIndex">
          <xsl:value-of select="outIndex"/>
        </xsl:attribute>
      </input>
      <span class="add-on">
        <i class="icon-calendar"/>
      </span>
    </span>
  </xsl:template>
  <xsl:template match="produces/item[isFixed=&apos;false&apos; and hasDatatype=&apos;boundingBox&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <div class="boundingBox" divPrefix="{$idPrefix}"><!--field 1 -->  <p class="controls">
        <table>
          <tr>
            <td/>
            <td>
              <xsl:apply-templates select="northLatitude">
                <xsl:with-param name="idPrefix">
                  <xsl:value-of select="$element_id"/>
                </xsl:with-param>
              </xsl:apply-templates>
            </td>
          </tr>
          <tr>
            <td>
              <xsl:apply-templates select="westLongitude">
                <xsl:with-param name="idPrefix">
                  <xsl:value-of select="$element_id"/>
                </xsl:with-param>
              </xsl:apply-templates>
            </td>
            <td/>
            <td>
              <xsl:apply-templates select="eastLongitude">
                <xsl:with-param name="idPrefix">
                  <xsl:value-of select="$element_id"/>
                </xsl:with-param>
              </xsl:apply-templates>
            </td>
          </tr>
          <tr>
            <td/>
            <td>
              <xsl:apply-templates select="southLatitude">
                <xsl:with-param name="idPrefix">
                  <xsl:value-of select="$element_id"/>
                </xsl:with-param>
              </xsl:apply-templates>
            </td>
          </tr>
        </table>
      </p>
    </div>
  </xsl:template>
  <xsl:template match="northLatitude | southLatitude | westLongitude | eastLongitude">
    <xsl:param name="element_id"/>
    <xsl:param name="idPrefix"/>
    <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_<xsl:value-of select="name()"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
        <xsl:with-param name="id" select="concat($idPrefix, &apos;_&apos;, name())"/>
      </xsl:apply-templates>
    </script>
    <label class="control-label" for="{$idPrefix}_{name()}">
      <xsl:attribute name="isMandatory">
        <xsl:value-of select="../../../isMandatory"/>
      </xsl:attribute>
      <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
    </label>
    <input id="{$idPrefix}_{name()}">
      <xsl:attribute name="element_id">
        <xsl:value-of select="$idPrefix"/>
      </xsl:attribute>
      <xsl:attribute name="name">
        <xsl:value-of select="hasPath"/>
      </xsl:attribute>
      <xsl:attribute name="path">
        <xsl:value-of select="hasPath"/>
      </xsl:attribute>
      <xsl:attribute name="mandatory">
        <xsl:value-of select="../../../isMandatory"/>
      </xsl:attribute>
      <xsl:if test="../../isMandatory != &apos;NA&apos;">
        <xsl:attribute name="required">required</xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">mandatory_<xsl:value-of select="../../../isMandatory"/>
        <xsl:value-of select="name()"/>
      </xsl:attribute>
      <xsl:attribute name="queryStringParameter">
        <xsl:value-of select="queryStringParameter"/>
      </xsl:attribute>
      <xsl:attribute name="isLanguageNeutral">
        <xsl:value-of select="isLanguageNeutral"/>
      </xsl:attribute>
      <xsl:attribute name="coordinate">
        <xsl:value-of select="name()"/>
      </xsl:attribute>
      <xsl:attribute name="datatype">
        <xsl:value-of select="hasDatatype"/>
      </xsl:attribute>
      <xsl:attribute name="fixed">
        <xsl:value-of select="isFixed"/>
      </xsl:attribute>
      <xsl:attribute name="outIndex">
        <xsl:value-of select="outIndex"/>
      </xsl:attribute>
    </input>
  </xsl:template>
  <xsl:template match="produces/item[isFixed=&apos;false&apos; and hasDatatype=&apos;text&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
        <xsl:with-param name="id" select="$idPrefix"/>
      </xsl:apply-templates>
    </script>
    <xsl:if test="label">
      <label class="control-label">
        <xsl:attribute name="isMandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="for">
          <xsl:value-of select="$idPrefix"/>
        </xsl:attribute>
        <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
      </label>
    </xsl:if>
    <p class="controls">
      <textarea id="{$idPrefix}" cols="20" rows="10">
        <xsl:attribute name="element_id">
          <xsl:value-of select="$element_id"/>
        </xsl:attribute>
        <xsl:attribute name="name">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="path">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="mandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:if test="../../isMandatory != &apos;NA&apos;">
          <xsl:attribute name="required">required</xsl:attribute>
        </xsl:if>
        <xsl:attribute name="class">mandatory_<xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="datatype">
          <xsl:value-of select="hasDatatype"/>
        </xsl:attribute>
        <xsl:attribute name="fixed">
          <xsl:value-of select="isFixed"/>
        </xsl:attribute>
        <xsl:attribute name="queryStringParameter">
          <xsl:value-of select="queryStringParameter"/>
        </xsl:attribute>
        <xsl:attribute name="isLanguageNeutral">
          <xsl:value-of select="isLanguageNeutral"/>
        </xsl:attribute>
        <xsl:attribute name="outIndex">
          <xsl:value-of select="outIndex"/>
        </xsl:attribute>
        <xsl:value-of select="defaultValue"/>
      </textarea>
    </p>
  </xsl:template>
  <xsl:template match="produces/item[hasDatatype=&apos;code&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
        <xsl:with-param name="id" select="$idPrefix"/>
      </xsl:apply-templates>
    </script>
    <xsl:if test="label">
      <label class="control-label">
        <xsl:attribute name="isMandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="for">
          <xsl:value-of select="$idPrefix"/>
        </xsl:attribute>
        <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
      </label>
    </xsl:if>
    <p class="controls">
      <select id="{$idPrefix}">
        <xsl:attribute name="element_id">
          <xsl:value-of select="$element_id"/>
        </xsl:attribute>
        <xsl:attribute name="class">mandatory_<xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:if test="../../isMandatory != &apos;NA&apos;">
          <xsl:attribute name="required">required</xsl:attribute>
        </xsl:if>
        <xsl:attribute name="lookup">
          <xsl:value-of select="hasValue"/>
        </xsl:attribute>
        <xsl:attribute name="path">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="defaultValue">
          <xsl:value-of select="defaultValue"/>
        </xsl:attribute>
        <xsl:attribute name="mandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="queryStringParameter">
          <xsl:value-of select="queryStringParameter"/>
        </xsl:attribute>
        <xsl:attribute name="isLanguageNeutral">
          <xsl:value-of select="isLanguageNeutral"/>
        </xsl:attribute>
        <xsl:attribute name="datatype">
          <xsl:value-of select="hasDatatype"/>
        </xsl:attribute>
        <xsl:attribute name="fixed">
          <xsl:value-of select="isFixed"/>
        </xsl:attribute>
        <xsl:attribute name="outIndex">
          <xsl:value-of select="outIndex"/>
        </xsl:attribute>
        <xsl:if test="isFixed=&apos;true&apos;">
          <xsl:attribute name="style">display: none;</xsl:attribute>
        </xsl:if>
        <xsl:if test="/template/settings/languageSelection/element=$element_id and /template/settings/languageSelection/itemIndex = hasIndex">
          <xsl:attribute name="languageSelector">true</xsl:attribute>
        </xsl:if>
      </select>
    </p>
  </xsl:template>
  <xsl:template match="produces/item[isFixed=&apos;false&apos; and hasDatatype=&apos;query&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <xsl:if test="label">
      <script language="javascript"> var <xsl:value-of select="$idPrefix"/>_labels = []; <xsl:apply-templates select="label" mode="item-label-translations">
          <xsl:with-param name="id" select="$idPrefix"/>
        </xsl:apply-templates>
      </script>
      <label class="control-label">
        <xsl:attribute name="isMandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="for">
          <xsl:value-of select="$idPrefix"/>
        </xsl:attribute>
        <xsl:value-of select="label[@xml:lang=/template/settings/defaultLanguage]"/>
      </label>
    </xsl:if>
    <p class="controls">
      <select id="{$idPrefix}">
        <xsl:attribute name="datatype">
          <xsl:value-of select="hasDatatype"/>
        </xsl:attribute>
        <xsl:attribute name="queryStringParameter">
          <xsl:value-of select="queryStringParameter"/>
        </xsl:attribute>
        <xsl:attribute name="isLanguageNeutral">
          <xsl:value-of select="isLanguageNeutral"/>
        </xsl:attribute>
        <xsl:attribute name="fixed">
          <xsl:value-of select="isFixed"/>
        </xsl:attribute>
        <xsl:attribute name="element_id">
          <xsl:value-of select="$element_id"/>
        </xsl:attribute>
        <xsl:attribute name="class">mandatory_<xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="path">
          <xsl:value-of select="hasPath"/>
        </xsl:attribute>
        <xsl:attribute name="query">
          <xsl:value-of select="hasValue"/>
        </xsl:attribute>
        <xsl:attribute name="defaultValue">
          <xsl:value-of select="defaultValue"/>
        </xsl:attribute>
        <xsl:attribute name="mandatory">
          <xsl:value-of select="../../isMandatory"/>
        </xsl:attribute>
        <xsl:attribute name="outIndex">
          <xsl:value-of select="outIndex"/>
        </xsl:attribute>
        <xsl:if test="../../isMandatory != &apos;NA&apos;">
          <xsl:attribute name="required">required</xsl:attribute>
        </xsl:if>
        <xsl:attribute name="hook">
          <xsl:value-of select="id"/>
        </xsl:attribute>
      </select>
    </p>
  </xsl:template>
  <!--<xsl:template match="produces/item[isFixed='true' or (hasDatatype!='user-defined' and hasDatatype!='code')]">

        <p><i><xsl:value-of select="hasPath"/></i></p>

    </xsl:template> -->
  <xsl:template match="produces/item[isFixed=&apos;true&apos; and hasDatatype!=&apos;code&apos; and hasDatatype!=&apos;query&apos;]">
    <xsl:param name="element_id"/>
    <xsl:variable name="idPrefix">
      <xsl:value-of select="$element_id"/>_<xsl:value-of select="hasIndex"/>
    </xsl:variable>
    <input type="hidden" id="{$idPrefix}">
      <xsl:attribute name="element_id">
        <xsl:value-of select="$element_id"/>
      </xsl:attribute>
      <xsl:attribute name="name">
        <xsl:value-of select="hasPath"/>
      </xsl:attribute>
      <xsl:attribute name="path">
        <xsl:value-of select="hasPath"/>
      </xsl:attribute>
      <xsl:attribute name="value">
        <xsl:value-of select="hasValue"/>
      </xsl:attribute>
      <xsl:attribute name="queryStringParameter">
        <xsl:value-of select="queryStringParameter"/>
      </xsl:attribute>
      <xsl:attribute name="isLanguageNeutral">
        <xsl:value-of select="isLanguageNeutral"/>
      </xsl:attribute>
      <xsl:attribute name="prova">
        <xsl:value-of select="hasValue"/>
      </xsl:attribute>
      <xsl:attribute name="datatype">
        <xsl:value-of select="hasDatatype"/>
      </xsl:attribute>
      <xsl:attribute name="fixed">
        <xsl:value-of select="isFixed"/>
      </xsl:attribute>
      <xsl:attribute name="useCode">
        <xsl:value-of select="useCode"/>
      </xsl:attribute>
      <xsl:attribute name="useURN">
        <xsl:value-of select="useURN"/>
      </xsl:attribute>
      <xsl:attribute name="mandatory">
        <xsl:value-of select="../../isMandatory"/>
      </xsl:attribute>
      <xsl:if test="../../isMandatory != &apos;NA&apos;">
        <xsl:attribute name="required">required</xsl:attribute>
      </xsl:if>
      <xsl:attribute name="class">mandatory_<xsl:value-of select="../../isMandatory"/>
      </xsl:attribute>
      <xsl:if test="hasDatatype=&apos;dependent&apos;">
        <xsl:attribute name="query">
          <xsl:value-of select="hasValue"/>
        </xsl:attribute>
      </xsl:if>
      <xsl:attribute name="outIndex">
        <xsl:value-of select="outIndex"/>
      </xsl:attribute>
    </input>
  </xsl:template>
  <xsl:template match="label" mode="label-translations">
    <xsl:value-of select="../id"/>_labels.push( { lang: &quot;<xsl:value-of select="@xml:lang"/>&quot;, label: &quot;<xsl:value-of select="normalize-space(replace(., &apos;&quot;&apos;, &apos;\\&quot;&apos;))"/>&quot; } ); </xsl:template>
  <xsl:template match="help" mode="help-translations">
    <xsl:param name="id"/>
    <xsl:value-of select="$id"/>_help.push( { lang: &quot;<xsl:value-of select="@xml:lang"/>&quot;, label: &quot;<xsl:value-of select="replace(replace(., &apos;&quot;&apos;, &apos;\\&quot;&apos;), &apos;&#13;&apos;, &apos;&apos;)"/>&quot; } ); </xsl:template>
  <xsl:template match="help" mode="item-help-translations">
    <xsl:param name="id"/>
    <xsl:value-of select="$id"/>_help.push( { lang: &quot;<xsl:value-of select="@xml:lang"/>&quot;, label: &quot;<xsl:value-of select="replace(replace(., &apos;&quot;&apos;, &apos;\\&quot;&apos;), &apos;&#13;&apos;, &apos;&apos;)"/>&quot; } ); </xsl:template>
  <xsl:template match="label" mode="item-label-translations">
    <xsl:param name="id"/>
    <xsl:value-of select="$id"/>_labels.push( { lang: &quot;<xsl:value-of select="@xml:lang"/>&quot;, label: &quot;<xsl:value-of select="normalize-space(replace(., &apos;&quot;&apos;, &apos;\\&quot;&apos;))"/>&quot; } ); </xsl:template>
  <xsl:template match="*"/>
</xsl:stylesheet>