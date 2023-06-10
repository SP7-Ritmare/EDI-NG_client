// import X2JS from '../../utils/xml2json.js'
import {Logger, availableContexts} from '../../utils/logger.js'
// import {EndpointType} from "./endpointtype.js";
import fetch from 'node-fetch'
import fs from 'fs'
import {XMLParser} from "fast-xml-parser";

const logger = new Logger(availableContexts.TEMPLATE);

export class Template {
  constructor() {
    this.ready = false;
  }

  async load(filename) {
    console.log('about to load template', filename)
    this.filename = filename
    let data
    if (filename.startsWith('http')) {
      const response = await fetch(filename)
      data = await response.text()
    } else {
      data = fs.readFileSync(filename)
    }
    console.log('xml', data)
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "",
      attributesGroupName: "attrs",
      alwaysCreateTextNode: true,
      commentPropName: "#comment"
    }
    const parser = new XMLParser(options);
    let xml = parser.parse(data);
    console.log('parsed', xml)
    for (let key in xml.template) {
      this[key] = xml.template[key]
    }
    this.fixOneItemArrays()
    fs.writeFileSync('template.json', JSON.stringify(xml, null, 4), 'utf-8')

    this.ready = true
    /*
            // const xml = new window.DOMParser().parseFromString(data, "text/xml")
            var x2j = new X2JS({});
            const json = x2j.xml2json(xml);
            for (let p in json.template) {
                this[p] = json.template[p]
            }
            this.ready = true
            this.fixOneItemArrays()
            console.log('template', this)
    */
  }

  fixOneItemArrays() {
    // XML arrays with one item will be converted, in JSON, to plain objects
    // we need to fix this
    if (!isArray(this.group)) {
      this.group = [this.group];
    }
    console.log('this', this)
    if (!isArray(this.settings.xsltChain.xslt)) {
      this.settings.xsltChain.xslt = [this.settings.xsltChain.xslt];
    }

    function isArray(element) {
      return Array.isArray(element);
    }

    if (this.endpointTypes) {
      if (!isArray(this.endpointTypes.endpointType)) {
        this.endpointTypes.endpointType = [this.endpointTypes.endpointType];
      }
      for (let e of this.endpointTypes.endpointType) {
        if (!isArray(e.parameters.parameter)) {
          e.parameters.parameter = [e.parameters.parameter]
        }
      }
      /*
                  let endpointTypes = {}
                  for (var i = 0; i < this.endpointTypes.endpointType.length; i++) {
                      var e = this.endpointTypes.endpointType[i];
                      logger.log(e);
                      var endpointType = new EndpointType(e);
                      logger.log('The object: ', endpointType);
                      endpointTypes[e['xml:id']] = endpointType;
                  }
                  this.endpointTypes = endpointTypes
      */
    }

    if (this.datasources) {
      /*
                  const dataSources = []
                  const dss = this.datasources.datasource;
                  for (let i = 0; i < dss.length; i++) {
                      logger.log(dss[i]);
                      const ds = new DataSource({
                          id: dss[i].id,
                          type: dss[i].type,
                          uri: dss[i].uri,
                          url: ( dss[i].url ? dss[i].url : this.settings.sparqlEndpoint),
                          endpointType: dss[i].endpointType,
                          query: dss[i].query,
                          searchItem: dss[i].searchItem,
                          triggerItem: dss[i].triggerItem,
                          singleton: dss[i].singleton,
                          ready: function (data) {
                              // logger.log("ds callback success");
                              // logger.log(data);
                          }
                      });
                      logger.log("Adding datasource " + ds.getId());
                      dataSources.push(ds);
                  }

                  this.datasources = dataSources
      */
    }

    for (var i = 0; i < this.group.length; i++) {
      if (!isArray(this.group[i].element)) {
        this.group[i].element = [this.group[i].element];
      }
      for (var j = 0; j < this.group[i].element.length; j++) {
        if (this.group[i].element[j].produces) {
          if (!isArray(this.group[i].element[j].produces.item)) {
            this.group[i].element[j].produces.item = [this.group[i].element[j].produces.item];
          }
        }
      }
    }
  }
}

export const test = async (filename) => {
  const t = new Template(filename)
}
