if ( !String.prototype.replaceAll ) {
    String.prototype.replaceAll = function (find, replace) {
	var str = this;
	return str.replace(new RegExp(find, 'g'), replace);
    };
}
if (!String.prototype.encodeHTML) {
  String.prototype.encodeHTML = function () {
    return this.replace(/&/g, '&amp;')
               .replace(/</g, '&lt;')
               .replace(/>/g, '&gt;')
               .replace(/"/g, '&quot;')
               .replace(/'/g, '&apos;');
  };
}
if (!String.prototype.decodeHTML) {
  String.prototype.decodeHTML = function () {
    return this.replace(/&apos;/g, "'")
               .replace(/&quot;/g, '"')
               .replace(/&gt;/g, '>')
               .replace(/&lt;/g, '<')
               .replace(/&amp;/g, '&');
  };
}
function formatXml(xml) {
    var formatted;
    formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding;
	padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

function doDebug(args) {
    var i;
    for ( i = 0; i < arguments.length; i++ ) {
	if ( debugToDiv ) {
	    $("#debug").append("<p>" + arguments[i] + "</p>");	
	}
        if ( debugToConsole ) {
	    console.log(arguments[i]);
	}
    }
}

function clone(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
}
function htmlEncode(value){
  //create a in-memory div, set it's inner text(which jQuery automatically encodes)
  //then grab the encoded contents back out.  The div never exists on the page.
  return $('<div/>').text(value).html();
}

function htmlDecode(value){
  return $('<div/>').html(value).text();
}
function xmlToString(xmlData) { 

    var xmlString;
    //IE
    if (window.ActiveXObject){
	xmlString = xmlData.xml;
    }
    // code for Mozilla, Firefox, Opera, etc.
    else{
	xmlString = (new XMLSerializer()).serializeToString(xmlData);
    }
    return xmlString;
}   
function replaceAll(str, find, replace) {
    var re;
    var retVal;
    
    retVal = str.replace(find, replace);
    for ( i = 0; i < 100; i++ ) {
	retVal = retVal.replace(find, replace);
    }
    // doDebug("retVal: " + retVal);
    return retVal;
}

function createXml() {
    var xml = '<?xml version="1.0"?><root/>';
    var doc = jQuery.parseXML(xml);
    
    
    return doc;
}

function querystring(key) {
   if ( typeof queryStringValues != 'undefined' ) {
	if ( typeof queryStringValues[key] != 'undefined' ) {
		return queryStringValues[key];
	}
   }
   var re = new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
   var r = [], m;
   while ( (m=re.exec(document.location.search)) != null )
	r.push(m[1]);
   return r;
}

function basename(str) {
    if ( typeof str === "undefined" ) {
        return "";
    }
    var base = new String(str).substring(str.lastIndexOf('/') + 1);
    if(base.lastIndexOf(".") != -1)
        base = base.substring(0, base.lastIndexOf("."));
    return base;
}
