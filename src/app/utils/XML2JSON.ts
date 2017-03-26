/**
 * Created by fabio on 02/03/2017.
 */
let X2JS = require('./xml2js');

export class XML2JSON {
    private x2js: any;

    constructor() {
        this.x2js = new X2JS();
        console.log('XML2JS', this.x2js.xml_str2json('<pippo>pluto</pippo>'));
    }

    xml2json(xml: string) {
        return this.x2js.xml_str2json(xml);
    }
}
