/**
 * Created by fabio on 19/11/14.
 */
var Element = (function() {
    function sortItems() {
        element.items.item.sort(function (a, b) {

            // convert to integers from strings
            a = a.outIndex;
            b = b.outIndex;
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
        addItem: function(item) {
            element.items.item.push(item);
            sortItems();
        }
    };

    return element;
});