/**
 * Created by fabio on 06/03/2017.
 */
"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.stringToBoolean = function (s) {
        return (s === 'true');
    };
    return Utils;
}());
exports.Utils = Utils;
