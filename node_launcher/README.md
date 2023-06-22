# EDI Client Launcher

This program takes care of several housekeeping task on behalf of EDI Client:
* when invoked from **within the docker build** phase
  * it compiles the latest sources into a dist directory
  * it moves the distribution files into its own static web root
  * it copies all default templates into the web root
* when invoked from **within a running container**
  * it serves EDI Client via http on a configurable port number
  * it provides EDI Client for templates and various assets (pictures, CSS, javascript, ...)
  * by default it overrides all **metadataEndpoint**s to the local EDI Server 
* when launched **from the command line** it runs both previous tasks, but it will expect a running EDI Server and its PostgreSQL database instance

## Configuring the launcher

The launcher is configured via **environment variables**.

| Environment variable           | Effect                                                                 | Default value                                       |
|--------------------------------|------------------------------------------------------------------------|-----------------------------------------------------|
| PORT                           | defines the port the launcher will be listening on                     | 8080                                                |
| PREPARING_DOCKER               | makes it act as if it had been launched inside **docker build**        | false                                               |
| RUNNNG_IN_DOCKER               | makes it act as if it had been launched inside a container             | false                                               |
| DO_OVERRIDE_METADATA_ENDPOINT  | if false it will inhibit overriding of **metadataEndpoint**s           | true                                                |
| METADATA_ENDPOINT_OVERRIDE     | overrides all **metadataEndpoint**s with specified URL                 | server (meaning base URL of the launcher + /server) |
| WHOAMI                         | the info to pass to EDI Client about the GET-IT instance it is part of | NoSK                                                |
| STARTER_KIT_URI                | the GET-IT instance URI to pass to EDI Client                          | NoURI                                               |

## Starting the launcher

The launcher is started automatically during **docker build** and by the **docker container**.

To launch it from the command line, for development or testing purposes:
```bash
cd node_launcher
node src/index.js
```
 ## REST APIs

| Method | Path                              | Description                                                                                                           | Returns                          |
|-------|-----------------------------------|-----------------------------------------------------------------------------------------------------------------------|----------------------------------|
| GET   | /index.html                       | Returns a page with links to all available templates                                                                  | HTML page                        |
| GET   | /api/templates                    | Returns an array of all available template names                                                                      | JSON array of strings            |
| GET   | /api/templates/:template_filename | Returns the template with overridden **metadataEndpoint** if **DO_OVERRIDE_METADATA_ENDPOINT** is true                | XML for template                 |
| GET   | /assets/*                         | Mediates access for EDI Client to its assets                                                                          | Any format, depending on request |
| GET   | /*.html                           | Builds an HTML page to access the template having the same name as the HTML requested with ".html" replaced by ".xml" | HTML                             |
| <any> | /server/*                         | Proxies all requests to the local metadata endpoint                                                                   | depends on request               |



