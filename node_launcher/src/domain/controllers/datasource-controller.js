import express from "express";
import fetch from "node-fetch";
export const DatasourceController = express.Router()

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

DatasourceController.post('/test', async (req, res) => {
  const incoming_payload = req.body
  console.log('payload', incoming_payload)
  const payload = incoming_payload.query
  const contentType = (incoming_payload.method.toLowerCase() === 'post' ? incoming_payload.accepts : 'application/x-www-form-urlencoded')

  var formBody = [];
  for (var property in payload) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(payload[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  const response = await fetch(incoming_payload.url, {
    'Accept': incoming_payload.accepts,
    method: 'post', // incoming_payload.method,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody
  })
  console.log('status', response.status, response.statusText, incoming_payload)
  if (response.status === 200) {
    const results = await response.json()
//    req.body.query = query
    res.json(results)
  } else {
    const body = await response.text()
    res.json({
      status: response.status,
      message: response.statusText,
      body: body
    })
  }

  // res.json(payload)
})
DatasourceController.post('/codelist', async (req, res) => {
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
  if (response.status === 200) {
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

