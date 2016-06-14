/**
 * jquery.string - Prototype string functions for jQuery
 * version: 1.1.0
 * (c) 2008-2011 David E. Still (http://stilldesigning.com)
 * Original Prototype extensions (c) 2005-2011 Sam Stephenson (http://prototypejs.org)
 */

(function($){
	$.extend({
		__stringPrototype: function(str){
			var splitCheck = ("a b".split(/\w/)[0] == " "); // test for crappy IE matching (feature sniffing instead of version sniffing)
			function makeRegExpGlobal(p) {
				if (!p.source) { return p; }
				var mods = "g"+((p.ignoreCase)?"i":"")+((p.multiline)?"m":"");
				return new RegExp(p.source, mods);
			}

			this.str = str;
			/**
			 * ScriptFragmet, specialChar, and JSONFilter borrowed from Prototype 1.6.0.2
			 */
		 	this.JSONFilter = /^\/\*-secure-([\s\S]*)\*\/\s*$/;
			this.ScriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script>';
			this.specialChar = {
				'\b': '\\b',
				'\t': '\\t',
				'\n': '\\n',
				'\f': '\\f',
				'\r': '\\r',
				'\\': '\\\\'
			};
		
			/**
			 * Check if the string is blank (white-space only or empty).
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean of result
			 */
			this.blank = function(s) {
				return /^\s*$/.test(this.s(s) || ' ');
			};
			/**
			 * Converts a string separated by dashes into a camelCase equivalent.
			 * For instance, 'foo-bar' would be converted to 'fooBar'.
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean of result
			 */
			this.camelize = function(s) {
				var a = this.s(s).split('-'), i;
				s = [a[0]];
				for (i=1; i<a.length; i++){
					s.push(a[i].charAt(0).toUpperCase() + a[i].substring(1));
				}
				this.str = s.join('');
				return this;
			};
			/**
			 * Capitalizes the first letter of a string and downcases all the others.
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean of result
			 */
			this.capitalize = function(s) {
				s = this.s(s);
				this.str = s.charAt(0).toUpperCase() + s.substring(1).toLowerCase();
				return this;
			};
			/**
			 * Replaces every instance of the underscore character ("_") by a dash ("-").
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean of result
			 */
			this.dasherize = function(s) {
				this.str = this.s(s).split('_').join('-');
				return this;
			};
			/**
			 * Check if the string is empty.
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean of result
			 */
			this.empty = function(s) {
				return (s)?(s==''):(this.str=='');
			};
			/**
			 * Tests whether the end of a string matches pattern.
			 * @param {Object} pattern
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean of result
			 */
			this.endsWith = function(pattern, s) {
				s = this.s(s);
				var d = s.length - pattern.length;
				return d >= 0 && s.lastIndexOf(pattern) === d;
			};
			/**
			 * escapeHTML from Prototype-1.6.0.2 -- If it's good enough for Webkit and IE, it's good enough for Gecko!
			 * Converts HTML special characters to their entity equivalents.
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.escapeHTML = function(s) {
				this.str = this.s(s)
						.split('&').join('&amp;')
						.split('<').join('&lt;')
						.split('>').join('&gt;');
				return this;
			};
			/**
			 * evalJSON from Prototype-1.6.0.2
			 * Evaluates the JSON in the string and returns the resulting object. If the optional sanitize parameter
			 * is set to true, the string is checked for possible malicious attempts and eval is not called if one
			 * is detected.
			 * @param {String} s string to be evaluated
			 * @return {Object} evaluated JSON result
			 */
			this.evalJSON = function(sanitize, s) {
				s = this.s(s);
				var json = this.unfilterJSON(false, s).str;
				try {
					if (!sanitize || this.isJSON(json)) {
						return eval('(' + json + ')');
					}
				} catch (e) { }
				throw new SyntaxError('Badly formed JSON string: ' + s);
			};
			/**
			 * evalScripts from Prototype-1.6.0.2
			 * Evaluates the content of any script block present in the string. Returns an array containing
			 * the value returned by each script.
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.evalScripts = function(s) {
				var scriptTags = this.extractScripts(this.s(s)), results = [];
				if (scriptTags.length > 0) {
					for (var i = 0; i < scriptTags.length; i++) {
						results.push(eval(scriptTags[i]));
					}
				}
				return results;
			};
			/**
			 * extractScripts from Prototype-1.6.0.2
			 * Extracts the content of any script block present in the string and returns them as an array of strings.
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.extractScripts = function(s) {
				var matchAll = new RegExp(this.ScriptFragment, 'img'), matchOne = new RegExp(this.ScriptFragment, 'im'), scriptMatches = this.s(s).match(matchAll) || [], scriptTags = [];
				if (scriptMatches.length > 0) {
					for (var i = 0; i < scriptMatches.length; i++) {
						scriptTags.push(scriptMatches[i].match(matchOne)[1] || '');
					}
				}
				return scriptTags;
			};
			/**
			 * Returns a string with all occurances of pattern replaced by either a regular string
			 * or the returned value of a function.  Calls sub internally.
			 * @param {Object} pattern RegEx pattern or string to replace
			 * @param {Object} replacement string or function to replace matched patterns
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 * @see sub
			 */
			this.gsub = function(pattern, replacement, s) {
				s = this.s(s);
				if ($.isFunction(replacement)) {
					var match = s.match(makeRegExpGlobal(pattern));
					if (match == null) { return this; }
					s = this.sub(pattern, replacement, match.length, s).str;
				}
				/* if replacement is not a function, do this the easy way; it's quicker */
				else { s = s.split(pattern).join(replacement); }
				this.str = s;
				return this;
			};
			/**
			 * Check if the string contains a substring.
			 * @param {Object} pattern RegEx pattern or string to find
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean result
			 */
			this.include = function(pattern, s) {
				return this.s(s).indexOf(pattern) > -1;
			};
			/**
			 * Returns a debug-oriented version of the string (i.e. wrapped in single or double quotes,
			 * with backslashes and quotes escaped).
			 * @param {Object} useDoubleQuotes escape double-quotes instead of single-quotes
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.inspect = function(useDoubleQuotes, s) {
				s = this.s(s);
				var specialChar = this.specialChar,
					escapedString = this.gsub(/[\x00-\x1f\\]/, function(match) {
						var character = specialChar[match[0]];
						return character ? character : '\\u00' + match[0].charCodeAt().toPaddedString(2, 16);
				    }, s).str;
				this.str = (useDoubleQuotes) ? '"' + escapedString.replace(/"/g, '\\"') + '"' : "'" + escapedString.replace(/'/g, '\\\'') + "'";
				return this;
			};
			/**
			 * Treats the string as a Prototype-style Template and fills it with objectÍs properties.
			 * @param {Object} obj object of values to replace in string
			 * @param {Object} pattern RegEx pattern for template replacement (default matches Ruby-style '#{attribute}')
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.interpolate = function(obj, pattern, s) {
				s = this.s(s);
				if (!pattern) { pattern = /(^|.|\r|\n)(\#\{\s*(\w+)\s*\})/; }
				var count = 0,
					length = s.length,
					match;
				while (pattern.match(s) && count++ < length) {
					match = pattern.exec(s);
					s = this.gsub(match[2],obj[match[3]], s).str;
				}
				this.str = s;
				return this;
			};
			/**
			 * isJSON from Prototype-1.6.0.2
			 * Check if the string is valid JSON by the use of regular expressions. This security method is called internally.
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean result
			 */
			this.isJSON = function(s) {
				s = this.s(s);
				if (this.blank(s)) { return false; }
				s = s.replace(/\\./g, '@').replace(/"[^"\\\n\r]*"/g, '');
				return (/^[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]*$/).test(s);
			};
			/**
			 * Evaluates replacement for each match of pattern in string and returns the original string.
			 * Calls sub internally.
			 * @param {Object} pattern RegEx pattern or string to replace
			 * @param {Object} replacement string or function to replace matched patterns
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 * @see sub
			 */
			this.scan = function(pattern, replacement, s) {
				s = this.s(s);
				this.gsub(pattern, replacement, s).str = s;
				return this;
			};
			/**
			 * Tests whether the beginning of a string matches pattern.
			 * @param {Object} pattern
			 * @param {String} s string to be evaluated
			 * @return {Boolean} boolean of result
			 */
			this.startsWith = function(pattern, s) {
				return this.s(s).indexOf(pattern) === 0;
			};
			/**
			 * Trims white space from the beginning and end of a string.
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.strip = function(s) {
				this.str = $.trim(this.s(s));
				return this;
			};
			/**
			 * Strips a string of anything that looks like an HTML script block.
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.stripScripts = function(s) {
				this.str = this.s(s).replace(new RegExp(this.ScriptFragment, 'img'), '');
				return this;
			};
			/**
			 * Strips a string of any HTML tags.
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.stripTags = function(s) {
				this.str = this.s(s).replace(/<\/?[^>]+>/gi, '');
				return this;
			};
			/**
			 * Returns a string with the first count occurances of pattern replaced by either a regular string
			 * or the returned value of a function.
			 * @param {Object} pattern RegEx pattern or string to replace
			 * @param {Object} replacement string or function to replace matched patterns
			 * @param {Integer} count number of (default = 1, -1 replaces all)
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.sub = function(pattern, replacement, count, s) {
				s = this.s(s);
				count = (!count)?1:count;
				if (count < 0 || isNaN(count)) { return this; }
				// make RegExp global
				pattern = makeRegExpGlobal(pattern);
				var sarray = s.split(pattern), matches = s.match(pattern);
				if (splitCheck && typeof(pattern) == "object") {
					if (count == matches.length) ++count;
					if (s.indexOf(matches[0]) == 0) sarray.unshift("");
					if (s.lastIndexOf(matches[matches.length-1]) == s.length - matches[matches.length-1].length) sarray.push("");
				}
				s = sarray[0];
				for (var i=1; i<sarray.length; i++) {
					if (i <= count) {
						if ($.isFunction(replacement)) {
							s += replacement(matches[i-1] || matches) + sarray[i];
						} else { s += replacement + sarray[i]; }
					} else { s += (matches[i-1] || matches) + sarray[i]; }
				}
				this.str = s;
				return this;
			};
			/**
			 * succ from Prototype-1.6.0.2
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.succ = function(s) {
				s = this.s(s);
				this.str = s.slice(0, s.length - 1) + String.fromCharCode(s.charCodeAt(s.length - 1) + 1);
				return this;
			};
			/**
			 * times from Prototype-1.6.0.2
			 * Concatenate count number of copies of s together and return result.
			 * @param {Integer} count Number of times to repeat s
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.times = function(count, s) {
				this.str = count < 1 ? "" : (new Array(count + 1)).join(this.s(s));
				return this;
			};
			/**
			 * Returns a JSON string
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.toJSON = function(s) {
				return this.inspect(true, this.s(s));
			};
			/**
			 * Parses a URI-like query string and returns an object composed of parameter/value pairs.
			 * This method is mainly targeted at parsing query strings (hence the default value of '&'
			 * for the seperator argument). For this reason, it does not consider anything that is either
			 * before a question mark (which signals the beginning of a query string) or beyond the hash 
			 * symbol ("#"), and runs decodeURIComponent() on each parameter/value pair.
			 * @param {Object} separator string to separate parameters (default = '&')
			 * @param {Object} s
			 * @return {Object} object
			 */
			this.toQueryParams = function(separator, s) {
				s = this.s(s);
				var paramsList = s.substring(s.indexOf('?')+1).split('#')[0].split(separator || '&'), params = {}, i, key, value, pair;
				for (i=0; i<paramsList.length; i++) {
					pair = paramsList[i].split('=');
					key = decodeURIComponent(pair[0]);
					value = (pair[1])?decodeURIComponent(pair[1]):undefined;
					if (params[key]) {
						if (typeof params[key] == "string") { params[key] = [params[key]]; }
						params[key].push(value);
					} else { params[key] = value; }
				}
				return params;
			};
			/**
			 * truncate from Prototype-1.6.0.2
			 * Truncates a string to the given length and appends a suffix to it (indicating that it is only an excerpt).
			 * @param {Object} length length of string to truncate to
			 * @param {Object} truncation string to concatenate onto truncated string (default = '...')
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.truncate = function(length, truncation, s) {
				s = this.s(s);
				length = length || 30;
				truncation = (!truncation) ? '...' : truncation;
				s = (s.length > length) ? s.slice(0, length - truncation.length) + truncation : String(s);
				this.str = s;
				return this;
			};
			/**
			 * underscore from Prototype-1.6.0.2
			 * Converts a camelized string into a series of words separated by an underscore ("_").
			 * e.g. $.string('borderBottomWidth').underscore().str = 'border_bottom_width'
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.underscore = function(s) {
				//s = this.s(s);
				//this.str = $.string(s).gsub(/::/, "/").gsub(/([A-Z]+)([A-Z][a-z])/, "#{1}_#{2}").gsub(/([a-z\d])([A-Z])/, "#{1}_#{2}").gsub(/-/, "_").str.toLowerCase();
				this.gsub(/[A-Z]/, function(m){ return "_" + m.toLowerCase(); }, this.s(s));
				if (this.str.substring(0,1) == "_") {
					this.str = this.str.substring(1);
				}
				return this;
			};
			/**
			 * unescapeHTML from Prototype-1.6.0.2 -- If it's good enough for Webkit and IE, it's good enough for Gecko!
			 * Strips tags and converts the entity forms of special HTML characters to their normal form.
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.unescapeHTML = function(s) {
				this.str = this.stripTags(this.s(s)).str.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
				return this;
			};
			/**
			 * unfilterJSON from Prototype-1.6.0.2.
			 * @param {Function} filter
			 * @param {String} s string to be evaluated
			 * @return {Object} .string object (or string if internal)
			 */
			this.unfilterJSON = function(filter, s) {
				s = this.s(s);
				filter = filter || this.JSONFilter;
				var filtered = s.match(filter);
				this.str = (filtered !== null)?filtered[1]:s;
				return this;
			};

			/**
			 * value -- convenience method to return .str
			 */
			this.value = function() {
				return this.str;
			};
			/**
			 * fetch str internally if no parameter is given
			 */
			this.s = function(s) {
				return (s)?s:this.str;
			};

		},
		string: function(str) {
			if (str === String.prototype) { $.extend(String.prototype, new $.__stringPrototype()); }
			else { return new $.__stringPrototype(str); }
		}
	});
	$.__stringPrototype.parseQuery = $.__stringPrototype.toQueryParams;
})(jQuery);