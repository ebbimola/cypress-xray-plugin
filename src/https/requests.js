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
exports.REST = exports.AxiosRestClient = void 0;
var axios_1 = require("axios");
var fs_1 = require("fs");
var https_1 = require("https");
var logging_1 = require("../logging/logging");
var files_1 = require("../util/files");
var string_1 = require("../util/string");
var AxiosRestClient = /** @class */ (function () {
    function AxiosRestClient() {
        this.httpAgent = undefined;
        this.axios = undefined;
        this.options = undefined;
    }
    AxiosRestClient.prototype.init = function (options) {
        this.options = options;
    };
    AxiosRestClient.prototype.get = function (url, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAxios().get(url, __assign(__assign({}, config), { httpsAgent: this.getAgent() }))];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    AxiosRestClient.prototype.post = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getAxios().post(url, data, __assign(__assign({}, config), { httpsAgent: this.getAgent() }))];
            });
        });
    };
    AxiosRestClient.prototype.put = function (url, data, config) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getAxios().put(url, data, __assign(__assign({}, config), { httpsAgent: this.getAgent() }))];
            });
        });
    };
    AxiosRestClient.prototype.getAgent = function () {
        var _a, _b, _c, _d;
        if (!this.httpAgent) {
            this.httpAgent = new https_1.Agent({
                ca: this.readCertificate((_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.ssl) === null || _b === void 0 ? void 0 : _b.rootCAPath),
                secureOptions: (_d = (_c = this.options) === null || _c === void 0 ? void 0 : _c.ssl) === null || _d === void 0 ? void 0 : _d.secureOptions,
            });
        }
        return this.httpAgent;
    };
    AxiosRestClient.prototype.getAxios = function () {
        if (!this.options) {
            throw new Error("Requests module has not been initialized");
        }
        if (!this.axios) {
            this.axios = axios_1.default;
            if (this.options.debug) {
                this.axios.interceptors.request.use(function (request) {
                    var _a;
                    var method = (_a = request.method) === null || _a === void 0 ? void 0 : _a.toUpperCase();
                    var url = request.url;
                    var timestamp = Date.now();
                    var filename = (0, files_1.normalizedFilename)("".concat(timestamp, "_").concat(method, "_").concat(url, "_request.json"));
                    var resolvedFilename = logging_1.LOG.logToFile({
                        url: url,
                        headers: request.headers,
                        params: request.params,
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                        body: request.data,
                    }, filename);
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Request:  ".concat(resolvedFilename));
                    return request;
                }, function (error) {
                    var _a, _b, _c;
                    var timestamp = Date.now();
                    var filename;
                    var data;
                    if ((0, axios_1.isAxiosError)(error)) {
                        var method = (_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.method) === null || _b === void 0 ? void 0 : _b.toUpperCase();
                        var url = (_c = error.config) === null || _c === void 0 ? void 0 : _c.url;
                        filename = (0, files_1.normalizedFilename)("".concat(timestamp, "_").concat(method, "_").concat(url, "_request.json"));
                        data = error.toJSON();
                    }
                    else {
                        filename = (0, files_1.normalizedFilename)("".concat(timestamp, "_request.json"));
                        data = error;
                    }
                    var resolvedFilename = logging_1.LOG.logToFile(data, filename);
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Request:  ".concat(resolvedFilename));
                    return Promise.reject(error instanceof Error ? error : new Error((0, string_1.unknownToString)(error)));
                });
                this.axios.interceptors.response.use(function (response) {
                    var _a;
                    var request = response.request;
                    var method = (_a = request.method) === null || _a === void 0 ? void 0 : _a.toUpperCase();
                    var url = response.config.url;
                    var timestamp = Date.now();
                    var filename = (0, files_1.normalizedFilename)("".concat(timestamp, "_").concat(method, "_").concat(url, "_response.json"));
                    var resolvedFilename = logging_1.LOG.logToFile({
                        data: response.data,
                        headers: response.headers,
                        status: response.status,
                        statusText: response.statusText,
                    }, filename);
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Response: ".concat(resolvedFilename));
                    return response;
                }, function (error) {
                    var _a, _b, _c;
                    var timestamp = Date.now();
                    var filename;
                    var data;
                    if ((0, axios_1.isAxiosError)(error)) {
                        var method = (_b = (_a = error.config) === null || _a === void 0 ? void 0 : _a.method) === null || _b === void 0 ? void 0 : _b.toUpperCase();
                        var url = (_c = error.config) === null || _c === void 0 ? void 0 : _c.url;
                        filename = (0, files_1.normalizedFilename)("".concat(timestamp, "_").concat(method, "_").concat(url, "_response.json"));
                        data = error.toJSON();
                    }
                    else {
                        filename = (0, files_1.normalizedFilename)("".concat(timestamp, "_response.json"));
                        data = error;
                    }
                    var resolvedFilename = logging_1.LOG.logToFile(data, filename);
                    logging_1.LOG.message(logging_1.Level.DEBUG, "Response: ".concat(resolvedFilename));
                    return Promise.reject(error instanceof Error ? error : new Error((0, string_1.unknownToString)(error)));
                });
            }
        }
        return this.axios;
    };
    AxiosRestClient.prototype.readCertificate = function (path) {
        if (!path) {
            return undefined;
        }
        return (0, fs_1.readFileSync)(path);
    };
    return AxiosRestClient;
}());
exports.AxiosRestClient = AxiosRestClient;
exports.REST = new AxiosRestClient();
