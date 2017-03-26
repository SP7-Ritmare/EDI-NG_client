"use strict";
/**
 * Created by fabio on 02/03/2017.
 */
var X2JS = require('./xml2js');
var XML2JSON = (function () {
    function XML2JSON() {
        this.x2js = new X2JS();
        console.log('XML2JS', this.x2js.xml_str2json('<pippo>pluto</pippo>'));
    }
    XML2JSON.prototype.xml2json = function (xml) {
        return this.x2js.xml_str2json(xml);
    };
    return XML2JSON;
}());
exports.XML2JSON = XML2JSON;
