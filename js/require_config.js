requirejs.config({
    baseUrl: 'js',
    paths: {
        baseDeps: ["jquery-dateFormat.min", "raphael-2.1.0-min", "qrcodesvg"],
        renderers: ["renderers/autocompletion", "renderers/boolean", "renderers/bounding_box", "renderers/combobox", "renderers/date", "renderers/date_range", "renderers/function", "renderers/image", "renderers/label", "renderers/qrcode", "renderers/textbox"],
        renderer: ['renderers/generic']
    }
});
/*
 // requirejs(['renderers']);
 require();

 require(["autocompletion", "boolean", "bounding_box", "combobox", "date", "date_range", "function", "image", "label", "qrcode", "textbox"]);
 */
