import util from "node:util";
import fs from "node:fs";

import {Logger, LogLevel} from "ask-logger";

import express from "express";

import bodyParser from "body-parser";

body_parser_xml(bodyParser)
import cors from "cors";

import {fileURLToPath} from "url";
import ExecFile from "node:child_process";
import * as path from "path";
import {TestRouter} from "./domain/controllers/test-controller.js";
import {TemplateController} from "./domain/controllers/template-controller.js";
import {DatasourceController} from "./domain/controllers/datasource-controller.js";
import {Config} from "./config.js";
import run from "sync-runner";

import proxy from "express-http-proxy";

import body_parser_xml from "body-parser-xml";

import {createProxyMiddleware} from "http-proxy-middleware";
import {v4 as uuidv4} from 'uuid'

import ejs from "ejs";

const execFile = util.promisify(ExecFile.execFile);
const logger = Logger.getLogger("Node Launcher")
logger.set_level(LogLevel.DEBUG)

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

function getTemplateInfo(templateName) {
    if (templateName.startsWith('/')) templateName = templateName.substring(1)
    const filenameParts = templateName.split('/')
    templateName = filenameParts[filenameParts.length - 1]
    templateName = templateName.replace('.html', '')
    templateName = templateName.replace('.xml', '')
    let parts = templateName.split('_v')
    console.log('templateName', parts)
    if (parts.length < 2) {
        throw new Error('Html filename name must be in the form <template name>_v<version number>')
    }
    if (parts.length > 2) {
        let temp = parts[0]
        const results = []
        for (let i = 1; i < parts.length - 1; ++i) {
            if (i == 1) {
                temp += "_v" + parts[i]
            } else {
                temp += "_" + parts[i]
            }
        }
        parts = [temp, parts[parts.length - 1]]
    }
    return {name: parts[0], version: parts[1]}
}

function replaceMetadataEndpoint(contents, endpoint) {
    if (!endpoint) return contents

    if (!endpoint.endsWith('/')) endpoint = endpoint + '/'
    const regex = /<metadataEndpoint>(.*)<\/metadataEndpoint>/g
    return String(contents).replace(regex, `<metadataEndpoint>${endpoint}</metadataEndpoint>`)
}

async function clearDirectory(dir) {
    const result = run("rm -rf " + dir, ".")
    console.log(result)
}

async function deleteAllHTMLs(dir) {
    const result = run("rm " + dir + "/*.html", ".")
    console.log(result)
}

async function mkdirs(dir) {
    console.log("mkdir", ["-p", dir])
    const result = run("mkdir -p " + dir, ".")
    console.log(result)
}

async function createDownloadableClient() {
    const uuid = uuidv4()
    const destinationDir = Config.DOWNLOAD_DIR + '/' + uuid
    try {
        fs.mkdirSync(Config.DOWNLOAD_DIR, {
            recursive: true
        })
        const dirContents = fs.readdirSync(Config.DOWNLOAD_DIR)
        if (dirContents.length > 0) {
            console.error('A download set is already present')
            return
        }
        run(`mkdir -p ${destinationDir}/templates`)
        console.log('command:', `cp -R ./src/static/* ${destinationDir}/`)
        run(`cp -R ./src/static/* ${destinationDir}/`)
        for (let f of fs.readdirSync(Config.TEMPLATE_DIR)) {
            const filename = Config.TEMPLATE_DIR + '/' + f
            const htmlFilename = destinationDir + '/' + f.replace('.xml', '.html')
            try {
                const {name, version} = getTemplateInfo(filename)
                run(`cp ${filename} ${destinationDir}/templates/`)
                ejs.renderFile('./views/index.ejs', {
                    template: {
                        name: name,
                        version: version
                    }
                }, {}, (err, str) => {
                    if (!err) {
                        const htmlContents = str
                        fs.writeFileSync(htmlFilename, htmlContents)
                        console.log('template: ', name, version)
                    } else {
                        console.error('Error rendering HTML', err)
                    }
                })
            } catch (e) {
                console.error('Non a template format', f, e)
                run(`cp ${filename} ${destinationDir}/templates`)
            }
        }
        const command = `cd ${Config.DOWNLOAD_DIR}/${uuid}; zip -r ../${uuid}.zip *; cd ..; rm -rf ${uuid}`
        console.log('started zipping', command)
        const results = run(command, '.', 5000)
        console.log('done zipping', results)
    } catch (e) {
        console.error('Error creating download directory', e)
        run(`rm -rf ${destinationDir}`)
    }
}

async function copyTemplates(sourceDir, destDir, endpoint) {
    const regex = /<metadataEndpoint>(.*)<\/metadataEndpoint>/gm
    const files = fs.readdirSync(sourceDir)
    for (let f of files) {
        const contents = fs.readFileSync(`${sourceDir}/${f}`).toString()
        let matches = String(contents).match(regex)
        if (matches && matches.length > 0) {
            console.log('Copying', f, matches[0])
            const newContent = replaceMetadataEndpoint(contents, endpoint)
            const newMatches = String(newContent).match(regex)
            console.assert(newMatches && newMatches.length > 0, "Couldn't find " + regex + " in generated content")
            console.log('Replaced:', regex.exec(newMatches[0]))
            fs.writeFileSync(`${destDir}/${f}`, newContent, {
                encoding: 'UTF-8'
            })
        } else {
            console.error("Couldn't find metadataEndpoint in ", f)
        }
    }
}

async function buildClient() {
    logger.info("Building client side")
    const {
        error1,
        stdout1,
        stderr1
    } = await execFile("node_modules/.bin/bower", ["--allow-root", "update"], {cwd: ".."});
    if (error1) {
        logger.error("Error running bower update", error1)
        process.exit(1)
    }

    const {error2, stdout2, stderr2} = await execFile("node_modules/.bin/grunt", [], {cwd: ".."});
    if (error2) {
        logger.error("Error running grunt", error2)
        process.exit(1)
    }

    await clearDirectory('./src/static/*')
    await mkdirs('./src/static/templates')

    logger.info("Copying static web contents")
    fs.cpSync("../dist", "./src/static/", {
        recursive: true
    })
    fs.cpSync("../test.html", "./src/static/index.html")
    fs.cpSync("../js", "./src/static/js", {recursive: true, overwrite: true})
    fs.cpSync("../templates", "./src/static/templates", {recursive: true, overwrite: true})
    fs.cpSync("../xslt", "./src/static/xslt", {recursive: true, overwrite: true})
    fs.cpSync("../images", "./src/static/images", {recursive: true, overwrite: true})
    fs.cpSync("../fonts", "./src/static/fonts", {recursive: true, overwrite: true})
    fs.cpSync("../css", "./src/static/css", {recursive: true, overwrite: true})
    fs.cpSync("../font-awesome-4.5.0", "./src/static/font-awesome-4.5.0", {recursive: true, overwrite: true})
    deleteAllHTMLs('./src/static')
    logger.info("Ready")
}

const main = async () => {
    if (!Config.RUNNNG_IN_DOCKER || Config.PREPARING_DOCKER) {
        // THis part is only needed while developing or while preparing a docker image
        await buildClient();
        // await copyTemplates(Config.TEMPLATE_DIR, Config.TEMPLATE_DIR, Config.METADATA_ENDPOINT_OVERRIDE || 'http://localhost:8086')
        await createDownloadableClient()
    }
    if (Config.PREPARING_DOCKER) {
        // if we are just preparing the image, then we are done here
        process.exit(0)
    }
    const app = express();

// set the view engine to ejs
    app.set('view engine', 'ejs');
    app.use(bodyParser.json())
    /*
        app.use(bodyParser.xml({
            limit: '100mb'
        }))
    */
    app.use(cors())

    app.get('/whoami', (req, res) => {
        res.json({
            sk_domain_name: Config.WHOAMI,
            uri: Config.STARTER_KIT_URI
        })
    })

    app.use((req, res, next) => {
        console.log(req.method, req.path)
        console.log('Accessed as', req.baseUrl)
        if (next) next()
    })

    app.get('/index.html', (req, res) => {
        const templates = fs.readdirSync(Config.TEMPLATE_DIR)
        const files = []
        for (let t of templates.filter(s => s.endsWith('.xml'))) {
            files.push({
                html: t.replace('.xml', '.html'),
                xml: t
            })
        }
        res.render('template_list', {
            files: files
        })
    })
    app.use('/api/templates', TemplateController)
    app.use('/api/datasources', DatasourceController)
    app.use('/assets', express.static(`${__dirname}/assets`))

    console.log('client is at', `${__dirname}/static`)
    app.get(/\/.*.html/, (req, res) => {
        let templateName = req.path;
        try {
            const {name, version} = getTemplateInfo(templateName)
            res.render('index', {
                template: {
                    name: name,
                    version: version
                }
            })
        } catch (e) {
            res.status(400)
            res.json({
                status: 400,
                message: e.message
            })
        }
    })

    app.use('/', express.static(`${__dirname}/static`))

    app.get('/server/rest/ediml/requestId', (req, res) => {
        res.json({
            id: 1
        })
    })

    app.use('/server', createProxyMiddleware({
        target: 'http://localhost:8086',
        changeOrigin: true,
        pathRewrite: {'^/server': ''},
        logLevel: "debug"
    }))

    app.listen(Config.PORT);
    console.log('Server is listening on port', Config.PORT);

}

main()
