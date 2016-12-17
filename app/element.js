/**
 * @class
 * @author Fabio Pavesi (fabio@adamassoft.it)
 *
 * @property {String} id - ID of the element
 * @property {String} root - append point for the element in destination XML
 * @property {String} mandatory - can be "true" or "false"
 * @property {String} represents_element - if element is a clone, the base element it was cloned from, otherwise the ID
 * @property {Item[]} items - array of items inside this element
 */
var Element = (function() {
    function baseSortItems() {
        element.items.item.sort(function (a, b) {

            // convert to integers from strings
            a = a.hasIndex;
            b = b.hasIndex;
            if ( a && b ) {
                // compare
                if(a > b) {
                    return 1;
                } else if(a < b) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });
    }
    function sortItems() {
        element.items.item.sort(function (aa, bb) {

            // convert to integers from strings
            var a = parseInt(aa.outIndex);
            var b = parseInt(bb.outIndex);
            if ( a && b ) {
                // compare
                if(a > b) {
                    return 1;
                } else if(a < b) {
                    return -1;
                } else {
                    return 0;
                }
            } else {
                return 0;
            }
        });
    }
    var element = {
        id: undefined,
        root: undefined,
        mandatory: undefined,
        represents_element: undefined,
        items: {
            item: []
        },
        /**
         *
         * @method
         * @memberOf Element
         * @param item
         */
        addItem: function(item) {
            element.items.item.push(item);
            baseSortItems();
            sortItems();
        }
    };

    return element;
});