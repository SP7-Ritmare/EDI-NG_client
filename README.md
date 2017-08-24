# EDI-NG Client

This is a WIP for the new version of EDI-NG Client.

## Changes
* Completely rewritten
* Switched to Angular 4
* Now interacts with EDI Catalogue

## Installation
EDI_NG Client now requires an HTTP server (nginx, apache, nodejs+express, ...).

1. *git clone* this repository to your directory
2. build with *ng build* (set the --base-href switch accordingly, in case you deploy to a path that is not the root of your web server)
3. compilation will produce a *dist* directory, which contains the files you need to deploy to your web server

## Template customisation
Templates are stored in the *src/assets/templates* working directory (they will be copied to *dist/assets/templates* by the build step).

In order to show templates in the *Local templates* page, you'll need to edit the *src/app/components/template-selector/template-selector.component.ts* file (**Warning: this is a temporary workaround; the configuration will eventually be moved to a JSON configuration file**)