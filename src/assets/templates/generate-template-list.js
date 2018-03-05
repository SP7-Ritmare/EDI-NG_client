#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const templates = [];
const parser = require('xml2json');
const xslt4node = require('xslt4node');

function outputFileName(file) {
    let outfile = path.basename(file, '.xml') + '_newSchema.xml';
    return outfile;
}

function transform(file) {
    config = {
        xsltPath: 'template_xform.xsl',
        sourcePath: file,
        result: outputFileName(file),
        params: {
        },
        props: {
            indent: 'yes'
        }
    };

    xslt4node.transformSync(config);
}

fs.readdirSync('./').forEach(file => {
    if (file.endsWith('.xml')) {
        // console.log(file);
        const content = fs.readFileSync(file, 'utf8');
        const json = JSON.parse(parser.toJson(content));
        // console.log(json.template);
        if (json.template.settings.userInterfaceLanguage) {
            console.log(file, 'version', 2);
            templates.push(file);
        } else {
            if ( !fs.existsSync(file) ) {
                transform(file);
                console.log(file, 'version', 1, outputFileName(file));
                templates.push(outputFileName(file));
            }
        }
    }
})

console.log(templates);
fs.writeFileSync('template-list.json', JSON.stringify(templates), 'utf8');