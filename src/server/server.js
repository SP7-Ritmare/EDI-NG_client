'use strict';
var express = require('express');
/**
 * The server.
 *
 * @class Server
 */
var Server = (function () {
    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    function Server() {
        // create expressjs application
        this.app = express();
        // configure application
        this.config();
    }
    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    Server.bootstrap = function () {
        return new Server();
    };
    Server.prototype.config = function () {
        this.app.get('/', function (req, res) {
            var message = {
                message: 'ok'
            };
            res.status(200).send(message);
        });
    };
    Server.prototype.run = function () {
        this.app.listen(3000, function () {
            console.log('Listening on port 3000');
        });
    };
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map