/**
 * jQuery.string Test Suite
 * (c) 2008-2011 David E. Still (http://stilldesigning.com)
 */

/**
 * Test Suite function list.  Each function to be tested has its own attribute with a list of functions.
 * All functions should return true to pass the test.
 */
var testSuite = {
	blank: [
		function() { return jQuery.string("").blank(); },
		function() { return jQuery.string("   ").blank(); },
		function() { return !(jQuery.string("  f  ").blank()); },
		function() { return !(jQuery.string("foo").blank()); }
	],
	camelize: [
		function() { return (jQuery.string("background-color").camelize().str == "backgroundColor"); },
		function() { return (jQuery.string("-moz-binding").camelize().str == "MozBinding"); }
	],
	capitalize: [
		function() { return (jQuery.string("hello").capitalize().str == "Hello"); },
		function() { return (jQuery.string("HELLO WORLD").capitalize().str == "Hello world"); }
	],
	dasherize: [
		function() { return (jQuery.string("border_bottom_width").dasherize().str == "border-bottom-width"); }
	],
	empty: [
		function() { return (jQuery.string("").empty()); },
		function() { return (!jQuery.string(" ").empty()); }
	],
	endsWith: [
		function() { return jQuery.string("slaughter").endsWith("laughter"); },
		function() { return !jQuery.string("laughter is the best medicine").endsWith("laughter"); }
	],
	escapeHTML: [
		function() { return jQuery.string("<div class=\"article\">This is an article</div>").escapeHTML().str == "&lt;div class=\"article\"&gt;This is an article&lt;/div&gt;"; }
	],
	evalJSON: [
		function() {
			var test = jQuery.string('{ "name": "Violet", "occupation": "character" }').evalJSON();
			return test.name == "Violet" && test.occupation == "character";
		},
		function() {
			var test = jQuery.string('{ "name": "Violet", "occupation": "character" }').evalJSON(true);
			return test.name == "Violet" && test.occupation == "character";
		},
		function(){
			var test = false;
			try {
				jQuery.string('grabUserPassword()').evalJSON(true);
			} 
			catch (e) {
				test = true;
			}
			return test;
		},
		function() {
			var test = jQuery.string('/*-secure-\n{ "name": "Violet", "occupation": "character" }\n*/').evalJSON();
			return test.name == "Violet" && test.occupation == "character";
		}
	],
	evalScripts: [
		function() {
			var test = jQuery.string("test scripts<script>2 + 2</script> more test here<script language='javascript' type='text/javascript'>['foo','bar'].join('');</script>").evalScripts();
			return (test[0] == 4 && test[1] == 'foobar');
		},
		function() { return jQuery.string("ain't <b>frakking</b> no <h1>script tags</h1> here").evalScripts().length === 0; }
	],
	extractScripts: [
		function() {
			var test = jQuery.string("test scripts<script>2 + 2</script> more test here<script language='javascript' type='text/javascript'>['foo','bar'].join('');</script>").extractScripts();
			return (test[0] == '2 + 2' && test[1] == "['foo','bar'].join('');");
		},
		function() { return jQuery.string("ain't <b>frakking</b> no <h1>script tags</h1> here").extractScripts().length === 0; }
	],
	gsub: [
		function() { return jQuery.string("this is a test").gsub(" ", "-").str == "this-is-a-test"; },
		function() { return jQuery.string("this is a test").gsub(/\w+/, function(m){ return "["+m+"]"; }).str == "[this] [is] [a] [test]"; }
	],
	include: [
		function() { return jQuery.string("Not just the Prototype framework any more").include("frame"); },
		function() { return !jQuery.string("Not just the Prototype framework any more").include("frameset"); }
	],
	inspect: [
		function() { return jQuery.string('I\'m so happy.').inspect().str == "'I\\'m so happy.'"; },
		function() { return jQuery.string('I\'m so happy.').inspect(true).str == "\"I'm so happy.\""; }
	],
	interpolate: [
		function() { return jQuery.string("#{animals} on a #{transport}").interpolate({ animals: "Pigs", transport: "Surfboard"}).str == "Pigs on a Surfboard"; },
		function() { return jQuery.string('<div>Name: <b><%= name %></b>, Age: <b><%=age%></b></div>').interpolate({ name: 'John Smith', age: 26 }, /(^|.|\r|\n)(\<%=\s*(\w+)\s*%\>)/).str == '<div>Name: <b>John Smith</b>, Age: <b>26</b></div>'; }
	],
	isJSON: [
		function() { return !jQuery.string("something").isJSON(); },
		function() { return jQuery.string("\"something\"").isJSON(); },
		function() { return !jQuery.string("{ foo: 42 }").isJSON(); },
		function() { return jQuery.string("{ \"foo\": 42 }").isJSON(); }
	],
	scan: [
		function() {
			var fruits = [];
			jQuery.string('apple, pear & orange').scan(/\w+/, function(match){ fruits.push(match)});
			return fruits.join("-") == "apple-pear-orange"
		},
		function() {
			var fruits = [];
			return jQuery.string('apple, pear & orange').scan(/\w+/, function(match){ fruits.push(match)}).str == 'apple, pear & orange';
		}
	],
	startsWith: [
		function() { return jQuery.string("slaughter").startsWith("slaugh"); },
		function() { return !jQuery.string("laughter is the best medicine").startsWith("medicine"); }
	],
	strip: [
		function() { return jQuery.string("   foo!  ").strip().str == "foo!"; },
		function() { return jQuery.string("  	 foo").strip().str == "foo"; },
		function() { return jQuery.string("foo  ").strip().str == "foo"; },
		function() { return jQuery.string("foo").strip().str == "foo"; }
	],
	stripScripts: [
		function() { return jQuery.string('a <a href="#">link</a><script>alert("hello world!")</script>').stripScripts().str == 'a <a href="#">link</a>'; },
		function() { return jQuery.string('a <a href="#">link</a>').stripScripts().str == 'a <a href="#">link</a>'; },
		function() { return jQuery.string('a <a href="#">link</a><script>alert("hello world!")</script>America! Heck, yeah!').stripScripts().str == 'a <a href="#">link</a>America! Heck, yeah!'; }
	],
	stripTags: [
		function() { return jQuery.string('a <a href="#">link</a><script>alert("hello world!")</script>').stripTags().str == 'a linkalert("hello world!")'; }
	],
	sub: [
		function() { return jQuery.string("this is a test").sub(" ", "-").str == "this-is a test"; },
		function() { return jQuery.string("this is a test").sub(" ", "-", 2).str == "this-is-a test"; },
		function() { return jQuery.string("this is a test").sub(/\w+/, function(m){ return "["+m+"]"; }).str == "[this] is a test"; },
		function() { return jQuery.string("this is a test").sub(/\w+/, function(m){ return "["+m+"]"; }, 3).str == "[this] [is] [a] test"; },
		function() { return jQuery.string("this is a test").sub(/\w+/, function(m){ return "["+m+"]"; }, -1).str == "this is a test"; }
	],
	succ: [
		function() { return jQuery.string("a").succ().str == "b"; },
		function() { return jQuery.string("aaaa").succ().str == "aaab"; }
	],
	times: [
		function() { return jQuery.string("foo!").times(0).str == ""; },
		function() { return jQuery.string("foo!").times(3).str == "foo!foo!foo!"; }
	],
	toJSON: [
		function() { return jQuery.string('The "Quoted" chronicles').toJSON().str == '"The \\"Quoted\\" chronicles"'; }
	],
	toQueryParams: [
		function() {
			var params = jQuery.string('foo.html?section=blog&id=45').toQueryParams();
			return params.section == 'blog' && params.id == '45';
		},
		function() {
			var params = jQuery.string('foo.html?section=blog&id=45#comments').toQueryParams();
			return params.section == 'blog' && params.id == '45';
		},
		function() {
			var params = jQuery.string('section=blog;id=45').toQueryParams(';');
			return params.section == 'blog' && params.id == '45';
		},
		function() {
			var params = jQuery.string('section=blog&tag=javascript&tag=prototype&tag=doc').toQueryParams();
			return params.section == 'blog' && params.tag[0] == 'javascript' && params.tag[1] == 'prototype' && params.tag[2];
		},
		function() {
			var params = jQuery.string('tag=ruby%20on%20rails').toQueryParams(';');
			return params.tag == 'ruby on rails';
		},
		function() {
			var params = jQuery.string('id=45&raw').toQueryParams();
			return params.id == '45' && params.raw === undefined;
		}
	],
	truncate: [
		function() { return jQuery.string('A random sentence whose length exceeds 30 characters.').truncate().str == 'A random sentence whose len...'; },
		function() { return jQuery.string('Some random text').truncate().str == 'Some random text'; },
		function() { return jQuery.string('Some random text').truncate(10).str == 'Some ra...'; },
		function() { return jQuery.string('Some random text').truncate(10, '[...]').str == 'Some [...]'; }
	],
	underscore: [
		function() { return jQuery.string('borderBottomWidth').underscore().str == 'border_bottom_width'; },
		function() { return jQuery.string('BorderBottomWidth').underscore().str == 'border_bottom_width'; }
	],
	unescapeHTML: [
		function() { return jQuery.string('x &gt; 10').unescapeHTML().str == 'x > 10'; },
		function() { return jQuery.string('<h1>Pride &amp; Prejudice</h1>').unescapeHTML().str == 'Pride & Prejudice'; }
	],
	unfilterJSON: [
		function() { return jQuery.string('/*-secure-\n{"name": "Violet", "occupation": "character", "age": 25}\n*/').unfilterJSON().str == '\n{"name": "Violet", "occupation": "character", "age": 25}\n'; }
	]
},
testSuitePrototype = {
	blank: [
		function() { return "".blank(); },
		function() { return "   ".blank(); },
		function() { return !"  f  ".blank(); },
		function() { return !("foo".blank()); }
	],
	camelize: [
		function() { return ("background-color".camelize() == "backgroundColor"); },
		function() { return ("-moz-binding".camelize() == "MozBinding"); }
	],
	capitalize: [
		function() { return ("hello".capitalize() == "Hello"); },
		function() { return ("HELLO WORLD".capitalize() == "Hello world"); }
	],
	dasherize: [
		function() { return ("border_bottom_width".dasherize() == "border-bottom-width"); }
	],
	empty: [
		function() { return ("".empty()); },
		function() { return (!" ".empty()); }
	],
	endsWith: [
		function() { return "slaughter".endsWith("laughter"); },
		function() { return !"laughter is the best medicine".endsWith("laughter"); }
	],
	escapeHTML: [
		function() { return "<div class=\"article\">This is an article</div>".escapeHTML() == "&lt;div class=\"article\"&gt;This is an article&lt;/div&gt;"; }
	],
	evalJSON: [
		function() {
			var test = '{ "name": "Violet", "occupation": "character" }'.evalJSON();
			return test.name == "Violet" && test.occupation == "character";
		},
		function() {
			var test = '{ "name": "Violet", "occupation": "character" }'.evalJSON(true);
			return test.name == "Violet" && test.occupation == "character";
		},
		function(){
			var test = false;
			try {
				'grabUserPassword()'.evalJSON(true);
			} 
			catch (e) {
				test = true;
			}
			return test;
		},
		function() {
			var test = '/*-secure-\n{ "name": "Violet", "occupation": "character" }\n*/'.evalJSON();
			return test.name == "Violet" && test.occupation == "character";
		}
	],
	evalScripts: [
		function() {
			var test = "test scripts<script>2 + 2</script> more test here<script language='javascript' type='text/javascript'>['foo','bar'].join('');</script>".evalScripts();
			return (test[0] == 4 && test[1] == 'foobar');
		},
		function() { return "ain't <b>frakking</b> no <h1>script tags</h1> here".evalScripts().length === 0; }
	],
	extractScripts: [
		function() {
			var test = "test scripts<script>2 + 2</script> more test here<script language='javascript' type='text/javascript'>['foo','bar'].join('');</script>".extractScripts();
			return (test[0] == '2 + 2' && test[1] == "['foo','bar'].join('');");
		},
		function() { return "ain't <b>frakking</b> no <h1>script tags</h1> here".extractScripts().length === 0; }
	],
	gsub: [
		function() { return "this is a test".gsub(" ", "-") == "this-is-a-test"; },
		function() { return "this is a test".gsub(/\w+/, function(m){ return "["+m+"]"; }) == "[this] [is] [a] [test]"; }
	],
	include: [
		function() { return "Not just the Prototype framework any more".include("frame"); },
		function() { return !"Not just the Prototype framework any more".include("frameset"); }
	],
	inspect: [
		function() { return 'I\'m so happy.'.inspect() == "'I\\'m so happy.'"; },
		function() { return 'I\'m so happy.'.inspect(true) == "\"I'm so happy.\""; }
	],
	interpolate: [
		function() { return "#{animals} on a #{transport}".interpolate({ animals: "Pigs", transport: "Surfboard"}) == "Pigs on a Surfboard"; },
		function() { return '<div>Name: <b><%= name %></b>, Age: <b><%=age%></b></div>'.interpolate({ name: 'John Smith', age: 26 }, /(^|.|\r|\n)(\<%=\s*(\w+)\s*%\>)/) == '<div>Name: <b>John Smith</b>, Age: <b>26</b></div>'; }
	],
	isJSON: [
		function() { return !"something".isJSON(); },
		function() { return "\"something\"".isJSON(); },
		function() { return !"{ foo: 42 }".isJSON(); },
		function() { return "{ \"foo\": 42 }".isJSON(); }
	],
	scan: [
		function() {
			var fruits = [];
			'apple, pear & orange'.scan(/\w+/, function(match){ fruits.push(match)});
			return fruits.join("-") == "apple-pear-orange"
		},
		function() {
			var fruits = [];
			return 'apple, pear & orange'.scan(/\w+/, function(match){ fruits.push(match)}) == 'apple, pear & orange';
		}
	],
	startsWith: [
		function() { return "slaughter".startsWith("slaugh"); },
		function() { return !"laughter is the best medicine".startsWith("medicine"); }
	],
	strip: [
		function() { return "   foo!  ".strip() == "foo!"; },
		function() { return "  	 foo".strip() == "foo"; },
		function() { return "foo  ".strip() == "foo"; },
		function() { return "foo".strip() == "foo"; }
	],
	stripScripts: [
		function() { return 'a <a href="#">link</a><script>alert("hello world!")</script>'.stripScripts() == 'a <a href="#">link</a>'; },
		function() { return 'a <a href="#">link</a>'.stripScripts() == 'a <a href="#">link</a>'; },
		function() { return 'a <a href="#">link</a><script>alert("hello world!")</script>America! Heck, yeah!'.stripScripts() == 'a <a href="#">link</a>America! Heck, yeah!'; }
	],
	stripTags: [
		function() { return 'a <a href="#">link</a><script>alert("hello world!")</script>'.stripTags() == 'a linkalert("hello world!")'; }
	],
	sub: [
		function() { return "this is a test".sub(" ", "-") == "this-is a test"; },
		function() { return "this is a test".sub(" ", "-", 2) == "this-is-a test"; },
		function() { return "this is a test".sub(/\w+/, function(m){ return "["+m+"]"; }) == "[this] is a test"; },
		function() { return "this is a test".sub(/\w+/, function(m){ return "["+m+"]"; }, 3) == "[this] [is] [a] test"; },
		function() { return "this is a test".sub(/\w+/, function(m){ return "["+m+"]"; }, -1) == "this is a test"; }
	],
	succ: [
		function() { return "a".succ() == "b"; },
		function() { return "aaaa".succ() == "aaab"; }
	],
	times: [
		function() { return "foo!".times(0) == ""; },
		function() { return "foo!".times(3) == "foo!foo!foo!"; }
	],
	toJSON: [
		function() { return 'The "Quoted" chronicles'.toJSON() == '"The \\"Quoted\\" chronicles"'; }
	],
	toQueryParams: [
		function() {
			var params = 'foo.html?section=blog&id=45'.toQueryParams();
			return params.section == 'blog' && params.id == '45';
		},
		function() {
			var params = 'foo.html?section=blog&id=45#comments'.toQueryParams();
			return params.section == 'blog' && params.id == '45';
		},
		function() {
			var params = 'section=blog;id=45'.toQueryParams(';');
			return params.section == 'blog' && params.id == '45';
		},
		function() {
			var params = 'section=blog&tag=javascript&tag=prototype&tag=doc'.toQueryParams();
			return params.section == 'blog' && params.tag[0] == 'javascript' && params.tag[1] == 'prototype' && params.tag[2];
		},
		function() {
			var params = 'tag=ruby%20on%20rails'.toQueryParams(';');
			return params.tag == 'ruby on rails';
		},
		function() {
			var params = 'id=45&raw'.toQueryParams();
			return params.id == '45' && params.raw === undefined;
		}
	],
	truncate: [
		function() { return 'A random sentence whose length exceeds 30 characters.'.truncate() == 'A random sentence whose len...'; },
		function() { return 'Some random text'.truncate() == 'Some random text'; },
		function() { return 'Some random text'.truncate(10) == 'Some ra...'; },
		function() { return 'Some random text'.truncate(10, '[...]') == 'Some [...]'; }
	],
	underscore: [
		function() { return 'borderBottomWidth'.underscore() == 'border_bottom_width'; },
		function() { return 'BorderBottomWidth'.underscore() == 'border_bottom_width'; }
	],
	unescapeHTML: [
		function() { return 'x &gt; 10'.unescapeHTML() == 'x > 10'; },
		function() { return '<h1>Pride &amp; Prejudice</h1>'.unescapeHTML() == 'Pride & Prejudice'; }
	],
	unfilterJSON: [
		function() { return '/*-secure-\n{"name": "Violet", "occupation": "character", "age": 25}\n*/'.unfilterJSON() == '\n{"name": "Violet", "occupation": "character", "age": 25}\n'; }
	]
}, results = '', property, tests, i, passed, failed, attempt, testsP, passedP, failedP, attemptP;


jQuery(document).ready(function() {
	for (method in testSuite) {
		results = "<span class='test'>" + method + "... </span>";
		tests = testSuite[method];
		testsP = testSuitePrototype[method];
		passed = true;
		passedP = true;
		failed = [];
		failedP = [];
		timeTrial = 0;
		timeTrialP = 0;
		for (i=0; i<tests.length; i++) {
			timeTrialStart = new Date().valueOf();
			while (new Date().valueOf() - timeTrialStart < 10) {
				++timeTrial;
				try {
					attempt = tests[i]();
				}
				catch(e){ attempt = false; }
			}
			if (attempt === false) {
				passed = false;
				failed.push(i);
			}
			
			//console.log(testsP[i]);
			timeTrialStartP = new Date().valueOf();
			while (new Date().valueOf() - timeTrialStartP < 10) {
				++timeTrialP;
				try {
					attemptP = testsP[i]();
				}
				catch(e){ attemptP = false; }
			}
			//attempt = tests[i]();
			if (attemptP === false) {
				passedP = false;
				failedP.push(i);
			}
		}
		results += (passed)?"<span class='pass'>Passed! ("+(Math.round(timeTrial * 100 / tests.length) / 1000)+"/ms)</span>":"<span class='fail'>Failed!</span> ("+failed.join(", ")+")";
		results += (passedP)?" <span class='prototype'>("+(Math.round(timeTrialP * 100 / testsP.length) / 1000)+"/ms)</span>":"<span class='fail'>Prototype Failed!</span> ("+failedP.join(", ")+")";
		jQuery("#testresults").append(results+"<br />\n");
	}
});
