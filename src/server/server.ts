'use strict';

import * as express from 'express';

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

        // configure application
        this.config();
    }

    public config() {
        this.app.get('/', (req, res) => {
            let message = {
                message: 'ok'
            };
            res.status(200).send(message);
        });
    }

    public run() {
        this.app.listen(3000, function() {
            console.log('Listening on port 3000');
        });
    }
}
