'use strict';

import * as express from 'express';
import * as cors from 'cors';
import * as q from 'q';
import * as request from 'request';
const bodyParser = require('body-parser');

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {
        // create expressjs application
        this.app = express();
        this.app.use(bodyParser.json());

        this.app.use(cors());

        // configure application
        this.config();
    }

    public getFromProxy(url: string, req: any, params: any, body: any) {
        console.log('Proxying to ' + url);

        const deferred = q.defer();
        request({
            url: url,
            uri: url,
            method: 'GET',
            headers: {
                'content-type': 'application/json',
            },
            qs: req,
            json: true,
            body: body
        }, function (error: any, response: any, body: any) {
            console.log(error);
            console.log(response);
            console.log(body);
            deferred.resolve(response);
        });
        return deferred.promise;
    }

    public config() {
        this.app.get('/', (req, res) => {
            let message = {
                status: 200,
                message: 'ok'
            };
            res.status(200).send(message);
        });
        this.app.get('/proxy', function (req, res) {
            const url = req.query.proxyTo ? req.query.proxyTo : req.query.url;
            delete req.query.proxyTo;
            delete req.query.url;
            console.log(req.query);
            console.log(req.body);
            this.getFromProxy(url, req.query, req.params, req.body).then((response: any) => {
                res.set(response.headers);
                res.status(200).send(response.body);
            });
        });


    }

    public run() {
        this.app.listen(3000, function () {
            console.log('Listening on port 3000');
        });
    }
}
