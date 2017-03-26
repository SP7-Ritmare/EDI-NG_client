"use strict";
var Template = (function () {
    function Template() {
        this.settings = {
            userInterfaceLanguage: {
                '_xml:lang': 'en'
            },
            metadataEndpoint: '',
            sparqlEndpoint: '',
            requiresValidation: true,
            baseDocument: '',
            xsltChain: [{ xslt: '' }],
        };
    }
    return Template;
}());
exports.Template = Template;
