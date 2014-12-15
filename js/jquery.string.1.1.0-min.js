/**

 * jquery.string - Prototype string functions for jQuery

 * version: 1.1.0

 * (c) 2008-2011 David E. Still (http://stilldesigning.com)

 * Original Prototype extensions (c) 2005-2011 Sam Stephenson (http://prototypejs.org)

 */

(function(f){f.extend({__stringPrototype:function(h){function i(a){if(!a.source)return a;return RegExp(a.source,"g"+(a.ignoreCase?"i":"")+(a.multiline?"m":""))}var j="a b".split(/\w/)[0]==" ";this.str=h;this.JSONFilter=/^\/\*-secure-([\s\S]*)\*\/\s*$/;this.ScriptFragment="<script[^>]*>([\\S\\s]*?)<\/script>";this.specialChar={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r","\\":"\\\\"};this.blank=function(a){return/^\s*$/.test(this.s(a)||" ")};this.camelize=function(a){var b=this.s(a).split("-"),

c,a=[b[0]];for(c=1;c<b.length;c++)a.push(b[c].charAt(0).toUpperCase()+b[c].substring(1));this.str=a.join("");return this};this.capitalize=function(a){a=this.s(a);this.str=a.charAt(0).toUpperCase()+a.substring(1).toLowerCase();return this};this.dasherize=function(a){this.str=this.s(a).split("_").join("-");return this};this.empty=function(a){return a?a=="":this.str==""};this.endsWith=function(a,b){var b=this.s(b),c=b.length-a.length;return c>=0&&b.lastIndexOf(a)===c};this.escapeHTML=function(a){this.str=

this.s(a).split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;");return this};this.evalJSON=function(a,b){var b=this.s(b),c=this.unfilterJSON(!1,b).str;try{if(!a||this.isJSON(c))return eval("("+c+")")}catch(d){}throw new SyntaxError("Badly formed JSON string: "+b);};this.evalScripts=function(a){var a=this.extractScripts(this.s(a)),b=[];if(a.length>0)for(var c=0;c<a.length;c++)b.push(eval(a[c]));return b};this.extractScripts=function(a){var b=RegExp(this.ScriptFragment,"img"),c=RegExp(this.ScriptFragment,

"im"),a=this.s(a).match(b)||[],b=[];if(a.length>0)for(var d=0;d<a.length;d++)b.push(a[d].match(c)[1]||"");return b};this.gsub=function(a,b,c){c=this.s(c);if(f.isFunction(b)){var d=c.match(i(a));if(d==null)return this;c=this.sub(a,b,d.length,c).str}else c=c.split(a).join(b);this.str=c;return this};this.include=function(a,b){return this.s(b).indexOf(a)>-1};this.inspect=function(a,b){var b=this.s(b),c=this.specialChar,d=this.gsub(/[\x00-\x1f\\]/,function(a){var b=c[a[0]];return b?b:"\\u00"+a[0].charCodeAt().toPaddedString(2,

16)},b).str;this.str=a?'"'+d.replace(/"/g,'\\"')+'"':"'"+d.replace(/'/g,"\\'")+"'";return this};this.interpolate=function(a,b,c){c=this.s(c);b||(b=/(^|.|\r|\n)(\#\{\s*(\w+)\s*\})/);for(var d=0,g=c.length,e;b.match(c)&&d++<g;)e=b.exec(c),c=this.gsub(e[2],a[e[3]],c).str;this.str=c;return this};this.isJSON=function(a){a=this.s(a);if(this.blank(a))return!1;a=a.replace(/\\./g,"@").replace(/"[^"\\\n\r]*"/g,"");return/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/.test(a)};this.scan=function(a,b,c){c=this.s(c);this.gsub(a,

b,c).str=c;return this};this.startsWith=function(a,b){return this.s(b).indexOf(a)===0};this.strip=function(a){this.str=f.trim(this.s(a));return this};this.stripScripts=function(a){this.str=this.s(a).replace(RegExp(this.ScriptFragment,"img"),"");return this};this.stripTags=function(a){this.str=this.s(a).replace(/<\/?[^>]+>/gi,"");return this};this.sub=function(a,b,c,d){d=this.s(d);c=!c?1:c;if(c<0||isNaN(c))return this;var a=i(a),g=d.split(a),e=d.match(a);j&&typeof a=="object"&&(c==e.length&&++c,d.indexOf(e[0])==

0&&g.unshift(""),d.lastIndexOf(e[e.length-1])==d.length-e[e.length-1].length&&g.push(""));d=g[0];for(a=1;a<g.length;a++)d+=a<=c?f.isFunction(b)?b(e[a-1]||e)+g[a]:b+g[a]:(e[a-1]||e)+g[a];this.str=d;return this};this.succ=function(a){a=this.s(a);this.str=a.slice(0,a.length-1)+String.fromCharCode(a.charCodeAt(a.length-1)+1);return this};this.times=function(a,b){this.str=a<1?"":Array(a+1).join(this.s(b));return this};this.toJSON=function(a){return this.inspect(!0,this.s(a))};this.toQueryParams=function(a,

b){var b=this.s(b),c=b.substring(b.indexOf("?")+1).split("#")[0].split(a||"&"),d={},g,e,f;for(g=0;g<c.length;g++)f=c[g].split("="),e=decodeURIComponent(f[0]),f=f[1]?decodeURIComponent(f[1]):void 0,d[e]?(typeof d[e]=="string"&&(d[e]=[d[e]]),d[e].push(f)):d[e]=f;return d};this.truncate=function(a,b,c){c=this.s(c);a=a||30;b=!b?"...":b;this.str=c=c.length>a?c.slice(0,a-b.length)+b:String(c);return this};this.underscore=function(a){this.gsub(/[A-Z]/,function(a){return"_"+a.toLowerCase()},this.s(a));if(this.str.substring(0,

1)=="_")this.str=this.str.substring(1);return this};this.unescapeHTML=function(a){this.str=this.stripTags(this.s(a)).str.replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">");return this};this.unfilterJSON=function(a,b){var b=this.s(b),a=a||this.JSONFilter,c=b.match(a);this.str=c!==null?c[1]:b;return this};this.value=function(){return this.str};this.s=function(a){return a?a:this.str}},string:function(h){if(h===String.prototype)f.extend(String.prototype,new f.__stringPrototype);else return new f.__stringPrototype(h)}});

f.__stringPrototype.parseQuery=f.__stringPrototype.toQueryParams})(jQuery);