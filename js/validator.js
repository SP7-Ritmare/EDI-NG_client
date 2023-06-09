/**
 *
 * Validator module.<br>
 * The {@link validate} method calls all specific validations in turn and returns <b>global</b> validation status.
 *
 * @author Fabio Pavesi (fabio@adamassoft.it)
 * @namespace
 */

var validator = (function() {
    var validations = [
        validateRequiredFields,
        validateIntFields,
        validateFloatFields,
        validateURI,
        validateURN,
        validateDate,
        validateDateRange,
        validateBoundingBox,
        validateAlternativeFields
    ];

    var warnings = 0;
    var errors = 0;

    function error(control, message) {
        errors++;
        control.addClass("invalid");
        control.after("<div class='error-message'>" + localise(message) + " - " + control.val() + "</div>");
    }

    function warning(control, message) {
        warnings++;
        control.addClass("warning");
        control.after("<div class='warning-message'>" + localise(message) + " - " + control.val() + "</div>");
    }

    function validateRequiredFields() {
        var result = true;
        $("*:not(.fixed)[required='required']").each(function() {
            if ( $(this).val() == null || $(this).val().trim() == "" ) {
                var item = ediml.findItemById($(this).attr("id"));
                var alternativeElement = item.getAlternativeElement();
                if ( alternativeElement ) {
                    var self = $(this);
                    $("*[required='required']", $("#" + alternativeElement.id)).each(function() {
                        if ( $(this).val() == null || $(this).val().trim() == "" ) {
                            error(self, "ALTERNATIVE_REQUIRED_FIELD");
                            error($(this), "ALTERNATIVE_REQUIRED_FIELD");
                            result = false;
                        }
                    });
                } else {
                    error($(this), "REQUIRED_FIELD");
                    result = false;
                }
            }
        });
        return result;
    }

    function validateAlternativeFields() {
        var result = true;
        console.log("validateAlternativeFields");
        $(".alternativeGroup").each(function() {
            console.log("alternative group " + $(this).attr("id"));
            var group = "#" + $(this).attr("id");
            $(".element", $("#" + $(this).attr("id"))).first().each(function() {
                var thisOne = "#" + $(this).attr("id");
                var theOtherOne = "#" + $(this).attr("alternativeto");
                var countThese = 0;
                var countTheOtherOnes = 0;
                $(".form-control", thisOne).each(function() {
                    if ( !$(this).hasClass("fixed") && $(this).val() != "" ) {
                        countThese++;
                    }
                })
                $(".form-control", theOtherOne).each(function() {
                    if ( !$(this).hasClass("fixed") && $(this).val() != "" ) {
                        countTheOtherOnes++;
                    }
                })
                if ( countThese > 0 && countTheOtherOnes > 0 ) {
                    warning($(group), "DOUBLE_VALUE_ON_ALTERNATIVE");
                }
                console.log("found " + countThese + " local and " + countTheOtherOnes + " alternative items with value");
            });
        });
        return result;
    }

    function isInt(value) {
        return value == "" || (!isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value)))
    }

    function isFloat(value) {
        if ( value == "" ) {
            return true;
        }
        value = parseFloat(value);
        if(isNaN(value)) {
            return false;
        }
        return true;
    }

    function isValidDate(input) {
        if ( input == "" ) {
            return true;
        }
        var bits = input.split('-');
        var d = new Date(bits[0], bits[1] - 1, bits[2]);
        return d.getFullYear() == bits[0] && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[2]);
    }


    function validateIntFields() {
        var result = true;
        $("*:not(.fixed)[datatype='int'], *:not(.fixed)[datatype='integer']").each(function() {
            var value = $(this).val();
            if ( !isInt(value) ) {
                error($(this), "NOT_AN_INT");
                // console.log("it is not");
                result = false;
            }
        });
        return result;
    }
    function validateFloatFields() {
        var result = true;
        $("*:not(.fixed)[datatype='real'], *:not(.fixed)[datatype='float'], *:not(.fixed)[datatype='double']").each(function() {
            var value = $(this).val();
            if ( !isFloat(value) ) {
                error($(this), "NOT_A_FLOAT");
                // console.log("it is not");
                result = false;
            }
        });
        return result;
    }

    function validateURI() {
        // TODO: Watch out - demo stuff!!!
        return true;

        var result = true;
        var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        $("*:not(.fixed)[datatype='URI'], *:not(.fixed)[datatype='URL']").each(function() {
            var value = $(this).val().toString();
            if ( value != "" && !pattern.test(value) ) {
                error($(this), "NOT_A_URI");
                result = false;
            }
        });
        return result;
    }

    function validateURN() {
        var result = true;
        var pattern = new RegExp('^urn:[a-z0-9]{0,31}:[a-z0-9()+,\-.:=@;$_!*\'%/?#]+$','i'); // fragment locator
        $("*:not(.fixed)[datatype='URN']").each(function() {
            var value = $(this).val().toString();
            if ( value != "" && !pattern.test(value) ) {
                error($(this), "NOT_A_URN");
                result = false;
            }
        });
        return result;
    }

    function validateDateRange() {
        var result = true;
        $("*:not(.fixed)[datatype='dateRange'][id$='_start']").each(function () {
            var baseId = $(this).attr("id").replace("_start", "");
            console.log("dateRange " + baseId);
            // either both with value or both without and syntax check
            if ( $(this).val() == "" && $("#" + baseId + "_end").val() == "" ) {

            }
            if ( $(this).val() > $("#" + baseId + "_end").val() ) {
                error($(this), "START_AFTER_END");
                result = false;
            }

        });
        return result;
    }

    function validateBoundingBox() {
        var result = true;
        $("*:not(.fixed)[datatype='boundingBox'][id$='_northLatitude']").each(function () {
            var baseId = $(this).attr("id").replace("_northLatitude", "");
            console.log("boundingBox " + baseId);
            if ( parseFloat($(this).val()) < parseFloat($("#" + baseId + "_southLatitude").val()) ) {
                error($(this), "NORTH_BELOW_SOUTH");
                result = false;
            }

        });
        $("*:not(.fixed)[datatype='boundingBox'][id$='_eastLongitude']").each(function () {
            var baseId = $(this).attr("id").replace("_eastLongitude", "");
            console.log("boundingBox " + baseId);
            if ( parseFloat($(this).val()) < parseFloat($("#" + baseId + "_westLongitude").val()) ) {
                error($(this), "EAST_WEST_OF_WEST");
                result = false;
            }

        });
        return result;
    }

    function validateDate() {
        var result = true;
        $("*:not(.fixed)[datatype='date'], *:not(.fixed)[datatype='dateRange']").find("input[type='text']").each(function() {
            var value = $(this).val().toString();
            if ( value != "" && !isValidDate(value) ) {
                error($(this), "NOT_A_DATE");
                result = false;
            }
        });
        return result;
    }

    /**
     * Validate method<br>
     * It calls specific validation methods in turns and returns true or false<br>
     * A return value of true can happen in the presence of warnings, so make sure to check {@link getWarningCount} as well<br>
     * @method
     * @memberOf validator
     * @returns {boolean}
     *
     * No errors and possible warnings -> true<br>
     * At least one error -> false<br>
     *
     */
    function validate() {
        var result = true;
        errors = 0;
        warnings = 0;
        $(".invalid").removeClass("invalid");
        $(".error-message").remove();
        for ( var i = 0; i < validations.length; i++ ) {
            console.log("validator #" + i);
            result &= validations[i]();
        }

        edi.setLanguage(edi.uiLanguage());
        return result;
    }
    return {
        validate: validate,
        /**
         *
         * @method
         * @memberOf validator
         * @returns {number}
         */
        getWarningCount: function() {
            return warnings;
        },
        /**
         *
         * @method
         * @memberOf validator
         * @returns {number}
         */
        getErrorCount: function() {
            return errors;
        }
    }
})();