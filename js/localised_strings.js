/**
 * Localisation system
 * @author Fabio Pavesi (fabio@adamassoft.it)
 */
var localised_strings = {
        it: [
            {
                code: "REQUIRED_FIELD",
                string: "Questo campo &egrave; obbligatorio"
            },
            {
                code: "NOT_AN_INT",
                string: "Questo campo accetta solo valori interi"
            },
            {
                code: "NOT_A_FLOAT",
                string: "Questo campo accetta solo valori numerici reali"
            },
            {
                code: "NOT_A_URI",
                string: "Qui ci va un URI"
            },
            {
                code: "NOT_A_URN",
                string: "Qui ci va un URN"
            },
            {
                code: "START_AFTER_END",
                string: "La data di fine precede quella di inizio"
            },
            {
                code: "NOT_A_DATE",
                string: "Qui ci va una data"
            },
            {
                code: "OR",
                string: "oppure"
            }
        ],
        en: [
            {
                code: "REQUIRED_FIELD",
                string: "This field is required"
            },
            {
                code: "NOT_AN_INT",
                string: "Only integer values are allowed here"
            },
            {
                code: "NOT_A_FLOAT",
                string: "Only floating point numbers here"
            },
            {
                code: "NOT_A_URI",
                string: "This is not a valid URI"
            },
            {
                code: "NOT_A_URN",
                string: "This is not a valid URN"
            },
            {
                code: "START_AFTER_END",
                string: "Start date is after end date"
            },
            {
                code: "NOT_A_DATE",
                string: "This is not a valid date"
            },
            {
                code: "OR",
                string: "OR"
            }
        ]
    };

/**
 *
 * @param string
 * @returns {string}
 */
function localise(string) {
    var retVal = "";
    for ( var j = 0; j < Object.keys(localised_strings).length; j++ ) {
        var lang = Object.keys(localised_strings)[j];
        for ( var i = 0; i < localised_strings[lang].length; i++ ) {
            if ( localised_strings[lang][i].code == string ) {
                retVal += "<span language='" + lang + "'>" + localised_strings[lang][i].string + "</span>";
            }
        }
    }
    return retVal;
}
