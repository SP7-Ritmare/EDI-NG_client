# Dockerisation instructions

This directory contains files needed to create and optionally push an image containing:
* EDI Client
* EDI Client launcher
* EDI Server
* PostgreSQL 14 database for EDI_SERVER

# Building the image
## Dependencies
The [build.sh](build.sh) and [run.sh](run.sh) script depend on the **jq** utility to read JSON.
Jq can be installed on Debian-like distros with
``` apt install jq``` and on Mac with ```brew install jq```.

## How to build the image
The [build.sh](build.sh) script will build and (optionally) push your image.

With [config.json](config.json) you can customise the image.

For example:

```json
{
  "registry": "registry",
  "imageName": "edi-all-inclusive",
  "template_dir": "./templates"
}
```
will create an image named *registry/edi-all-inclusive*.

If *registry* is set to an empty string the image will be built and named *imageName* but no push will be attempted.

## Running the image
A utility [script](run.sh) is available in this directory.

It uses the [config.json](config.json) file to refer to the image built by the build script.

```json
{
  "registry": "registry.adamassoft.it",
  "imageName": "edi-all-inclusive",
  "template_dir": "./templates"
}
```

The *template_dir* property can be set to the directory you want the templates to be taken from, or it can be left empty if you want to use the default template set.

>    **Caution**
> 
> **Mounting a custom template directory is not fully supported yet.**
> 
> The default template set is currently modified to point to the **local metadataEndpoint**, overriding the one specified in each template.
> 
> If you choose to mount your custom template directory, the **metadataEndpoint**s will be the ones specified by each one of your templates. 
>

# Future developments

Templates are currently being modified when the application starts so that thei all point to the EDI Server included in the image.

They will soon be left in their original state and modified only on-the-fly when requested by EDI Client, and the feature will be enabled or disabled via an environment variable.
