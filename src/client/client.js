"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var logging_1 = require("../logging/logging");
var time_1 = require("../util/time");
/**
 * A basic client interface which stores credentials data used for communicating with a server.
 */
var Client = /** @class */ (function () {
    /**
     * Construct a new client using the provided credentials.
     *
     * @param apiBaseUrl - the base URL for all HTTP requests
     * @param credentials - the credentials to use during authentication
     */
    function Client(apiBaseUrl, credentials) {
        this.apiBaseUrl = apiBaseUrl;
        this.credentials = credentials;
    }
    /**
     * Return the client's credentials;
     *
     * @returns the credentials
     */
    Client.prototype.getCredentials = function () {
        return this.credentials;
    };
    /**
     * Starts an informative timer which tells the user for how long they have
     * been waiting for a response already.
     *
     * @param url - the request URL
     * @returns the timer's handler
     */
    Client.prototype.startResponseInterval = function (url) {
        return (0, time_1.startInterval)(function (totalTime) {
            logging_1.LOG.message(logging_1.Level.INFO, "Waiting for ".concat(url, " to respond... (").concat(totalTime / 1000, " seconds)"));
        });
    };
    return Client;
}());
exports.Client = Client;
