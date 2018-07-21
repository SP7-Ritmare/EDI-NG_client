module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            main: {
                expand: true,
                src: 'bower_components/EDI-NG_templates/templates/*',
                dest: 'templates/',
                flatten: true
            },
            mainDist: {
                expand: true,
                src: 'bower_components/EDI-NG_templates/templates/*',
                dest: 'dist/templates/',
                flatten: true
            },
            html: {
                expand: true,
                src: 'bower_components/EDI-NG_templates/html/*',
                dest: '',
                flatten: true
            },
            htmlDist: {
                expand: true,
                src: 'bower_components/EDI-NG_templates/html/*',
                dest: 'dist',
                flatten: true
            },

            js: {
                expand: true,
                src: 'js/assets.js',
                dest: 'dist',
                flatten: false
            },
            FileSaver: {
                expand: true,
                src: 'bower_components/file-saver/FileSaver.js',
                dest: 'js',
                flatten: true
            },
            bootstrapJs: {
                expand: true,
                src: 'bower_components/bootstrap/dist/js/*.js',
                dest: 'js',
                flatten: true
            },
            bootstrapCss: {
                expand: true,
                src: 'bower_components/bootstrap/dist/css/*.css',
                dest: 'css',
                flatten: true
            },
            bootstrapFonts: {
                expand: true,
                src: 'bower_components/bootstrap/dist/fonts/*',
                dest: 'fonts',
                flatten: true
            },
            olJs: {
                expand: true,
                src: 'bower_components/openlayers3/build/*.js',
                dest: 'js',
                flatten: true
            },
            olJsDist: {
                expand: true,
                src: 'bower_components/openlayers3/build/ol.js',
                dest: 'dist/js',
                flatten: true
            },
            olCss: {
                expand: true,
                src: 'bower_components/openlayers3/build/*.css',
                dest: 'css',
                flatten: true
            },
            olCssDist: {
                expand: true,
                src: 'bower_components/openlayers3/build/ol.css',
                dest: 'dist/css',
                flatten: true
            },
            jquery: {
                expand: true,
                src: 'bower_components/jQuery/dist/*.js',
                dest: 'js',
                flatten: true
            },
            jqueryDateFormat: {
                expand: true,
                src: 'bower_components/jquery-dateFormat/dist/*.js',
                dest: 'js',
                flatten: true
            },
            jqueryDotString: {
                expand: true,
                src: 'bower_components/jquery-dotstring/*.js',
                dest: 'js',
                flatten: true
            },

            css: {
                expand: true,
                src: 'css/assets.css',
                dest: 'dist',
                flatten: false
            },
            fonts: {
                expand: true,
                src: 'fonts/**',
                dest: 'dist',
                flatten: false
            },
            images: {
                expand: true,
                src: 'images/**',
                dest: 'dist',
                flatten: false
            },
        },
        /*
         watch: {
         templates: {
         files: ["bower_components/EDI-NG_templates/templates/*"],
         tasks: ['copy', 'uglify']
         }
         },
         */
        uglify: {
            javascript: {
                files: {
                    'dist/assets.js': ['js/assets.js']
                }
            },
            /*
             css: {
             files: [{
             expand: true,
             cwd: 'css',
             src: 'assets.css',
             dest: 'dist/css'
             }]
             }
             */
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */',
            },
            css: {
                src: [
                    "css/bootstrap.css",
                    "css/bootstrap-theme.css",
                    "css/mdeditor.css",
                    "css/datepicker3.css",
                    "css/typeahead.css",
                    "http://www.get-it.it/cdn/ol/v3.2.0/css/ol.css",
                ],
                dest: 'css/assets.css'
            },
            js: {
                src: [
                    'js/defaults.js',
                    'js/localised_strings.js',
                    'js/validator.js',
                    'js/jquery.js',
                    'js/logger.js',
                    'js/jquery-ui.js',
                    'js/utils.js',
                    'js/sparql.js',
                    'js/endpointtype.js',
                    'js/datasource_adapters.js',
                    'js/datasource.js',
                    'js/datasourcepool.js',
                    'js/item.js',
                    'js/element.js',
                    'js/ediml.js',
                    'js/edi.js',
                    'js/xml2json.js',
                    'js/typeahead.jquery.js',
                    "js/renderers/generic.js",
                    "js/renderers/autocompletion.js",
                    "js/renderers/combobox.js",
                    "js/renderers/boolean.js",
                    "js/renderers/function.js",
                    "js/renderers/date.js",
                    "js/renderers/date_range.js",
                    "js/renderers/label.js",
                    "js/renderers/textbox.js",
                    "js/renderers/bounding_box.js",
                    "js/jquery-dateFormat.js",
                    "js/jquery.string.1.1.0.js",
                    "js/FileSaver.js",
                    "js/bootstrap.js",
                    "js/bootstrap-datepicker.js",
                    "js/langs.js",
                    "js/ol-debug.js"
                ],
                dest: 'js/assets.js',
            },
        },
    });


    // grunt.loadNpmTasks('grunt-bower-concat');
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-contrib-copy');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', [
        'copy',
        'concat',
        'copy:js',
        'copy:css'
    ]);
};
