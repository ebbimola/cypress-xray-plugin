"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingXrayCloud = exports.pingXrayServer = exports.pingJiraInstance = void 0;
var requests_1 = require("../https/requests");
var logging_1 = require("../logging/logging");
var dedent_1 = require("./dedent");
var errors_1 = require("./errors");
var help_1 = require("./help");
var time_1 = require("./time");
/**
 * Pings a Jira instance and verifies that:
 * - the URL is the base URL of a Jira instance
 * - the credentials belong to a valid Jira user
 *
 * @param url - the base URL of the Jira instance
 * @param credentials - the credentials of a valid Jira user
 * @see https://developer.atlassian.com/cloud/jira/platform/rest/v3/api-group-myself/#api-rest-api-3-myself-get
 * @see https://docs.atlassian.com/software/jira/docs/api/REST/9.11.0/#api/2/myself
 */
function pingJiraInstance(url, credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var progressInterval, header, userResponse, username, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Pinging Jira instance...");
                    progressInterval = (0, time_1.startInterval)(function (totalTime) {
                        logging_1.LOG.message(logging_1.Level.INFO, "Waiting for ".concat(url, " to respond... (").concat(totalTime / 1000, " seconds)"));
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    header = credentials.getAuthorizationHeader();
                    return [4 /*yield*/, requests_1.REST.get("".concat(url, "/rest/api/latest/myself"), {
                            headers: __assign({}, header),
                        })];
                case 2:
                    userResponse = _a.sent();
                    username = getUserString(userResponse.data);
                    if (username) {
                        logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                    Successfully established communication with: ".concat(url, "\n                    The provided Jira credentials belong to: ").concat(username, "\n                ")));
                    }
                    else {
                        throw new Error((0, dedent_1.dedent)("\n                    Jira did not return a valid response: JSON containing a username was expected, but not received\n                "));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    throw new Error((0, dedent_1.dedent)("\n                Failed to establish communication with Jira: ".concat(url, "\n\n                ").concat((0, errors_1.errorMessage)(error_1), "\n\n                Make sure you have correctly set up:\n                - Jira base URL: ").concat(help_1.HELP.plugin.configuration.jira.url, "\n                - Jira authentication: ").concat(help_1.HELP.plugin.configuration.authentication.jira.root, "\n\n                For more information, set the plugin to debug mode: ").concat(help_1.HELP.plugin.configuration.plugin.debug, "\n            ")));
                case 4:
                    clearInterval(progressInterval);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.pingJiraInstance = pingJiraInstance;
function getUserString(user) {
    var _a, _b;
    return (_b = (_a = user.displayName) !== null && _a !== void 0 ? _a : user.emailAddress) !== null && _b !== void 0 ? _b : user.name;
}
/**
 * Pings an Xray server instance and verifies that:
 * - the URL is the base URL of an Xray server instance
 * - the credentials belong to a user with a valid Xray license
 *
 * @param url - the base URL of the Xray server instance
 * @param credentials - the credentials of a user with a valid Xray license
 * @see https://docs.getxray.app/display/XRAY/v2.0#/External%20Apps/get_xraylicense
 */
function pingXrayServer(url, credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var progressInterval, header, licenseResponse, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Pinging Xray server instance...");
                    progressInterval = (0, time_1.startInterval)(function (totalTime) {
                        logging_1.LOG.message(logging_1.Level.INFO, "Waiting for ".concat(url, " to respond... (").concat(totalTime / 1000, " seconds)"));
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    header = credentials.getAuthorizationHeader();
                    return [4 /*yield*/, requests_1.REST.get("".concat(url, "/rest/raven/latest/api/xraylicense"), {
                            headers: __assign({}, header),
                        })];
                case 2:
                    licenseResponse = _a.sent();
                    if (typeof licenseResponse.data === "object" && "active" in licenseResponse.data) {
                        if (licenseResponse.data.active) {
                            logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                        Successfully established communication with: ".concat(url, "\n                        Xray license is active: ").concat(licenseResponse.data.licenseType, "\n                    ")));
                        }
                        else {
                            throw new Error("The Xray license is not active");
                        }
                    }
                    else {
                        throw new Error((0, dedent_1.dedent)("\n                    Xray did not return a valid response: JSON containing basic Xray license information was expected, but not received\n                "));
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_2 = _a.sent();
                    throw new Error((0, dedent_1.dedent)("\n                Failed to establish communication with Xray: ".concat(url, "\n\n                ").concat((0, errors_1.errorMessage)(error_2), "\n\n                Make sure you have correctly set up:\n                - Jira base URL: ").concat(help_1.HELP.plugin.configuration.jira.url, "\n                - Xray server authentication: ").concat(help_1.HELP.plugin.configuration.authentication.xray.server, "\n                - Xray itself: ").concat(help_1.HELP.xray.installation.server, "\n\n                For more information, set the plugin to debug mode: ").concat(help_1.HELP.plugin.configuration.plugin.debug, "\n\n            ")));
                case 4:
                    clearInterval(progressInterval);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.pingXrayServer = pingXrayServer;
/**
 * Pings Xray cloud and verifies that the credentials belong to a user with a valid Xray license.
 *
 * @param credentials - Xray cloud credentials
 * @see https://docs.getxray.app/display/XRAYCLOUD/Authentication+-+REST+v2
 */
function pingXrayCloud(credentials) {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Pinging Xray cloud...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, credentials.getAuthorizationHeader()];
                case 2:
                    _a.sent();
                    logging_1.LOG.message(logging_1.Level.DEBUG, (0, dedent_1.dedent)("\n                Successfully established communication with: ".concat(credentials.getAuthenticationUrl(), "\n                The provided credentials belong to a user with a valid Xray license\n            ")));
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    throw new Error((0, dedent_1.dedent)("\n                Failed to establish communication with Xray: ".concat(credentials.getAuthenticationUrl(), "\n\n                ").concat((0, errors_1.errorMessage)(error_3), "\n\n                Make sure you have correctly set up:\n                - Xray cloud authentication: ").concat(help_1.HELP.plugin.configuration.authentication.xray.cloud, "\n                - Xray itself: ").concat(help_1.HELP.xray.installation.cloud, "\n\n                For more information, set the plugin to debug mode: ").concat(help_1.HELP.plugin.configuration.plugin.debug, "\n            ")));
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.pingXrayCloud = pingXrayCloud;
