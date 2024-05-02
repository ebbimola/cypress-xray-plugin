"use strict";
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
exports.JwtCredentials = exports.PatCredentials = exports.BasicAuthCredentials = void 0;
var requests_1 = require("../https/requests");
var logging_1 = require("../logging/logging");
var base64_1 = require("../util/base64");
var dedent_1 = require("../util/dedent");
var errors_1 = require("../util/errors");
var time_1 = require("../util/time");
/**
 * A basic authorization credentials class, storing base64 encoded credentials of usernames and
 * passwords.
 */
var BasicAuthCredentials = /** @class */ (function () {
    /**
     * Constructs new basic authorization credentials.
     *
     * @param username - the username
     * @param password - the password
     */
    function BasicAuthCredentials(username, password) {
        // See: https://developer.atlassian.com/server/jira/platform/basic-authentication/#construct-the-authorization-header
        this.encodedCredentials = (0, base64_1.encode)("".concat(username, ":").concat(password));
    }
    BasicAuthCredentials.prototype.getAuthorizationHeader = function () {
        var _a;
        return _a = {},
            _a["Authorization"] = "Basic ".concat(this.encodedCredentials),
            _a;
    };
    return BasicAuthCredentials;
}());
exports.BasicAuthCredentials = BasicAuthCredentials;
/**
 * A personal access token (_PAT_) credentials class, storing a secret token to use during HTTP
 * authorization.
 */
var PatCredentials = /** @class */ (function () {
    /**
     * Constructs new PAT credentials from the provided token.
     *
     * @param token - the token
     */
    function PatCredentials(token) {
        this.token = token;
    }
    PatCredentials.prototype.getAuthorizationHeader = function () {
        var _a;
        return _a = {},
            _a["Authorization"] = "Bearer ".concat(this.token),
            _a;
    };
    return PatCredentials;
}());
exports.PatCredentials = PatCredentials;
/**
 * A JWT credentials class, storing a JWT token to use during HTTP authorization. The class is
 * designed to retrieve fresh JWT tokens from an authentication URL/endpoint. Once retrieved, the
 * token will be stored and reused whenever necessary.
 */
var JwtCredentials = /** @class */ (function () {
    /**
     * Constructs new JWT credentials. The client ID and client secret will be used to retrieve a
     * JWT token from the authentication URL on demand.
     *
     * @param clientId - the client ID
     * @param clientSecret - the client secret
     * @param authenticationUrl - the authentication URL/token endpoint
     */
    function JwtCredentials(clientId, clientSecret, authenticationUrl) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.authenticationUrl = authenticationUrl;
        this.token = undefined;
    }
    /**
     * Return the URL to authenticate to.
     *
     * @returns the URL
     */
    JwtCredentials.prototype.getAuthenticationUrl = function () {
        return this.authenticationUrl;
    };
    JwtCredentials.prototype.getAuthorizationHeader = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            var _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _c = {};
                        _a = "Authorization";
                        _b = "Bearer ".concat;
                        return [4 /*yield*/, this.getToken()];
                    case 1: return [2 /*return*/, (_c[_a] = _b.apply("Bearer ", [_d.sent()]),
                            _c)];
                }
            });
        });
    };
    JwtCredentials.prototype.getToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var progressInterval, tokenResponse, jwtRegex, error_1, message;
            var _a;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.token) return [3 /*break*/, 7];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        progressInterval = (0, time_1.startInterval)(function (totalTime) {
                            logging_1.LOG.message(logging_1.Level.INFO, "Waiting for ".concat(_this.authenticationUrl, " to respond... (").concat(totalTime / 1000, " seconds)"));
                        });
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, , 4, 5]);
                        logging_1.LOG.message(logging_1.Level.INFO, "Authenticating to: ".concat(this.authenticationUrl, "..."));
                        return [4 /*yield*/, requests_1.REST.post(this.authenticationUrl, (_a = {},
                                _a["client_id"] = this.clientId,
                                _a["client_secret"] = this.clientSecret,
                                _a))];
                    case 3:
                        tokenResponse = _b.sent();
                        jwtRegex = /^[A-Za-z0-9_-]{2,}(?:\.[A-Za-z0-9_-]{2,}){2}$/;
                        if (jwtRegex.test(tokenResponse.data)) {
                            logging_1.LOG.message(logging_1.Level.DEBUG, "Authentication successful.");
                            this.token = tokenResponse.data;
                            return [2 /*return*/, tokenResponse.data];
                        }
                        else {
                            throw new Error("Expected to receive a JWT token, but did not");
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        clearInterval(progressInterval);
                        return [7 /*endfinally*/];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _b.sent();
                        message = (0, errors_1.errorMessage)(error_1);
                        logging_1.LOG.message(logging_1.Level.ERROR, (0, dedent_1.dedent)("\n                        Failed to authenticate to: ".concat(this.authenticationUrl, "\n\n                        ").concat(message, "\n                    ")));
                        logging_1.LOG.logErrorToFile(error_1, "authentication");
                        throw new errors_1.LoggedError("Authentication failed");
                    case 7: return [2 /*return*/, this.token];
                }
            });
        });
    };
    return JwtCredentials;
}());
exports.JwtCredentials = JwtCredentials;
