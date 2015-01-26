/**
 * Created by fabio on 19/11/14.
 */
var Item = (function() {

    var item = {
        id: undefined,
        elementId: undefined,
        path: undefined,
        datatype: undefined,
        fixed: undefined,
        useCode: undefined,
        useURN: undefined,
        outIndex: undefined,
        value: undefined,
        labelValue: undefined,
        codeValue: undefined,
        urnValue: undefined,
        languageNeutral: undefined,
        listeningFor: undefined,
        isLanguageNeutral: undefined,
        startListening: function() {
            var item = this;
            console.log("listening for " + "#" + item.id);
            item.listeningFor = "#" + item.id;
            // $("#" + item.id).unbind("change", update);
            $("#" + item.id).change(ediml.changeHandler);
        },
        isMandatory: function() {
            var element = ediml.getElement(elementId);
            return ( element.mandatory != "NA" );
        },
        getAlternativeElement: function() {
            var item = this;
            if ( typeof item.elementId === "undefined" ) {
                console.error("item " + item.id + " has no associated element");
                console.log(item);
                return;
            }
            var element = ediml.getElement(item.elementId);
            if ( element.alternativeTo ) {
                return ediml.getElement(element.alternativeTo);
            }
            return undefined;
        }
    };

    return item;
});