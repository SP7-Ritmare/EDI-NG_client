import util from "node:util";

import fs from "node:fs";

import {Logger, LogLevel} from "ask-logger";

import express from "express";

import bodyParser from "body-parser";

import cors from "cors";

import {fileURLToPath} from "url";
import ExecFile from "node:child_process";
import * as path from "path";
import {TestRouter} from "./domain/controllers/test-controller.js";
import {TemplateController} from "./domain/controllers/template-controller.js";
import {DatasourceController} from "./domain/controllers/datasource-controller.js";

const execFile = util.promisify(ExecFile.execFile);
const logger = Logger.getLogger("Node Launcher")
logger.set_level(LogLevel.DEBUG)

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

async function buildAngular() {
/*
  logger.info("Building angular project")
  const { error, stdout, stderr } = await execFile("ng", ["build", "--base-href", "/"], {cwd: ".."});
  logger.info(`External Program's output:\n ${stdout}`);
  if (error) {
    logger.error("Error building angular", error)
    process.exit(1)
  }
*/
  logger.info("Copying static web contents")
  fs.cpSync("../test.html", "./src/static/index.html")
  fs.cpSync("../js", "./src/static/js", {recursive: true, overwrite: true})
  fs.cpSync("../templates", "./src/static/templates", {recursive: true, overwrite: true})
  fs.cpSync("../xslt", "./src/static/xslt", {recursive: true, overwrite: true})
  fs.cpSync("../images", "./src/static/images", {recursive: true, overwrite: true})
  fs.cpSync("../fonts", "./src/static/fonts", {recursive: true, overwrite: true})
  fs.cpSync("../css", "./src/static/css", {recursive: true, overwrite: true})
  fs.cpSync("../font-awesome-4.5.0", "./src/static/font-awesome-4.5.0", {recursive: true, overwrite: true})
  logger.info("Ready")
}

const main = async () => {
  await buildAngular();

  const app = express();

// set the view engine to ejs
  app.set('view engine', 'ejs');
  app.use(bodyParser.json())
  app.use(cors())

  app.use((req, res, next) => {
    console.log(req.method, req.path)
    if (next) next()
  })

/*
  function getSparqlQuery(uri, currentMetadataLanguage) {
    var sparql;
    sparql = `
        PREFIX rdfs:<http://www.w3.org/2000/01/rdf-schema#>
        PREFIX dct:<http://purl.org/dc/terms/>
        PREFIX rdf:<http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos:<http://www.w3.org/2004/02/skos/core#>

        SELECT DISTINCT <${uri}> AS ?uri ?c ?l ?a ?z
        WHERE {
        	{
        	  ?c rdf:type skos:Concept.
        	  ?c skos:inScheme <${uri}>.
        	  OPTIONAL {
        	      ?c skos:prefLabel ?l.
        	      FILTER ( LANG(?l) = "en" )
        	  }
        	}

        	OPTIONAL {
        	    ?c skos:prefLabel ?z.
        	    FILTER ( LANG(?z) = "zxx" )
        	}
        	OPTIONAL {
        	    ?c skos:prefLabel ?a.
        	    FILTER ( LANG(?a) = "${currentMetadataLanguage}" )
        	}

        }
        ORDER BY ASC(?a) ASC(?l)`;
    // doDebug(sparql);
    return sparql
  };

// use res.render to load up an ejs view file

// index page
  app.get('/:filename', async (req, res) => {
    const templateFilename = `${__dirname}/templates/${req.params.filename}`
    if (fs.existsSync(templateFilename)) {
      const template = new Template()
      await template.load(templateFilename)
      res.render('pages/test', {template});
    } else {
      res.status(404)
    }
  });

// about page
  app.get('/proxy/!*', (req, res) => {
    const query = req.params[0] + '?' + req.query
    console.log('body', req.body)
    console.log('querystring', req.query)
    console.log('query', req.query.query)
    console.log('proxying', query)

    res.json({
      url: query
    })
  });

  app.post('/codelist', async (req, res) => {
    console.log('body', req.body)
    const query = getSparqlQuery(req.body.uri, req.body.language)
    console.log('query', query)
    const body = req.body
    const payload = {
      save: 'display',
      format: 'application/sparql-results+json',
      query: query
    }

    var formBody = [];
    for (var property in payload) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(payload[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    const response = await fetch(`${body.baseUrl}`, {
      'Accept': 'application/sparql-results+json',
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    })
    console.log('status', response.status, response.statusText, body)
    if (response.status == 200) {
      const results = await response.json()
      req.body.query = query
      res.json(results)
    } else {
      const body = await response.text()
      res.json({
        status: response.status,
        message: response.statusText,
        body: body
      })
    }
  })



*/
  app.use('/api/templates', TemplateController)
  app.use('/api/datasources', DatasourceController)
  // app.use('/templates', express.static(`${__dirname}/templates`))
  app.use('/assets', express.static(`${__dirname}/assets`))

  console.log('client is at', `${__dirname}/static`)
  app.use('/', express.static(`${__dirname}/static`))

/*
  app.get('/', (req, res) => {
    console.log('/test')
    // res.render(`pages/test.ejs`)
    res.redirect('/client')
  })
*/


  app.listen(8080);
  console.log('Server is listening on port 8080');

}

main()
