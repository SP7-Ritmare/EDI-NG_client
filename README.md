EDI-NG_client
=============
EDI-NG (Next Generation) is a configurable HTML form page generator.
Its purpose is to provide advanced forms with validation features in order to create geo-metadata.

Form pages are defined using XML files called templates.
Once the form is filled in, it gets posted to a back end (namely EDI-NG_server, https://github.com/SP7-Ritmare/EDI-NG_server), which will create a metadata XML file based on the rules defined in the XML template file.

You can find plenty of template samples in the [dist/templates](https://github.com/SP7-Ritmare/EDI-NG_client/tree/master/dist/templates) directory.
These template files are meant both as an example and as part of projects we are working at.
> Please note that the ***metadataEndpoint***s and ***datasource*** URIs point to our own endpoints, so you will need to customise them based on your own overall architecture

Creating a form based on a template file saved locally as "TEST_v1.00.xml" is as easy as using a javascript snippet like this inside a pure HTML page:
```javascript
  $(window).load(function() {
      edi.loadLocalTemplate("TEST", "1.00", onTemplateLoaded);
  });
```
> # Warning
> Due to CORS policies, some browsers might not allow loading from local files (i.e. local templates)
> In this case load templates from http(s) as in:
>```javascript
>  $(window).load(function() {
>      edi.loadTemplate("TEST", "1.00", onTemplateLoaded);
>  });
>```

# Quick Start
If you just need to run EDI-NG client, all you need to do is in the [dist](https://github.com/SP7-Ritmare/EDI-NG_client/tree/master/dist) directory.
You can then deploy directory contents to a Web Server of your choice, or access it via the filesystem.
> The "templates" directory contains a few sample templates: you should customise them to point to your own [EDI-NG_server](https://github.com/SP7-Ritmare/EDI-NG_server.git) installation.
> To do that, replace content of the 
```xml
<metadataEndpoint>...</metadataEndpoint>
```
tag.

# Advanced installation topics
This project is managed by means of the [bower](http://bower.io)/[grunt](http://gruntjs.com) pair.
With "bower" we keep dependencies while we use "grunt" to create and populate the working directories and the [dist](https://github.com/SP7-Ritmare/EDI-NG_client/tree/master/dist) output folder.

Please refer to the [bower.json](https://github.com/SP7-Ritmare/EDI-NG_client/blob/master/bower.json) for info about this project's dependencies.

If you need to customise this software more deeply, on the other hand, you can do so by editing the bower.json file and then running 
```bash
bower update
```
and 
```bash
grunt
```
in sequence.

# External dependencies
All external dependencies can be found in the [bower.json](https://github.com/SP7-Ritmare/EDI-NG_client/blob/master/bower.json), except for [Google Code Prettify](https://code.google.com/archive/p/google-code-prettify/), which is used only for debug purposes, so unused most of the time.

# Copyright information

Copyright (C) 2013:

Anna Basoni - IREA CNR,
Mauro Bastianini - ISMAR CNR,
Cristiano Fugazza - IREA CNR,
Simone Lanucara - IREA CNR,
Stefano Menegon - ISMAR CNR,
Tiziano Minuzzo - ISMAR CNR,
Alessandro Oggioni - IREA CNR,
Fabio Pavesi - IREA CNR,
Monica Pepe - IREA CNR,
Alessandro Sarretta - ISMAR CNR,
Paolo Tagliolato - IREA CNR,
Andrea Vianello - ISMAR CNR,
Paola Carrara - IREA CNR

# Support contact
For support or suggestions you can use the GitHub Issue Tracker, or email fabio(at)adamassoft.it
